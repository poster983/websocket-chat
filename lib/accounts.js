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
* Creates a new user.  
* @param {Object} account
* @param {Object} account.username
* @returns {Promise}
*/
exports.new = (account) => {
	return new Promise((resolve, reject) => {
		if(!typeCheck("{username: String}", account)) {
			var err = new TypeError("account expected object with format \"{username: String}\"");
			err.status = 400;
			return reject(err);
		}
		if(account.username === "") {
			var err = new Error("username cannot be an empty string");
			err.status = 400;
			return reject(err);
		}
		r.table("accounts").filter({
			username: account.username
		}).count().run().then((count) => {
			if(count > 0) {
				var err = new Error("Account with this username already exists.");
				err.status = 400;
				return reject(err);
			} else {
				return r.table("accounts").insert({
					username: account.username,
					createdOn: r.now()
				}).run().then(resolve).catch(reject)
			}
		}).catch((err) => {return reject(err)})
		
	})
}

exports.get = (query) => {
	if(query) {
		return r.table("accounts").filter(query).run()
	}
	return r.table("accounts").run()
}