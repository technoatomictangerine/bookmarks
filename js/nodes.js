var tab_cols, popup, input_name, input_url;
var storage = window.localStorage;
//storage.clear();

function addNodePopup() {
	if (popup) {
		popup.style.display = 'block-inline';
	}else{
		popup = document.createElement('div');
		popup.id = 'popup';

		let div = document.createElement('div');
		div.className = 'container';

		let title = document.createElement('div');
		title.className = 'title';
		title.innerHTML = 'Добавить закладку';

		let cls = document.createElement('a');
		cls.style.top = '5px';
		cls.style.right = '15px';
		cls.className = 'close-btn';
		cls.href = '#';
		cls.addEventListener('click', function(){
			if (popup) {
				popup.style.display = 'none';
				popup.remove();
				popup = undefined;
			}
		})

		let label_name = document.createElement('label');
		label_name.innerText = 'Имя: ';

		let label_url = document.createElement('label');
		label_url.innerText = 'Адрес: ';

		input_name = document.createElement('input');
		input_name.id = 'input-dial-name';
		input_name.setAttribute('type', 'text');
		input_name.setAttribute('autocomplete', 'off');

		input_url = document.createElement('input');
		input_url.id = 'input-dial-url';
		input_url.setAttribute('type', 'text');
		input_url.setAttribute('autocomplete', 'off');

		let button = document.createElement('input');
		button.style.right = '10px';
		button.className = 'button';
		button.id = 'input-dial-accept';
		button.value = 'Принять';
		button.setAttribute('type', 'button');
		button.addEventListener('click', acceptInput);

		title.appendChild(cls);
		div.appendChild(title);
		div.appendChild(label_name);
		div.appendChild(input_name);
		div.appendChild(label_url);
		div.appendChild(input_url);
		div.appendChild(button);
		popup.appendChild(div);

		let onkey = function(ev) {
			if (ev.keyCode == 13) {
				ev.preventDefault();
				button.click();
			}
		}

		input_name.addEventListener('keyup', onkey)
		input_url.addEventListener('keyup', onkey)
		input_url.focus();

		document.body.appendChild(popup);
	}
}

var http = new XMLHttpRequest();
http.timeout = 1000;

async function newNode(name, url) {
	let {href, hostname} = new URL(url);
	let json = storage.getItem('bookmarks_list'), list;
	if (json) {list = JSON.parse(json);}
	if (!list) {list = [];}

	let node = {};

	node.url = href;
	if (!name | name.length == 0) name = hostname;
	node.name = name;
	node.icon_src = 'https://logo.clearbit.com/' + encodeURI(hostname) + '?size=512';
	list.push(node);
	storage.setItem('bookmarks_list', JSON.stringify(list));
	await loadNodes();
}

async function rmNode(item){
	let json = storage.getItem('bookmarks_list');
	if (!json | !item) return;
	let list = JSON.parse(json);
	if (!list) return;

	let url = item.url, name = item.name;
	list.forEach(function(node, index){
		if (node.url == url && node.name == name) {
			list.splice(index, 1);
		}
	})
	storage.setItem('bookmarks_list', JSON.stringify(list));
	await loadNodes();
}

const valid_protocol = new RegExp("(https?:\\/\\/)");
const valid_url = new RegExp("^" +
	    "(?:(?:(?:https?|ftp):)?\\/\\/)" +
	    "(?:\\S+(?::\\S*)?@)?" +
	    "(?:" +
	      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
	      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
	      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
	      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
	      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
	      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
	    "|" +
	      "(?:" +
	        "(?:" +
	          "[a-z0-9\\u00a1-\\uffff]" +
	          "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
	        ")?" +
	        "[a-z0-9\\u00a1-\\uffff]\\." +
	      ")+" +
	      "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
	    ")" +
	    "(?::\\d{2,5})?" +
	    "(?:[/?#]\\S*)?" +
	  "$", "i"
	);

function acceptInput() {
	if (!popup) return;
	let name = input_name.value;
	let url = input_url.value;

	if (!valid_protocol.test(url)) url = 'http://' + url;
	let {href} = new URL(url);

	if (href.length == 0 || !valid_url.test(href)) {
		alert('URL долбоеба');
	}else{
		newNode(name, href);
		if (popup) {
			popup.style.display = 'none';
			popup.remove();
			popup = undefined;
		}
	}
}

