module.exports = {
    entry: {
        chat: "./lib/webpack/entrypoints/chat.js",
    },
    output: {
        path: __dirname + "/public/javascripts",
        filename: "[name].pack.js"
    }
};