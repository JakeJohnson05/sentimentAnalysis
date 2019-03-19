const mkCompanyOptn = (display, ticker) => ({'display':display, 'ticker':ticker});

const COMPANY_OPTIONS = [
	mkCompanyOptn('Apple Inc.', 'AAPL'),
	mkCompanyOptn('Alphabet Inc.', 'GOOG'),
	mkCompanyOptn('Microsoft Corp.', 'MSFT'),
	mkCompanyOptn('Amazon Inc.', 'AMZN'),
	mkCompanyOptn('Facebook Inc.', 'FB'),
	mkCompanyOptn('Wal-Mart Stores Inc.', 'WMT'),
]

const MONTHS = [
	'Jan','Feb','Mar','Apr','May','June',
	'July','Aug','Sept','Oct','Nov','Dec',
]

document.__proto__.customCreateElement = function (tag, attrs, innerHTML) {
	let element = document.createElement(tag);
	for (attr in attrs) element.setAttribute(attr, attrs[attr]);
	if (innerHTML) element.innerHTML = innerHTML;
	return element;	
}

window.onload = () => {
	makeCompanyChoices();
	createDateSlider();
	drawSubmitLines();
}

let makeCompanyChoices = function () {
	let companySelect = document.getElementsByTagName('select')[0];
	let optionNode;
	for (let i = 0; i < COMPANY_OPTIONS.length; i++) {
		optionNode = document.customCreateElement('option', 
			{value:COMPANY_OPTIONS[i]['ticker']}, COMPANY_OPTIONS[i]['display']);
		companySelect.appendChild(optionNode);
	}
}


let createDateSlider = function () {
	let slider = document.getElementById('date-range');
	let weekIntvl = 7 * 24 * 60 * 60 * 1000;
	let todayNoon = new Date()
	todayNoon.setHours(12);
	let getLastMonday = time => new Date(time).getDay() === 1 ? time : getLastMonday(time - 24 * 60 * 60 * 1000);
	let maxDate = getLastMonday(todayNoon.getTime() - weekIntvl);

	noUiSlider.create(slider, {
		range: {
			'min': maxDate - 50 * weekIntvl,
			'max': maxDate - weekIntvl,
		},
		step: weekIntvl,
		start: [maxDate - 30 * weekIntvl, maxDate],
		margin: weekIntvl * 3,
		connect: true,
		behaviour: 'tap-drag',
	});

	let dateValues = [
    	document.getElementById('range-value-low'),
    	document.getElementById('range-value-high'),
	];

	slider.noUiSlider.on('update', (values, handle) => {
		let date = new Date(Math.floor(values[handle]));
		dateValues[handle].setAttribute('value', date.getTime());
		dateValues[handle].innerHTML = `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
	});
}

let drawSubmitLines = function () {
	let addLine = (node, args) => node.appendChild(createLine(...args));
	let subBtn = document.getElementById("submit-button");
	let lines = [
		[2,44,20,20],
		[20,20,28,30],
		[28,30,40,15],
		[39,15,45,2],
		[45,2,70,10],
		[70,10,90,20],
		[90,20,100,40],
		[100,40,110,10],
		[109,10,120,20],
		[120,20,125,30],
		[123,30,140,10],
		[140,10,148,6],

	]

	for (let i = 0; i < lines.length; i++) addLine(subBtn, lines[i]);
}

function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");
    line.setAttribute('class', 'drawn-line');
    var styles = 'width: ' + length + 'px; '
               + 'height: 0px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; '
               + `transition: all 0s ease ${.002 * x}s`;
    line.setAttribute('style', styles);  
    return line;
}

function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha);
}


let sendData = function () {
	let data = document.getElementsByClassName('form-data');
	let formatData = mill => {
		let date = new Date(Math.floor(Number(mill)));
		return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
	}
	// Pretty Print
	document.getElementById('graph-data').innerHTML = `
		Company: ${data[0].value}</br>
		Start-Date: ${formatData(data[1].getAttribute('value'))}</br>
		End-Date: ${formatData(data[2].getAttribute('value'))}
	`;
}