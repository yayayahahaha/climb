/* jshint esversion:6 */

var cheerio = require('../node_modules/cheerio');

// 清空console
console.reset = function() {
    return process.stdout.write('\033c');
};

var lib = require('../lib.js'),
    download = lib.download,
    createDirectory = lib.createDirectory,
    writeFile = lib.writeFile,
    readFile = lib.readFile,
    request = lib.request;

request({
    url: 'https://find.ruten.com.tw/s/?p=19&q=kill+la+kill'
}).then(function(body) {
    console.log('success');
});