var is_symbol = ''
function makeShortString(tosplit){
	let arr = tosplit.split(" ", 2);
	let out = '';

	for (let word of arr) {
		let s = word.charAt(0);
		out = out + s;
	}
	return out;
}

function stringToColor(str) {
    var hash = 0;
    if (str.length === 0) return hash;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    var rgb = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        rgb[i] = value;
    }
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

var table, table_row, cell_w, cell_h;
function setIndex(node, index) {
	node.setAttribute('data-dropindex', index);
	for (let em of node.children) setIndex(em, index);
}

function loadImg(url) {
	return new Promise((resolve, reject) => {
		let obj = new Image(512, 512);
		obj.addEventListener('load', () => resolve(url));
		obj.addEventListener('error', () => reject());
		obj.src = url;
	});
}

var done = {};
async function performNode(item, index) {
	let entry = document.createElement('div');
	entry.style.cursor = 'move';
	entry.draggable = true;
	entry.setAttribute('ondragstart', 'dragStart(event)');
	entry.setAttribute('ondragover', 'disableDrop(event)');
	entry.setAttribute('ondragenter', 'dragEnter(event)');
	entry.setAttribute('ondragleave', 'dragLeave(event)');
	entry.setAttribute('ondrop', 'drop(event)');
	entry.style.width = cell_w;
	entry.style.height = cell_h;
	entry.className = 'dial';

	let btn = document.createElement('a');
	btn.className = 'close-btn';
	btn.href = '#';
	btn.addEventListener('click', function(){rmNode(item)});
	entry.appendChild(btn);

	let img = document.createElement('a');
	img.className = 'image';
	img.href = item.url;
	img.style.backgroundColor = stringToColor(item.url);

	if (done[item.icon_src]) {
		img.style.backgroundImage = `url(${item.icon_src})`;
	}else{
		await loadImg(item.icon_src)
			.then(url => {img.style.backgroundImage = `url(${url})`;done[url] = true;})
			.catch(() => {img.innerHTML = `<p>${makeShortString(item.name)}</p>`;});
	};
	entry.appendChild(img);

	let label = document.createElement('span');
	label.className = 'label';
	label.innerText = item.url;
	entry.appendChild(label);

	let title = document.createElement('div');
	title.className = 'title';
	title.innerText = item.name;
	img.appendChild(title);
	setIndex(entry, index);
	return entry
}

function performAddButton() {
	let entry = document.createElement('div');
	entry.style.width = cell_w;
	entry.style.height = cell_h;
	entry.className = 'dial';

	let img = document.createElement('a');
	img.className = 'image-add';
	img.href = '#';
	img.addEventListener('click', addNodePopup);
	entry.appendChild(img);
	return entry
}

var node_index = 0;
async function processNode(node) {
	if (node_index % tab_cols == 0) table_row = table.insertRow();

	if (node) {
		node_index++;
		let cell = table_row.insertCell();
		let inner = await performNode(node, node_index - 1);
		cell.appendChild(inner);
	}
}

var version = '2';
function loadNodes() {
	if (storage.getItem('version') !== version) {
		storage.clear();
		storage.setItem('version', version);
	}

	tab_cols = storage.getItem('table_wide');
	if (!tab_cols) tab_cols = 5;

	let json = storage.getItem('bookmarks_list'), list;
	let div = document.getElementById('dials');
	div.innerHTML = '';

	table = document.createElement('table');
	node_index = 0;
	div.appendChild(table);

	let spacing = parseInt(table.style.borderSpacing, 10) | 5;
	cell_w = Math.floor(window.innerWidth * .8 / tab_cols - tab_cols * spacing);
	cell_h = Math.floor(cell_w);

	if (json) {list = JSON.parse(json);}

	if (list) {
		list.forEach(processNode);
	} else {
		list = [];
		storage.setItem('bookmarks_list', list);
	}

	if (node_index % tab_cols == 0) table_row = table.insertRow();

	let cell = table_row.insertCell();
	cell.style.width = cell_w + 'px';
	cell.style.height = cell_h + 'px';
	let inner = performAddButton();
	cell.appendChild(inner);
}

async function onLoaded() {
	await loadNodes();
	let button = document.getElementById('input-dial-accept');
}

window.onresize = loadNodes;

document.addEventListener("DOMContentLoaded", onLoaded);