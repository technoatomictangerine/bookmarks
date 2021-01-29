function updateStyle() {
	let style = document.getElementById('cssmod');
	let data = window.localStorage;

	let text = data.getItem('text-color') || '#fff';
	let border = data.getItem('border-color') || '#32c8dc';
	let label = data.getItem('label-color') || '#4b4b4b';
	let ltext = data.getItem('label-text') || '#fff';

	style.innerHTML = ':root {'+
		'--shadow:rgba(0,0,0,.5);'+
		`--text:${text};`+
		`--border:${border};`+
		`--label:${label};`+
		`--ltext:${ltext};}`;
}

updateStyle();