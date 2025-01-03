import { BubbleSort } from '/lib/sort_algorithms.js';
import { LinearSearch } from '/lib/search_algorithms.js';


//############################################################
// event listeners
//############################################################
document.getElementById('list_length').addEventListener('change', () => {
	console.log('formating input');

	let input = document.getElementById('list_length');
	let amount = input.value;

	if (isNaN(input.value) || input.value == '') {
		input.value = input.placeholder;
	}

	if (amount == undefined || amount == null) {
		amount = document.getElmentById('list_length').laceholder


		if (amount < 0) {
			input.value = 0;
		}
		else if (amount > 10 ** 6) {
			input.value = 10 ** 6;
		}

	}
});

document.getElementById('generate_button').addEventListener('click', () => {
	let page, end;

	page = new Date();
	GenerateList();
	end = new Date();

	document.getElementById('gen_duration').innerText = (end.getTime() - page.getTime()) + 'ms';
})

document.getElementById('page_num').addEventListener('change', async () => {
	await UpdateList();
})

document.getElementById('sort_trigger').addEventListener('click', () => {
	let type = document.getElementById('sort_selection').value;
	let st, et

	st = new Date();
	SortList(type);
	et = new Date();

	document.getElementById('sort_time').innerText = (et.getTime() - st.getTime()) + 'ms';

})

//############################################################
// vars
//############################################################
let list = [];

let sorting_algorithms = {
	"bubble_sort": "bubble_sort",
	"random_sort (WARNING: REALLY REALLY SLOW)": "random_sort",
	"quick_sort": "quick_sort",
};

let searching_algorithms = {
	'binary search': 'binary_search',
	'linear (for(let i = 0; i < list.length; ++i))': 'linear',
	'linear (for(let i = 0; i < list.length; i++))': 'linear',
};

//############################################################
// function
//############################################################
//{{{2 GenerateList
function GenerateList() {
	list = [];

	let amount = document.getElementById('list_length').value;
	if (amount == 0 || amount == null || amount == undefined) {
		amount = document.getElementById('list_length').placeholder;
	}

	if (amount == undefined || amount == null) {
		amount = document.getElmentById('list_length').placeholder
	}

	if (amount < 0) {
		amount = 0;
	}
	else if (amount > 10 ** 6) {
		amount = 10 ** 6;
	}

	for (let i = 0; i < amount; ++i) {
		console.log('adding number');
		list.push(Math.random());
	}

	console.log(list.length);

	UpdateList();
}
//}}}2

//{{{2 UpdateList
async function UpdateList() {
	let updateList = new Promise((resolve, reject) => {
		console.log('updating list');
		if (list.length == 0) {
			document.getElementById('list_preview').innerHTML = 'list is empty!';
			return;
		}

		document.getElementById('list_preview').innerHTML = '';

		let length = list.length;

		let page_amnt = document.getElementById('page_amnt').value;
		if (page_amnt == '' || page_amnt == undefined) {
			page_amnt = document.getElementById('page_amnt').placeholder;
		}

		let cur_page = document.getElementById('page_num');
		if (
			cur_page.value == '' ||
			cur_page.value == undefined
		) {
			cur_page.value = cur_page.placeholder;
		}

		cur_page.max = list.length / page_amnt;

		let end_index = Number((cur_page.value - 1) * page_amnt) + Number(page_amnt);
		let start_index = (cur_page.value - 1) * page_amnt;

		console.log(
			'start' + start_index + '\n',
			'end' + end_index + '\n',
		);

		let ol = document.createElement('ol');
		ol.start = start_index;

		for (let i = start_index; i < end_index; ++i) {
			console.log('adding li');
			let li = document.createElement('li');
			li.innerText = list[i];
			ol.appendChild(li);
		}

		document.getElementById('list_preview').appendChild(ol);

		UpdateCanvas();
	})
}
//}}}2

//{{{2 SortList
function SortList(type = '') {

	switch (type) {
		case ('bubble'):
		case ('bubble_sort'):
		case ('bubble sort'):
			BubbleSort(list);
			break;
		default:
			window.alert('invalid sort input');
			break;
	}
}
//}}}2

//{{{2 FindInList
function FindInList() {

}
//}}}2

