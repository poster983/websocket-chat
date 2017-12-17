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

var r = require("./db.js").r();
var typeCheck = require("type-check").typeCheck;
/**
* Creates a new global message.  
* @param {Object} messageObj 
* @param {String} messageObj.fromID - Sent from this account ID
* @param {String} messageObj.message - The message sent.
* @returns {Promise}
*/
exports.newGlobalMessage = (messageObj) => {
	return new Promise((resolve, reject) => {
		if(!typeCheck("{fromID: String, message: String}", messageObj)) {
			return reject(new TypeError("messageObj must have format \"{fromID: String, message: String}\""));
		}
		return r.table("messages").insert({
			fromID: messageObj.fromID,
			message: messageObj.message,
			timestamp: r.now()
		}).run().then(resolve).catch(reject)
	})
	
}