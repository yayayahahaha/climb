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

var detailUrl = 'https://rtapi.ruten.com.tw/api/prod/v1/index.php/prod?id=',
    userInput = 'kill la kill',
    encodedUserInput = encodeURI(userInput),
    pi = 1,
    idRows = [],
    productsDetail = [];

// 露天的推薦系統
request({
    url: 'https://rtapi.ruten.com.tw/api/rtb/v1/index.php/core/prod?offset=1&limit=11&q=' + encodedUserInput
}).then(function(body) {
    try {
        var products = JSON.parse(body).Rows;
        if (products) {
            products = [].map.call(products, function(item, index) {
                return item.Id;
            });

            request({
                url: detailUrl + products.join(',')
            }).then(function(body) {
                try {
                    productsDetail = productsDetail.concat(JSON.parse(body));

                    getAllProduct(pi, userInput);
                } catch (e) {
                    console.log(e);
                }
            });
        }
    } catch (e) {
        console.log(e);
    }
});

function getAllProduct(pi, userInput) {
    pi = pi ? pi : 1;
    userInput = userInput ? userInput : '';

    request({
        url: updateUrl(pi, userInput)
    }).then(function(body) {
        try {
            var response = JSON.parse(body).Rows;
            if (response) {
                response = [].map.call(response, function(item, index) {
                    return item.Id;
                });

                request({
                    url: detailUrl + response.join(',')
                }).then(function(body) {
                    productsDetail = productsDetail.concat(JSON.parse(body));
                    console.log('page ' + pi + ' done');

                    if (response.length >= 60) {
                        pi++;
                        getAllProduct(pi, userInput);
                    } else {
                        console.log('all done!');
                        formatData(productsDetail);
                    }
                });

            } else {
                console.log('取不到Rows');
                return;
            }
        } catch (e) {
            console.log(e);
        }
    });
}

function formatData(products) {
    var obj = {};
    products = products.sort(function(a, b){
        return a.Price.Direct - b.Price.Direct;
    });
    for (var i = 0; i < products.length; i++) {
        obj[products[i].Id] = Object.assign(products[i]);
    }
    writeFile('result.json', JSON.stringify(obj));
}

function updateUrl(pi, query) {
    pi = pi ? pi : '';
    query = query ? query : '';

    var url = 'https://rtapi.ruten.com.tw/api/search/v2/index.php/core/prod?limit=60&offset=' + transformOffset(pi) + '&q=' + encodeURI(query);
    return url;
}

function transformOffset(pi) {
    return (pi - 1) * 50;
}