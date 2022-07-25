function move(arr, old_id, new_id) {
    if (new_id >= arr.length) {
        var k = new_id - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_id, 0, arr.splice(old_id, 1)[0]);
    return arr;
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
