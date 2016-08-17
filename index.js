/**
 * Bluetooth scanner using Bluez tools
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
        // Bring selected device UP
        var hciconfig = spawn('hciconfig', [hcidev, 'up']);

        hciconfig.on("exit", function (code) {
            if (code !== 0) {
                console.log("Device " + hcidev + "up fail!");
                connectrRecord =
                {
                    "mac": macAddr,
                    "set": "hciDeviceFailNum"
                }
                dbtool.updataCountdb(connectrRecord);
            }
            else {
                console.log("Device " + hcidev + "up suceed!");
                var sacnparams = {
                    "mac": macAddr,
                    "parameter": {
                        "interval": mobileopt["scan-interval"],
                        "window": mobileopt["scan-window"]
                    }
                };
                //扫描mac
                bleScanner = new LeScanner(sacnparams, function (data) {
                    //console.log("返回扫描结果:" + JSON.stringify(data));
                    if (data["value"] === "succeed") {
                        var RSSI=data["RSSI"];
                        console.log("扫描:" + macAddr + ",成功！");
                        console.log("扫描时间：" + (data["LeScanEndtime"] - data["LeScanBegintime"]) + "ms");
                        //begin Scan
                        var begintime = new Date();
                        var endtime = new Date();
                        // Start skcan
                        //var hciToolScan = spawn('hcitool', ['lecc', macAddr])
                        var hciToolScan = spawn('hcitool', ['EdInt', macAddr, mobileopt["connect-interval"], mobileopt["connect-window"], mobileopt["connect-min_interval"], mobileopt["connect-max_interval"]]);
                        console.log("hcitool lecc: started...");
                        console.log("连接mac:" + macAddr);
                        hciToolScan.stdout.on('data', function (data) {
                            if (data.length) {
                                var endtime = new Date();
                                //console.log("连接成功!");
                                console.log("设备名称:" + option['name'] + "|mac:" + option['mac']+"|RSSI:"+RSSI);
                                var ConnectionTime = (endtime.getTime() - begintime.getTime());
                                console.log('\t' + "连接时间:" + ConnectionTime + "ms");
                                data = data.toString('utf-8');
                                // 断开handle
                                if (data.indexOf('Connection handle ') === 0) {
                                    var handleValue = data.replace("Connection handle ", "");
                                    handleValue=handleValue.replace("/n","");
                                    console.log("handlevalue:" + handleValue);
                                    var handleEndtime = new Date();
                                    //断开操作
                                    var hciToolScans = spawn('hcitool', ['ledc', handleValue]);
                                    hciToolScans.on('exit', function (code) {
                                        if (code !== 0) {
                                            console.log("ledc "+macAddr+" before failed!");
                                        } else {
                                            console.log("ledc "+macAddr+" before succeed!");
                                        }
                                    });

                                    var DisconnectionTime = (new Date().getTime()-endtime);
                                    //console.log("断开成功!");
                                    console.log('\t' + "断开时间:" + DisconnectionTime + "ms");
                                    connectRecord =
                                    {
                                        "mac": macAddr,
                                        "set": "normalDisconSum"
                                    }
                                    dbtool.updataCountdb(connectRecord);
                                    var args = {
                                        "mac": macAddr,
                                        "ConnectionTime": ConnectionTime,
                                        "DisconnectTime": DisconnectionTime,
                                        "flag": flag,
                                        "name": devicename,
                                        "mi": mi,
                                        "time": new Date().getTime(),
                                        "mobile": mobile,
                                        "data":RSSI
                                    };
                                    dbtool.insertdb(args);
                                    //扫描记录存库、handle更新，返回成功结果
                                    dbtool.updatahandledb(handleValue);
                                    callback(args);

                                }
                            }
                        });

                        hciToolScan.on("exit", function (code) {
                            console.log("exit:" + code);
                            if (code === 1) {
                                console.log("lecc(edint) "+macAddr+" failed!");
                                dbtool.selecthandledb(function (datas) {
                                    console.log("BleHandle:" + datas[0]["value"]);
                                    var hciToolScans = spawn('hcitool', ['ledc', datas[0]["value"]]);
                                    hciToolScans.on('exit', function (code) {
                                        if (code !== 0) {
                                            console.log("ledc  "+macAddr+"  after failed!");
                                        } else {
                                            console.log("ledc  "+macAddr+"  after succeed!");
                                        }
                                    });
                                    connectRecord =
                                    {
                                        "mac": macAddr,
                                        "set": "disconFai"
                                    }
                                    dbtool.updataCountdb(connectRecord);
                                    connectRecord =
                                    {
                                        "mac": macAddr,
                                        "set": "unormalDisconSum"
                                    }
                                    dbtool.updataCountdb(connectRecord);
                                    callback(0);
                                });
                            }
                            else if (code === 0) {
                                console.log("lecc(edint) "+macAddr+" succeed!");
                                console.log('\t' + "连接成功退出时间:" + (new Date().getTime()-begintime) + "ms");
                                connectRecord =
                                {
                                    "mac": macAddr,
                                    "set": "conSuc"
                                }
                                dbtool.updataCountdb(connectRecord);
                            }
                            // self.emit('done', "hcitool scan: exited (code " + code + ")");


                            var hciconfig = spawn('hciconfig', [hcidev, 'down']);
                            hciconfig.on("exit", function (code) {
                                if (code !== 0) {
                                    console.log("Device " + hcidev + "down fail!");
                                }
                                else {
                                    console.log("Device " + hcidev + "down suceed!");
                                }
                            });
                        });
                    }
                    else {
                        console.log("扫描:" + macAddr + ",失败！");
                        console.log("扫描时间：" + (data["LeScanEndtime"] - data["LeScanBegintime"]) + "ms");
                        var hciconfig = spawn('hciconfig', [hcidev, 'down']);
                        hciconfig.on("exit", function (code) {
                            if (code !== 0) {
                                console.log("Device " + hcidev + "down fail!");
                            }
                            else {
                                console.log("Device " + hcidev + "down suceed!");
                            }
                        });
                    }
                });
            }
        });
    };
    self.init(option);
};
util.inherits(BluetoothScanner, EventEmitter);
