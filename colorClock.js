function PolarColorClock() {
	//we declare de defaults settings for the clock, this can be
	//overwritten in the initialization of the PolarColorClock() constructor
	var defaults = {
		startAngle: Math.PI * 1.5,
		inverted: false,
		circleRadious: 260,
		circleColor: ['red', 'yellow', 'blue'],
		cirlceTickness: 45,
		textSize: 85,
		textFont: 'impact',
		textColor: '#fff',
		customColor: false,
		canvasWidth: document.body.offsetWidth,
		canvasHeight: document.body.offsetHeight
	}

	//frames and counter that limit the requestAnimationFrame to only trigger
	//once every 1000ms (1s)
	this.frames = 60;
	this.counter = 0;

	//initial time gathering on load
	this.hours = new Date().getHours();
	this.minutes = new Date().getMinutes();
	this.seconds = new Date().getSeconds();

	//we declare the canvas and canvas context
	this.canvas = document.querySelector('#polar_color_clock');
	this.ctx = this.canvas.getContext('2d');

	//we declare the needed empty for now variables
	var i, time, timeFunction, textFunctions;
	var year, months, day, weekDay;

	//array to be used later to assciate Date() numbers with text months and week days
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var weekDays = ['Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday', 'Saturday', 'Sunday'];

	//we check if we have overwritten settings if not leave the defaults
	//by using the integrated arguments
	if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    } else {
      this.options = defaults;
    }

	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
		        source[property] = properties[property];
		      }
		}
		return source;
	}

	//the initialization of the clock
	this.init = function() {
		this.canvas.width = this.options.canvasWidth;
		this.canvas.height = this.options.canvasHeight;
		//this is to remove canvas scrollbars because canvas in rendered as inline element
		this.canvas.style.display = 'block';

		//the aniamte function that triggers once every 1000ms (1s)
		this.animate();
	},
	//the draw function that writes on the canvas
	this.draw = function() {
		time = new Date();
		timeFunction = [time.getSeconds(), time.getMinutes(), time.getHours()];
		textFunctions = [this.showClock(), this.showDate(), this.showWeekDay()];

		this.ctx.fillStyle = this.options.customColor ? this.options.customColor : this.generateColor();
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = this.options.textColor;

		//to avoid repeating the code we make a for each for the 3 texts and circles
		for (i = 0; i < 3; i++) {
			this.ctx.font = ((i === 0) ? this.options.textSize : (this.options.textSize / 2)) + 'px ' + this.options.textFont;
			this.ctx.textBaseline = 'bottom';
			this.ctx.fillText(textFunctions[i], (this.canvas.width / 2), (this.canvas.height / 2) + (i * (this.options.textSize / 2)));

			this.ctx.beginPath();
			this.ctx.strokeStyle = this.options.circleColor[i];
		    this.ctx.lineWidth = this.options.cirlceTickness;
		    this.ctx.arc(
		    	(this.canvas.width / 2), 
		    	(this.canvas.height / 2), 
		    	this.options.circleRadious - ((this.ctx.lineWidth + 5) * (i - 1)), 
		    	this.options.startAngle, 
		    	this.options.startAngle + (timeFunction[i] * (Math.PI / ((i === 2) ? 12 : 30))),
		    	this.options.inverted
		    );
			this.ctx.stroke();
			this.ctx.closePath();
		}
	},
	//the function that triggers before draw() to remove previous canvas
	this.clearDraw = function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	//the aniamte function that triggers once every 1000ms (1s)
	this.animate = function() {
		//as said earlier this is used to limit the requestAnimationFrame to 1000ms (1s)
		if (this.counter < this.frames) {
			this.counter++;
			window.requestAnimationFrame(this.animate.bind(this));
			return false;
		}
		this.counter = 0;
		window.requestAnimationFrame(this.animate.bind(this));
		this.generateContent();
	},
	//the function that returns the hour minutes and seconds and formats them
	this.showClock = function() {
		time = new Date();
		this.hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
		this.minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
		this.seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();

		return this.hours + ':' + this.minutes + ':' + this.seconds;
	},
	//the function that returns the date
	this.showDate = function() {
		time = new Date();

		year = time.getFullYear();
		month = time.getMonth();
		day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();

		for (i = 0; i < months.length; i++) {
			if (month === i) {
				month = months[i];
			}
		}

		return day + '/' + month + '/' + year;
	},
	//the function that returns the day of the week
	this.showWeekDay = function() {
		time = new Date();
		weekDay = time.getDay();

		for (i = 0; i < weekDays.length; i++) {
			if (weekDay === i + 1) {
				weekDay = weekDays[i];
			}
		}

		return weekDay;
	},
	//thefunction that returns the background color. This idea is inpired by http://www.jacopocolo.com/hexclock/
	//colors range from #000000 to #235959, so it's always darkish, if you want a custom color use settings
	this.generateColor = function() {
		return '#' + this.hours + this.minutes + this.seconds;
	},
	//the function that uses the clearDraw() and draw() functions
	this.generateContent = function() {
		this.clearDraw();
		this.draw();
	}
	//we initaliza the color clock
	this.init();
}