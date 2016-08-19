var dbhelper =require('andon-bluetooth-database');
    //require('./mongodbhelper.js');

/**
 * 新增扫描记录
 * @param args
 */
exports.insertdb = function (args) {
    dbhelper.insertMongo('BleConnectTimers', args, function (result) {
        if (result === "ok") {
            console.log("新增扫描记录成功！")
        }
        else {
            console.log("新增扫描记录失败，原因：" + result);
        }
    });
}

/**
 * 更新最新一条扫描记录
 * @param callback
 */
exports.updatalastdb = function (args) {
    dbhelper.updataMongo('BleConnectTimers', {"time": args["time"]}, {$set: {"ble_down": args["ble_down"]}}, function (result) {
        if (result === "ok") {
            console.log("更新最新一条扫描记录成功！")
        }
        else {
            console.log("更新最新一条扫描记录失败，原因：" + result);
        }
    });
}

/**
 *查询handle
 * @param callback
 */
exports.selecthandledb = function (callback) {
    dbhelper.selectMongo('BleCookie', {"name": "defaulthandle"},{}, function (result) {
        callback(result);
        console.log("查询handle成功！")
    });
}

/**
 * 更新handle
 * @param args
 */
exports.updatahandledb = function (args) {
    dbhelper.updataMongo('BleCookie', {"name": "defaulthandle"}, {$set: {value: args}}, function (result) {
        if (result === "ok") {
            console.log("更新handle成功！")
        }
        else {
            console.log("更新handle失败，原因：" + result);
        }
    });
}

/**
 * 新增统计记录
 * @param args
 */
exports.insertCountdb = function (args) {
    dbhelper.insertMongo('BleConnectCount', args, function (result) {
        if (result === "ok") {
            console.log("新增统计记录成功！")
        }
        else {
            console.log("新增统计记录失败，原因：" + result);
        }
    });
}

/**
 *查询count
 * @param callback
 */
exports.selectCountdb = function (args, callback) {
    dbhelper.selectMongo('BleConnectCount', args,{}, function (result) {
        callback(result);
        console.log("查询count成功！")
    });
}

/**
 * 更新count
 * @param args
 */
exports.updataCountdb = function (args) {
    var set = "";
    switch (args["set"]) {
        case "normalDisconSum":
            set = {"normalDisconSum": 1};
            break;
        case "conFai":
            set = {"conFai": 1};
            break;
        case "disconSuc":
            set = {"disconSuc": 1};
            break;
        case "disconFai":
            set = {"disconFai": 1};
            break;
        case "unormalDisconSum":
            set = {"unormalDisconSum": 1};
            break;
        case "hciDeviceFailNum":
            set = {"hciDeviceFailNum": 1};
            break;
        case "conSuc":
            set = {"conSuc": 1};
            break;
    }
    dbhelper.updataMongo('BleConnectCount', {"mac": args["mac"]}, {"$inc": set}, function (result) {
        if (result === "ok") {
            console.log("更新count成功！")
        }
        else {
            console.log("更新count失败，原因：" + result);
        }
    });
}


/**
 * 新增扫描设备，存入缓存
 * @param args
 */
exports.insertDeviceInfodb = function (args) {
    dbhelper.insertMongo('BleDeviceInfo', args, function (result) {
        if (result === "ok") {
            console.log("新增扫描设备成功！")
        }
        else {
            console.log("新增扫描设备失败，原因：" + result);
        }
    });
}

/**
 * 更新扫描设备，存入缓存（暂时没用）
 * @param args
 */
exports.updataDeviceInfodb = function (args) {
    var data = [args];
    dbhelper.updataMongo('BleConnectCount', {"mac": data[0]["mac"]}, {$set: data[0]["set"]}, function (result) {
        if (result === "ok") {
            console.log("更新扫描设备成功！")
        }
        else {
            console.log("更新扫描设备失败，原因：" + result);
        }
    });
}


