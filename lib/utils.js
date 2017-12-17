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
    * Checks if req is using DSCM and then allows passport to view the data 
    * @function dscm
    * @link module:js/utils
    * @param {json} req - Request 
    * @param {json} res - Response 
    * @param {function} next - Callback 
    * @returns {next}
    * @todo Make a passportjs stratagy for this 
    */
exports.dscm = function(req, res, next) {            
    if(req.header("x-xsrf-token") && req.signedCookies && req.signedCookies.JWT) {
        //using DSCM
        jwt.verify(req.signedCookies.JWT.substring(4), config.get("secrets.api-secret-key"), function(err, decode) {
            if(err) {
                return next(err);
            }
            //console.log(decode)
            if(decode && decode.dscm == req.header("x-xsrf-token")) {
                //put in headder for passport auth
                console.log("DSCM In Use");
                req.headers.authorization = req.signedCookies.JWT;
                return next();

            } else {
                var err = new Error("Unauthorized");
                err.status = 401;
                return next(err)
            }
        })

    } else {
        if(req.header("authorization") && req.signedCookies.JWT) {
            jwt.verify(req.signedCookies.JWT.substring(4), config.get("secrets.api-secret-key"), function(err, decode) {
                if(err) {
                    return next(err);
                } else if(decode && decode.dscm) {
                    //possible spoof 
                    //console.log("WEEEEEEEEEEEE")
                    var err = new Error("Unauthorized");
                    err.status = 401;
                    return next(err)
                } else {
                    return next();
                }
            })
        } else {
            console.log("Normal Auth Header")
            return next();
        }
        
    }
    
}