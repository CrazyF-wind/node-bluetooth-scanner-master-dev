/**
 * Created by Administrator on 2016/8/1.
 */
var Scanner = require("../api/app.js");
var dbtools = require('../tests/dbtools');

var options = process.argv;

//scan foreach
//dbtools.selectdb(function (data) {
    var option =
    {
        "name": options[4],
        "mac": options[2],
        "flag": options[3]
    };
bleScanner = new Scanner(option, function (data) {
    res.json(data);
});
//});
