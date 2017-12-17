module.exports = {
    entry: {
        chat: "./lib/webpack/entrypoints/chat.js",
        login: "./lib/webpack/entrypoints/login.js",
    },
    output: {
        path: __dirname + "/public/javascripts",
        filename: "[name].pack.js"
    }
};