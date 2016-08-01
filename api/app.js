/**
 * Created by Administrator on 2016/8/1.
 */
/**
 * lescan device
 */
var spawn = require('child_process').spawn;
var cp = require('child_process');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dbtool = require('../tests/dbtools');


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

                console.log("启动;");
                cp.exec('hcitool lescan', function(err, sto) {
                    //if(!e) {
                    //    console.log(e);
                        console.log(sto);
                        console.log(err);
                    //}
                });

                // Start skcan
                //var hciToolScan = spawn('hcitool', ['lescan'])
                //console.log("hcitool lecan: started...");
                //hciToolScan.stdout.on('data', function (data) {
                //   console.log('utf-8:'+data.toString('utf-8'));
                //    if (data.length) {
                //        var endtime = new Date();
                //        console.log("连接成功!");
                //        console.log("设备名称:" + option['name'] + "|mac:" + option['mac']);
                //        var datas = data.toString('utf-8');
                //        var args = {
                //            "mac": option['mac'],
                //            "flag": flag,
                //            "name": devicename,
                //            "time": new Date().getTime()
                //        };
                //        dbtool.insertdb(args);
                //        callback(args);
                //    }
                //});
                //
                //hciToolScan.on("exit", function (code) {
                //    console.log("exit:" + code);
                //    // self.emit('done', "hcitool scan: exited (code " + code + ")");
                //    var hciconfig = spawn('hciconfig', [hcidev, 'down']);
                //    hciconfig.on("exit", function (code) {
                //        if (code !== 0) {
                //            console.log("Device " + hcidev + "down fail!");
                //        }
                //        else {
                //            console.log("Device " + hcidev + "down suceed!");
                //        }
                //    })
                //});
            }
        })
    };

    self.init(option);
};
util.inherits(BluetoothScanner, EventEmitter);
