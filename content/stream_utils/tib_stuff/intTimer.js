// ================== intTimer.js ==================
export class IntTimer {
	constructor(args = {}) {
		//general flags
		this.name = args.name || `timer${String(Math.random())}`; // name for the timer, used for logging
		this.time = args.time || 0; // time the timer will start at
		this.debugMode = args.debugMode || false; // if so will print info about the timer
		this.printNormalizedTick || false; // if true, will convert the print to be a standard step. ie: instead of [3/9, 6/9, 9/9] it becomes: [1/3, 2/3, 3/3]

		//start flags
		this.startData = args.startData || undefined; // data to be sent to startListeners
		this.startListeners = args.startListeners || undefined // functions to be called when start is called
		this.autoStart = args.autoStart || false; // if true, will start timer asap
		this.emitOnStart = args.EmitOnStart || true; // if true, will emit when started

		//restart flags
		this.restartData = args.restartData || undefined; // data to be sent to startListeners
		this.restartListeners = args.restartListeners || undefined // functions to be called when start is called

		//pause flags
		this.pauseData = args.pauseData || undefined; // data to be sent to startListeners
		this.pauseListeners = args.pauseListeners || undefined // functions to be called when start is called

		//stop flags
		this.stopData = args.stopData || undefined; // data to be sent to startListeners
		this.stopListeners = args.stopListeners || undefined // functions to be called when start is called

		//tick stuff
		this.incr = args.incr || 1; // the step per second, if less than 1 will be rounded to 1
		this.tickData = args.tickData || undefined; // data to be passed 
		this.tickListeners = args.tickListeners || [];

		this.tickAndTimeout = args.tickAndTimeout || true // if true, timeout will tick with a timeout when they happen, if false only timeout will be called

		//timeout stuff
		this.timeoutData = args.timeoutData || undefined; // data to be passed 
		this.timeoutListeners = args.timeoutListeners || [];
		this.timeoutDuration = args.timeout || args.timeoutDuration || 10; // duration until Timeout() is called
		this.killOnTimeout = args.timeout || true; // if false, will repeat until stopped manually
		this.maxDuration = args.maxDuration || 0; // 0 or less will mean no max timer

		// formatting for readibility sake:
		if (this.maxDuration < 0) {
			if (this.debugMode) {
				console.log(`intTimer: ${this.name} is starting`);
			}
		}
	}

	Start() {
		if (this.alive) return; // don’t start twice
		this.alive = true;
		this.time = 0;

		this.timer = setInterval(() => {
			if (!this.alive) {
				clearInterval(this.timer);
				return;
			}

			if (this.debugMode) {
				console.log(`intTimer: ${this.name} loop #${this.time}`);
			}

			if (this.maxDuration > 0 && this.time > this.maxDuration) {
				this.alive = false;
				clearInterval(this.timer);
				return;
			}

			// Tick / Timeout logic
			if (
				this.tickAndTimeout &&
				this.time % this.incr === 0 &&
				this.time % this.timeoutDuration === 0
			) {
				this.Tick();
				this.Timeout();
			} else if (this.time % this.timeoutDuration === 0) {
				this.Timeout();
			} else if (this.time % this.incr === 0) {
				this.Tick();
			}

			this.time += 1;
		}, 1000);
	}


	async Pause() {
		if (this.debugMode) {
			console.log(`intTimer: ${this.name} paused`);
		}
		this.alive = false;
		if (this.stopListeners != undefined) {
			for (let i = 0; i < this.pauseListeners.length; ++i) {
				this.pauseListeners[i](this.pauseData);
			}
		}
	}
	async Stop() {
		if (this.debugMode) {
			console.log(`intTimer: ${this.name} stopped`);
		}
		this.alive = false;

		if (this.stopListeners != undefined) {
			for (let i = 0; i < this.stopListeners.length; ++i) {
				this.stopListeners[i](this.stopData);
			}
		}
	}
	async Restart() {
		this.time = 0;

		if (this.debugMode) {
			console.log(`intTimer: ${this.name} restarted`);
		}

		if (this.restartListeners != undefined) {
			for (let i = 0; i < this.restartListeners.length; ++i) {
				this.restartListeners[i](this.restartData);
			}
		}

	}

	async Tick() { //called when this.time%this.incr == 0
		if (this.debugMode) {
			if (this.printNormalizedTick) {
				console.log(`intTimer: ${this.name} tick (${this.time / this.incr}/${this.maxDuration / this.incr})`); //normalized
			}
			else {
				console.log(`intTimer: ${this.name} tick (${this.time}/${this.maxDuration})`)
			}
		}

		if (this.tickListeners != undefined) {
			for (let i = 0; i < this.tickListeners.length; ++i) {
				this.tickListeners[i](this.tickData);
			}
		}
	}
	AddTimeoutListener(func = undefined) {
		if (func == undefined) { throw new Error("arguement function is undefined"); }

		let matchFound = false;
		if(this.timeoutListeners != undefined){
			for (let i = 0; i < this.timeoutListeners.length; ++i) {
				if (this.timeoutListeners[i] == func) {
					console.warn('match to attempted add found, not adding the functions due to duplication concerns');
				}
			}
		}
		else{
			console.warn("this.timeoutListeners is undefined for some reason:\n this.timeoutListeners = ", this.timeoutListeners)
		}
		if (matchFound == false) {
			this.timeoutListeners += func;
		}
		return;
	}
	RemoveTimeoutListener(func = undefined) {
		if (func == undefined) { throw new Error("arguement function is undefined"); }

		let matchFound = false;
		for (let i = 0; i < this.timeoutListeners.length; ++i) {
			if (this.timeoutListeners[i] == func) {
				console.warn('match to attempted add found, not adding the functions due to duplication concerns');
				this.timeoutListeners.pop(i);
			}
		}
		if (matchFound == false) {
			console.warn("function passed has not been matched to another in the function array, is there an error in the logic somewhere?");
		}
		return;
	}
	async Timeout() {
		if (this.debugMode) {
			console.log(`intTimer: ${this.name} has timedOut`);
		}

		if (this.debugMode) {
			console.log(`intTimer: timeoutListeners exists: ${this.timeoutListeners !== undefined}`);
			console.log(`intTimer: timeoutListeners length: ${this.timeoutListeners?.length}`);
		}

		if (this.timeoutListeners != undefined) {
			for (let i = 0; i < this.timeoutListeners.length; ++i) {
				if (this.debugMode) {
					console.log(`intTimer: calling timeout listener ${i}`);
				}

				try {
					let nextFunc = this.timeoutListeners[i];
					if(typeof(nextFunc) != "function"){
						throw new Error(`ARG PASSED IS NOT A FUNCTION, CANNOT PROCESS ${i}:\n` + nextFunc);
					}
					await this.timeoutListeners[i](this.timeoutData);
					if (this.debugMode) {
						console.log(`intTimer: timeout listener ${i} completed`);
					}
				} catch (error) {
					// : THE BELOW IS ONLY A TEMP THING, THIS STILL SHOULD BE FIXED
					// console.error(`intTimer: error in timeout listener ${i}:`, error);
				}
			}
		} else {
			if (this.debugMode) {
				console.log(`intTimer: no timeout listeners to call`);
			}
		}
	}
}
