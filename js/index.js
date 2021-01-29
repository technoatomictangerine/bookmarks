var clock_timer, clock_element;
var body = document.body, timer;

function updateClock() {
	let time = new Date();
	let h = time.getHours();
	let m = time.getMinutes();
	let s = time.getSeconds();

	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	s = s < 10 ? '0' + s : s;

	clock_element.innerText = h + ':' + m + ':' + s;
	clock_timer = setTimeout(updateClock, 1000);
}

function updateBackground(){
	let src = window.localStorage.getItem('background_video');
	let obj = document.getElementById('background-container');
	if (!src)src = 'src/background.jpg';

	if (src.endsWith('.mp4') | src.endsWith('.ogv') | src.endsWith('.webm')){
		let bg = document.createElement('video');
		bg.className = 'background-content';
		bg.autoplay = true;
		bg.controls = false;
		bg.muted = true;
		bg.volume = 0;
		bg.loop = true;
		bg.autoplay = true;
		bg.src = src;
		obj.appendChild(bg);
		bg.load();
	}else{
		obj.style.backgroundImage = 'url('+src+')';
	}
}

async function OnLoaded() {
	clock_element = document.getElementById('clock-display');
	updateBackground();
	updateClock();
	let settings = document.createElement('div');
	settings.id = 'settings';
	body.appendChild(settings);
}

document.addEventListener("DOMContentLoaded", OnLoaded);

function onScroll(){
	clearTimeout(timer);
	clearTimeout(clock_timer);

	if (!body.classList.contains('onscroll')) {
		body.classList.add('onscroll');
	}

	timer = setTimeout(function(){
		body.classList.remove('onscroll');
		updateClock();
	}, 250);
}

window.addEventListener('scroll', onScroll, false);
window.addEventListener('resize', onScroll, false);
window.addEventListener('load', onScroll, false);