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
var utils = require("../utils");
var $ = require("jquery");
var Logger = require("../logger.js");

var Log = null;
$(document).ready(() => {
	Log = new Logger($("#console-log"));
	Log.log("JS Loaded");
})


$("#submit-global").on("click", (e) => {
	var chatInput = $("#chat-input");
	var message = chatInput.val();
	Log.working("Sending GLOBAL Message: \"" + message + "\"")
	chatInput.val("");

	utils.fetch("POST", "/messages/global", {
		body: {
			message: message
		}
	}).then((res) => {
		Log.done("Sent Global Message!")
	}).catch((err) => {
		Log.fetchError(err);
	})
})