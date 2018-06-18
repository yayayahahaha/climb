/*jshint esversion: 6 */
var fs = require('fs');
var req = require('request');

module.exports = {
    download: function(url, dir, filename, payload) {
        if (!url || !dir || !filename) {
            console.log('下載用的參數有缺!');
            return;
        }

        return new Promise(function(resolve, reject) {
            request(url, function(er, res, body) {
                if (!er) {
                    resolve(payload);
                } else {
                    reject(er);
                }

            }).pipe(fs.createWriteStream(dir + '/' + filename));
        });
    },
    createDirectory: function(path) {
        // 檢查是否存在
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    },
    writeFile: function(fileName, content, callback) {
        fs.writeFile(fileName, content, callback);
    },
    readFile: function(fileName) {
        return fs.readFileSync(fileName);
    },
    request: function(setting) {
        setting = setting ? setting : {};
        return new Promise(function(resolve, reject) {
            req(setting, function(error, response, body) {
                if (!error) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }
};