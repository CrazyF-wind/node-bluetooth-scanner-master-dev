/**
 * Created by Administrator on 2016/8/18.
 */
var dbtool = require('./tests/dbtools');
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var LeScanner = require("andon-bluetooth-oncelescan-temp");

var BluetoothScanner = module.exports = function (option, callback) {
    var self = this;

    // Inherit EventEmitter
    EventEmitter.call(self);

    self.init = function (option) {
        var tool_path = "";
        if (hcidev === 'fake') {
            tool_path = './';
        }
        console.log("connect index:" + JSON.stringify(option));
        //记录连接异常情况
        var connectRecord = {};
        var hcidev = 'hci0';
        var macAddr = option['mac'];
        var mobile = option['mobile'];
        var devicename = option['name'];
        var mi = option['mi'];
        var flag = option['flag'];
        var mobileopt = option['mobileopt'];

        var record_time = new Date().getTime();
        var connect_time = 0;
        var disconnect_time = 0;
        var lescan_time = 0;

        //标记位：1成功，0失败
        var ble_up = 0;
        var ble_down = 0;
        var lecc = 0;
        var ledc_Once = 0;
        var ledc_Twice = 0;
        var lescan = 0;
        var args = {};

        // Bring selected device UP
        var hciconfig = spawn('hciconfig', [hcidev, 'up']);


        hciconfig.on("exit", function (code) {
            //启动蓝牙失败
            if (code !== 0) {
                console.log("hcitool Device " + hcidev + "up fail!");
                //写入统计库
                args={
                    "mac": macAddr,
                    "flag": flag,
                    "mi": mi,
                    "mobile": mobile,
                    "name":devicename,
                    "inc":{
                        "deviceup_failed":1
                    }
                };
                dbtool.updateStatisticsdb(args);
                callback({"result": 0, "value": "蓝牙启动失败！"});
            }
            else {
                console.log("Device " + hcidev + "up suceed!");
                //扫描参数
                var scan_params = {
                    "mac": macAddr,
                    "flag": flag,
                    "mi": mi,
                    "mobile": mobile,
                    "name":devicename,
                    "parameter": {
                        "interval": mobileopt["scan-interval"],
                        "window": mobileopt["scan-window"]
                    }
                };
                //扫描mac
                //bleScanner = new LeScanner(scan_params, function (data) {
                //    console.log("返回扫描结果:" + JSON.stringify(data));
                //    if (data["value"] === "succeed") {
                        var RSSI ='-80';
                            //data["RSSI"];
                //        lescan_time = data["LeScanEndtime"] - data["LeScanBegintime"];
                        console.log("扫描:" + macAddr + ",成功！");
                        console.log("扫描时间：" + lescan_time + "ms");
                        //写入统计库
                        args={
                            "mac": macAddr,
                            "flag": flag,
                            "mi": mi,
                            "mobile": mobile,
                            "name":devicename,
                            "inc":{
                                "lescan": 1,
                            }
                        };
                        dbtool.updateStatisticsdb(args);
                        //begin Connect
                        var begin_time = new Date();
                        var end_time = new Date();

                            var hciToolScan = spawn('hcitool', ['EdInt', macAddr, mobileopt["connect-interval"], mobileopt["connect-window"], mobileopt["connect-min_interval"], mobileopt["connect-max_interval"]]);
                            console.log("hcitool lecc: started..."+['EdInt', macAddr, mobileopt["connect-interval"], mobileopt["connect-window"], mobileopt["connect-min_interval"], mobileopt["connect-max_interval"]]);
                            console.log("连接设备:" + macAddr);
                            hciToolScan.stdout.on('data', function (data) {
                                if (data.length) {
                                    end_time = new Date();
                                    //console.log("连接成功!");
                                    console.log("设备名称:" + option['name'] + "|mac:" + option['mac'] + "|RSSI:" + RSSI);
                                    connect_time = (end_time.getTime() - begin_time.getTime());
                                    console.log('\t' + "连接时间:" + connect_time + "ms");
                                    data = data.toString('utf-8');
                                    // 断开handle
                                    if (data.indexOf('Connection handle ') === 0) {
                                        var handleValue = data.replace("Connection handle ", "");
                                        handleValue = handleValue.replace("/n", "");
                                        console.log("handlevalue:" + handleValue);
                                        var handleEndtime = new Date();
                                        //断开操作
                                        var hciToolScans = spawn('hcitool', ['ledc', handleValue]);
                                        hciToolScans.on('exit', function (code) {
                                            disconnect_time = (new Date().getTime() - handleEndtime);
                                            //console.log("断开成功!");
                                            console.log('\t' + "断开时间:" + disconnect_time + "ms");

                                            if (code !== 0) {
                                                console.log("lecc succeed ledc failed!");
                                                //写入统计库
                                                args={
                                                    "mac": macAddr,
                                                    "flag": flag,
                                                    "mi": mi,
                                                    "mobile": mobile,
                                                    "name":devicename,
                                                    "inc":{
                                                        "ledc_failed":1,
                                                        "lecc": 1
                                                    }
                                                };
                                                dbtool.updateStatisticsdb(args);
                                                // ledc_Once = 1;
                                            } else {
                                                console.log("lecc succeed ledc succeed!");
                                                //写入统计库
                                                args={
                                                    "mac": macAddr,
                                                    "flag": flag,
                                                    "mi": mi,
                                                    "mobile": mobile,
                                                    "name":devicename,
                                                    "inc":{
                                                        "ledc_success":1,
                                                        "lecc": 1
                                                    }
                                                };
                                                dbtool.updateStatisticsdb(args);
                                                // ledc_Once = 0;
                                            }

                                            args = {
                                                "mac": macAddr,
                                                "ConnectionTime": connect_time,
                                                "DisconnectTime": disconnect_time,
                                                "flag": flag,
                                                "name": devicename,
                                                "mi": mi,
                                                "time": record_time,
                                                "mobile": mobile,
                                                "LescanTime": lescan_time,
                                                "RSSI": RSSI,
                                                "isConnect":1
                                            };
                                            dbtool.insertdb(args);
                                        });

                                        //扫描记录存库、handle更新，返回成功结果
                                        dbtool.updatahandledb(handleValue);
                                        callback({
                                            "result": 1,
                                            "value": "成功！连接时间：" + connect_time + "ms，扫描时间：" + lescan_time + "ms！"
                                        });

                                    }
                                }
                            });

                            hciToolScan.on("exit", function (code) {
                                console.log("exit:" + code);
                                if (code !== 0) {
                                    //第一次连接失败
                                    console.log("lecc(edint) " + macAddr + " failed!");
                                    dbtool.selecthandledb(function (datas) {
                                        console.log("BleHandle:" + datas[0]["value"]);
                                        //第二次断开
                                        var hciToolScans = spawn('hcitool', ['ledc', datas[0]["value"]]);
                                        hciToolScans.on('exit', function (code) {
                                            if (code !== 0) {
                                                console.log("lecc failed ledc failed!");
                                                //写入统计库
                                                args={
                                                    "mac": macAddr,
                                                    "flag": flag,
                                                    "mi": mi,
                                                    "mobile": mobile,
                                                    "name":devicename,
                                                    "inc":{
                                                        "lecc_failed":1,
                                                        "ledc_failed":1,
                                                        "ledc_Twice":1
                                                    }
                                                };
                                                dbtool.updateStatisticsdb(args);
                                                // ledc_Twice = 0;
                                            } else {
                                                console.log("lecc failed ledc succeed!");
                                                //写入统计库
                                                args={
                                                    "mac": macAddr,
                                                    "flag": flag,
                                                    "mi": mi,
                                                    "mobile": mobile,
                                                    "name":devicename,
                                                    "inc":{
                                                        "lecc_failed":1,
                                                        "ledc_failed":1
                                                    }
                                                };
                                                dbtool.updateStatisticsdb(args);
                                                // ledc_Twice = 1;
                                            }
                                        });
                                        callback({"result": 0, "value": "失败！扫描时间：" + lescan_time + "ms！"});
                                    });
                                    //记录只扫描不连接的次数
                                    args = {
                                        "mac": macAddr,
                                        "flag": flag,
                                        "name": devicename,
                                        "mi": mi,
                                        "time": record_time,
                                        "mobile": mobile,
                                        "LescanTime": lescan_time,
                                        "RSSI": RSSI,
                                        "isConnect":0
                                    };
                                    dbtool.insertdb(args);
                                }
                                else {
                                    console.log("连接成功!");
                                    console.log('\t' + "连接成功退出时间:" + (new Date().getTime() - begin_time) + "ms");
                                }

                                var hciconfig = spawn('hciconfig', [hcidev, 'down']);
                                hciconfig.on("exit", function (code) {
                                    if (code !== 0) {
                                        console.log("Device " + hcidev + "down failed!");
                                        //写入统计库
                                        args={
                                            "mac": macAddr,
                                            "flag": flag,
                                            "mi": mi,
                                            "mobile": mobile,
                                            "name":devicename,
                                            "inc":{
                                                "devicedown_failed":1
                                            }
                                        };
                                        dbtool.updateStatisticsdb(args);
                                    }
                                    else {
                                        console.log("Device " + hcidev + "down succeed!");
                                        //写入统计库
                                        args={
                                            "mac": macAddr,
                                            "flag": flag,
                                            "mi": mi,
                                            "mobile": mobile,
                                            "name":devicename,
                                            "inc":{
                                                "devicedown_success":1
                                            }
                                        };
                                        dbtool.updateStatisticsdb(args);
                                    }

                                    //callback({"result": 0, "value": "蓝牙断开失败！"});
                                });

                            });

                        // Start Connect
                        // var hciToolScan = spawn('hcitool', ['EdInt', macAddr, mobileopt["connect-interval"], mobileopt["connect-window"], mobileopt["connect-min_interval"], mobileopt["connect-max_interval"]]);
                        // console.log("hcitool lecc: started..."+['EdInt', macAddr, mobileopt["connect-interval"], mobileopt["connect-window"], mobileopt["connect-min_interval"], mobileopt["connect-max_interval"]]);
                        
                    //}
                    //else {
                    //    console.log("扫描:" + macAddr + ",失败！");
                    //    console.log("扫描时间：" + (data["LeScanEndtime"] - data["LeScanBegintime"]) + "ms");
                    //    var hciconfig = spawn('hciconfig', [hcidev, 'down']);
                    //    hciconfig.on("exit", function (code) {
                    //        if (code !== 0) {
                    //            console.log("hcitool Device " + hcidev + "down fail!");
                    //            //写入统计库
                    //            args={
                    //                "mac": macAddr,
                    //                "flag": flag,
                    //                "mi": mi,
                    //                "mobile": mobile,
                    //                "name":devicename,
                    //                "inc":{
                    //                    "lescan_failed": 1,
                    //                    "devicedown_failed":1
                    //                }
                    //            };
                    //            dbtool.updateStatisticsdb(args);
                    //        }
                    //        else {
                    //            console.log("hcitool Device " + hcidev + "down suceed!");
                    //            //写入统计库
                    //            args={
                    //                "mac": macAddr,
                    //                "flag": flag,
                    //                "mi": mi,
                    //                "mobile": mobile,
                    //                "name":devicename,
                    //                "inc":{
                    //                    "lescan_failed": 1,
                    //                    "devicedown_success":1
                    //                }
                    //            };
                    //            dbtool.updateStatisticsdb(args);
                    //        }
                    //
                    //
                    //        callback({"result": 0, "value": "失败！扫描超时！"});
                    //    });
                    //}
                //});
            }
        });
    };
    self.init(option);
};
util.inherits(BluetoothScanner, EventEmitter);
