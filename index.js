/**
 * Bluetooth scanner using Bluez tools
 */
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dbtool = require('./tests/dbtools');

var BluetoothScanner = module.exports = function (option, callback) {
    var self = this;

    // Inherit EventEmitter
    EventEmitter.call(self);

    self.init = function (option) {
        var tool_path = "";
        if (hcidev === 'fake') {
            tool_path = './';
        }

        var hcidev = 'hci0';
        var macAddr = option['mac'];
        var mobName = option['mobName'];
        var devicename = option['name'];
        var flag = option['flag'];
        // Bring selected device UP
        var hciconfig = spawn('hciconfig', [hcidev, 'up']);

        hciconfig.on("exit", function (code) {
            if (code !== 0) {
                console.log("Device " + hcidev + "up fail!");
                dbtool.selectCountdb({"mac": macAddr}, function (count) {
                    connectrRecord =
                    {
                        "mac": macAddr,
                        "set": {
                            "hciDeviceFailNum": count[0]["hciDeviceFailNum"] + 1
                        }
                    }
                    dbtool.updataCountdb(connectrRecord);
                });
            }
            else {
                console.log("Device " + hcidev + "up suceed!");
                //begin Scan
                var begintime = new Date();
                var endtime = new Date();
                // Start skcan
                var hciToolScan = spawn('hcitool', ['lecc', macAddr])
                console.log("hcitool lecc: started...");
                console.log("connect:" + macAddr);
                hciToolScan.stdout.on('data', function (data) {
                    if (data.length) {
                        var endtime = new Date();
                        console.log("连接成功!");
                        console.log("设备名称:" + option['name'] + "|mac:" + option['mac']);
                        var ConnectionTime = (endtime.getTime() - begintime.getTime());
                        console.log('\t' + "连接时间:" + ConnectionTime + "ms");
                        data = data.toString('utf-8');
                        // 断开handle
                        if (data.indexOf('Connection handle ') === 0) {
                            var handleValue = data.replace("Connection handle ", "");
                            console.log("handlevalue:" + handleValue);
                            var hciToolScans = spawn('hcitool', ['ledc', handleValue]);
                            dbtool.selectCountdb({"mac": macAddr}, function (count) {
                                connectrRecord =
                                {
                                    "mac": macAddr,
                                    "set": {
                                        "normalDisconSum": count[0]["normalDisconSum"] + 1
                                    }
                                }
                                dbtool.updataCountdb(connectrRecord);
                            });
                            hciToolScans.stdout.on('data', function (data) {
                                data = data.toString('ascii');
                                console.log("ledc:" + data);
                            });
                            //扫描记录存库、handle更新，返回成功结果
                            var handleEndtime = new Date();
                            var DisconnectionTime = (handleEndtime.getTime() - endtime.getTime());
                            console.log('\t' + "断开时间:" + DisconnectionTime + "ms");
                            var args = {
                                "mac": option['mac'],
                                "ConnectionTime": ConnectionTime,
                                "DisconnectTime": DisconnectionTime,
                                "flag": flag,
                                "name": devicename,
                                "mi": 5,
                                "time": new Date().getTime(),
                                "mobile": mobName
                            };
                            dbtool.insertdb(args);
                            dbtool.updatahandledb(handleValue);
                            callback(args);
                            console.log("断开成功!");
                        }
                    }
                });

                hciToolScan.on("exit", function (code) {
                    console.log("exit:" + code);

                    if (code === 1) {
                        dbtool.selecthandledb(function (datas) {
                            // console.log("BleHandle:"+datas);
                            console.log("BleHandle:" + datas[0]["value"]);
                            var hciToolScans = spawn('hcitool', ['ledc', datas[0]["value"]])
                            dbtool.selectCountdb({"mac": macAddr}, function (count) {
                                connectrRecord =
                                {
                                    "mac": macAddr,
                                    "set": {
                                        "disconFai": count[0]["disconFai"] + 1,
                                        "unormalDisconSum": count[0]["unormalDisconSum"] + 1
                                    }
                                }
                                dbtool.updataCountdb(connectrRecord);
                            });
                            hciToolScans.stdout.on('data', function (data) {
                                data = data.toString('ascii');
                                console.log("ledc:" + data);
                            });
                            callback(0);
                        });
                    }
                    else if (code === 0) {
                        dbtool.selectCountdb({"mac": macAddr}, function (count) {
                            connectrRecord =
                            {
                                "mac": macAddr,
                                "set": {
                                    "conSuc": count[0]["conSuc"] + 1
                                }
                            }
                            dbtool.updataCountdb(connectrRecord);
                        })
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
                    })
                });
            }
        })
    };

    self.init(option);
};
util.inherits(BluetoothScanner, EventEmitter);