//{{{2 CreateCanvas
function CreateCanvas(args = { 'list': list, 'index': 0 }) {
	console.log('creating canvas');
	if (args.list == undefined) {
		console.warn('unable to sort, list undefined');
		return;
	}

	let canvas_height = '10rem';

	let canvas_container = document.createElement('div');
	canvas_container.id = 'cc';
	canvas_container.style.maxWidth = '100vw';
	canvas_container.style.width = '100vw';
	canvas_container.style.height = canvas_height;
	canvas_container.style.backgroundColor = 'var(--color_secondary)';
	canvas_container.style.position = 'fixed';
	canvas_container.style.bottom = '0';
	canvas_container.style.left = '0';
	canvas_container.style.transform = 'translate(0)';
	canvas_container.style.display = 'flex';
	canvas_container.style.justifyContent = 'center';
	//canvas_container.style.animationDuration = '180ms';
	//canvas_container.style.animationTimingFuncation = 'ease';


	let canvas = document.createElement('canvas');
	canvas.id = 'c';
	canvas.style.height = canvas_height;
	canvas.style.position = 'relative';
	canvas.style.marginTop = '0.5rem';
	//canvas.style.transform = 'translateY(-3.3rem)';
	canvas.style.maxWidth = '100vw';
	canvas.style.width = '100vw';
	canvas.style.border = 'none';
	canvas.style.borderRadius = '1rem';
	canvas.style.backgroundColor = '#000000';
	canvas_container.appendChild(canvas);


	let canvas_toggle = document.createElement('button');
	canvas_toggle.innerText = '🔀';
	canvas_toggle.id = 'ct';
	canvas_toggle.style.backgroundColor = 'var(--color_primary)';
	canvas_toggle.style.position = 'fixed';
	canvas_toggle.style.transform = 'translateY(-4rem)';
	canvas_toggle.style.height = '3rem';
	canvas_toggle.style.width = '3rem';
	canvas_toggle.style.zIndex = '999';
	canvas_toggle.style.bottom = '-5rem';
	canvas_toggle.style.left = '0';

	document.body.appendChild(canvas_toggle);
	document.body.appendChild(canvas_container);

	document.getElementById('ct').addEventListener('click', () => {
		let cc = document.getElementById('cc');

		if (cc.style.transform == 'translateY(15rem)') {
			console.log('showing graph');
			cc.style.transform = 'translateY(0rem)';
		}
		else {
			console.log('hiding graph');
			cc.style.transform = 'translateY(15rem)';
		}
	});

}
//}}}2

//{{{2 UpdateCanvas
//let retried = false;
export async function UpdateCanvas(args = { 'list': list, 'index': 0 }) {
	try {
		let updateCanvas = new Promise((Resolve, Reject) => {
			if (args.list == undefined) {
				console.warn('unable to sort, list undefined');
				return;
			}

			let cc = document.getElementById('cc');
			let c = document.getElementById('c');

			//if (cc == undefined || c == undefined) {
			//	if (retried == false) {
			//		CreateCanvas();
			//		retried = true
			//		UpdateCanvas();
			//		return;
			//	}
			//	if (retried == true) {
			//		console.warn('no canvas can be made');
			//		return;
			//	}
			//}

			let height = c.height;
			let width = c.width;

			let ctx = c.getContext('2d');

			console.log('canvas is:', width, 'x', height)
			ctx.clearRect(0, 0, width, height);

			for (let i = 0; i < args.list.length; ++i) {
				console.log('rendering item to list');

				let fill_color = `rgb(` +
					`${parseInt(String((list[i])) * 255)}` + ` ` +
					`${parseInt(String((list[i])) * 255) - 255}` + ` ` +
					`255` + ` ` +
					//`${ parseInt(String((list[i] * height) - height * -1), 8) } ` +
					`)`;
				console.log('fill color: ', fill_color);
				if (i == args.index) {
					fill_color = '#ff00ff'
				}

				ctx.beginPath();
				ctx.fillStyle = fill_color

				ctx.rect(
					i / list.length * width,	//x
					height,	//y
					1,	//width
					list[i] * height * -1	//height
				)
				ctx.fill();
			}

			Resolve();
			return;
		});
	}
	catch (err) { console.log(err) }
}
//}}}2

//############################################################
// Runtime
//############################################################
CreateCanvas();
