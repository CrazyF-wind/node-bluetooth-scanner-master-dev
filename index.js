/**
 * Bluetooth scanner using Bluez tools
 */
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var BluetoothScanner = module.exports = function (option) {
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
        var hciconfig = spawn('hciconfig', [hcidev, 'up']);

        hciconfig.on("exit", function (code) {
            if (code !== 0) {
                console.log("Device " + hcidev + "up fail!");
            }
            else {
                console.log("Device " + hcidev + "up suceed!");
                //begin Scan
                var begintime = new Date();
                // Start skcan
                var hciToolScan = spawn('hcitool', ['lecc', macAddr])
                console.log("app.js:" + macAddr)

                hciToolScan.stdout.on('data', function (data) {
                    if (data.length) {
                        var endtime = new Date();
                        console.log("连接成功!");
                        console.log("设备名称:" + option['name'] + "|mac:" + option['mac']);
                        var ConnectionTime = (endtime.getTime() - begintime.getTime());
                        console.log('\t' + "连接时间:" + (endtime.getTime() - begintime.getTime()) + "ms");
                        data = data.toString('utf-8');
                    }
                });
                hciToolScan.on("exit", function (code) {
                    console.log("exit:" + code);
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
