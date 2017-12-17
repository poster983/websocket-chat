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
/**
* Browser Utilities.
* @module webpack/utils
*/

/**
* An wrapper for the fetch api to make code clean   
* @link module:webpack/utils
* @param (String) method - GET, POST, PATCH, PUT, DELETE, ect.
* @param (String) url - Url to send request to.
* @param ({Object|undefined}) data
* @param ({Object|undefined}) data.query - JSON key pair to add to the URL as a query
* @param ({Object|undefined}) data.body - Data to send in the body of the request.  May not work with GET and DELETE
* @param ({Boolean|undefined}) data.head - Data to be sent as the header. Json object
* @param ({Boolean|undefined}) data.auth - If true, it will send the XSRF-TOKEN to the server
* @returns (Promise)
*/
exports.fetch = (method, url, data) => {
  return new Promise((resolve, reject) => {
    if(!data) {data = {}}
    if(data.query) {data.query = "?" + exports.urlQuery(data.query)} else {data.query = ""}
    if(!data.head) {data.head = {}}
    if(data.auth) {data.head["x-xsrf-token"] = exports.getCookie("XSRF-TOKEN")}
    if(data.body && typeof data.body === "object") {
    	data.head["Content-Type"] = "application/json";
    	data.body = JSON.stringify(data.body);
    }
    fetch(url + data.query, {
          method: method,
          headers: new Headers(data.head),
          body: data.body,
          credentials: 'same-origin'
      }).then(exports.fetchStatus).then(exports.fetchJSON).then((json) => {
        return resolve(json)
      }).catch((err) => {
        return reject(err);
      })
  })
}

/**
* Takes an Object and returns a URL Query string
* @link module:webpack/utils
* @param (Object) params
* @returns (String)
*/
exports.urlQuery = (params) => {
    return query = Object.keys(params)
    .filter(function(e) { return ((params[e] !== undefined) && params[e] !== null) }) //removes 
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
}




/**
* Parses a fetch response and either throws an error, or it returns a promise  
* @link module:webpack/utils
* @param (Response) response
* @returns (Promise)
*/
exports.fetchStatus = (response) => {
  //console.log(response)
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.isFetch = true;
    error.response = response;
    throw error
  }
}

/**
* Converts response to json   
* @link module:webpack/utils
* @param (Response) response
* @returns (Promise)
*/
exports.fetchJSON = (response) => {
  return response.json()
}

/**
* Creates a UUID V4 Id    
* @link module:webpack/utils
* @returns (String)
*/
exports.uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => 
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

/**
* Sets a browser cookie   
* @link module:webpack/utils
* @param (String) cname - Value to name the cookie
* @param (String) cvalue - Value of the cookie
* @param (Number) exdays - Days until expired
* @returns (undefined)
*/
exports.setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
* Gets a browser cookie   
* @link module:webpack/utils
* @param (String) cname - Name of the cookie
* @returns (String)
*/
exports.getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
* Returns a list of every distinct key in the object   
* @link module:webpack/utils
* @param (Object[]) arr - Array of the json objects with keys to test
* @returns (String[])
*/
exports.distinctKeys = (arr) => {
    return Object.keys(arr.reduce(function(result, obj) {
      return Object.assign(result, obj);
    }, {}))
}

