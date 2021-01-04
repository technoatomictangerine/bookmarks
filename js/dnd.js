function move(arr, old_id, new_id) {
    let a = arr[old_id], b = arr[new_id];
    if (a !== null && a !== undefined && b !== null && b !== undefined) arr[new_id] = a; arr[old_id] = b;
};

function disableDrop(ev){ev.preventDefault();}

function dragStart(ev){ev.dataTransfer.setData('Text', ev.target.getAttribute('data-dropindex'));}

function dragEnter(ev){ev.target.style.filter = 'brightness(10%)';}

function dragLeave(ev){ev.target.style.filter = 'none';}

async function drop(ev){
	let oldid = parseInt(ev.dataTransfer.getData('Text'), 10);
	let newid = parseInt(ev.target.getAttribute('data-dropindex'), 10);

	ev.target.style.filter = 'none';
	let json = localStorage.getItem('bookmarks_list'), list;
	if (!json) return;
	list = JSON.parse(json);

	if (list !== undefined && oldid !== NaN && oldid !== undefined && newid !== NaN && newid !== undefined) {
		move(list, oldid, newid);
		localStorage.setItem('bookmarks_list', JSON.stringify(list));
		await loadNodes();
	}
}