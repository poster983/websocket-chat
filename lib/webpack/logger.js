/*
MIT License

Copyright (c) 2017 Joseph Hassell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var $ = require("jquery");

class Logger {
	constructor(outElement) {
		$(outElement).append($("<ul/>"))
		this.elmLog = $(outElement).find("ul") 
		this.fullLog = [];
	}
	_newEntry(type, data) {
		type = type.toUpperCase();
		this.fullLog.push({type: type, data: data})
		this.elmLog.append($("<li/>").append(type + ": " + data));
	}
	log(message) {
		console.log(message);
		this._newEntry("log", message);
	}
	done(message) {
		console.log("DONE:", message);
		this._newEntry("done", message);
	}
	working(message) {
		console.log("WORKING:", message);
		this._newEntry("working", message);
	}
	debug(message) {
		console.log("DEBUG:", message);
		this._newEntry("debug", message);
	}
	warn(message) {
		console.warn(message);
		this._newEntry("warn", message);
	}
	error(message) {
		console.error(message);
		this._newEntry("error", message);
	}
	fetchError(errorObject) {
		console.error(errorObject);
		var message = errorObject.response.status + " " + errorObject.message + ": " + decodeURIComponent(errorObject.response.headers.get("errormessage"))
		console.log("FETCH ERROR:", message)
		this._newEntry("fetch error", message);
	}
}

module.exports = Logger;