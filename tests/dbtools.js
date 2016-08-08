var mongodb = require('andon-bluetooth-database');

/**
 * 新增扫描记录
 * @param args
 */
exports.insertdb = function (args) {
    mongodb.open(function (err, db) {
        if (err) {
            return err;
        }
        //读取 posts 集合
        db.collection('BleConnectTimers', function (err, collection) {
            if (err) {
                mongodb.close();
            }
            var data = [args];
            collection.insert(data, function (err, result) {
                if (err) {
                    return err;
                }
                mongodb.close();
            });
        });
    });
}

/**
 *查询handle
 * @param callback
 */
exports.selecthandledb = function (callback) {

    mongodb.open(function (err, db) {
        if (err) {
            return err;
        }
        //读取 posts 集合
        db.collection('BleCookie', function (err, collection) {
            if (err) {
                mongodb.close();
                return err;
            }
            collection.find({"name": "defaulthandle"}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return err;
                }
                callback(docs);
            });
        });
    });
}

/**
 * 更新handle
 * @param args
 */
exports.updatahandledb = function (args) {
    mongodb.open(function (err, db) {
        if (err) {
            return err;
        }
        //读取 posts 集合
        db.collection('BleCookie', function (err, collection) {
            if (err) {
                mongodb.close();
                return err;
            }
            var data = [args];
            collection.update({name: 'defaulthandle'}, {$set: {value: data}}, function (err, result) {
                mongodb.close();
                if (err) {
                    return err;
                }
            });
        });
    });
}

/**
 * 新增统计记录
 * @param args
 */
exports.insertCountdb = function (args) {
    mongodb.open(function (err, db) {
        if (err) {
            return err;
        }
        //读取 posts 集合
        db.collection('BleConnectCount', function (err, collection) {
            if (err) {
                mongodb.close();
            }
            var data = [args];
            collection.insert(data, function (err, result) {
                if (err) {
                    return err;
                }
                mongodb.close();
            });
        });
    });

}

/**
 *查询count
 * @param callback
 */
exports.selectCountdb = function (args, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return err;
        }
        //读取 posts 集合
        db.collection('BleConnectCount', function (err, collection) {
            if (err) {
                mongodb.close();
                return err;
            }
            collection.find(args).toArray(function (err, docs) {
                console.log("docs:"+JSON.stringify(docs)+","+err);
                mongodb.close();
                if (err) {
                    return err;
                }
                callback(docs);
            });
        });
    });
}

/**
 * 更新count
 * @param args
 */
exports.updataCountdb = function (args) {
    mongodb.open(function (err, db) {
        if (err) {
            return err;
        }
        //读取 posts 集合
        db.collection('BleConnectCount', function (err, collection) {
            if (err) {
                mongodb.close();
                return err;
            }
            var data = [args];
            collection.update({"mac": data[0]["mac"]}, {$set: data[0]["set"]}, function (err, result) {
                mongodb.close();
                if (err) {
                    return err;
                }
            });
        });
    });
}


/**
 * 新增扫描设备，存入缓存
 * @param args
 */
exports.insertDeviceInfodb = function (args) {
    mongodb.open(function (err, db) {
        if (err) {
            return err;
        }
        //读取 posts 集合
        db.collection('BleDeviceInfo', function (err, collection) {
            if (err) {
                mongodb.close();
            }
            var data = [args];
            collection.insert(data, function (err, result) {
                if (err) {
                    return err;
                }
                mongodb.close();
            });
        });
    });
}

/**
 * 更新扫描设备，存入缓存
 * @param args
 */
exports.updataDeviceInfodb = function (args) {
    mongodb.open(function (err, db) {
        if (err) {
            return err;
        }
        //读取 posts 集合
        db.collection('BleDeviceInfo', function (err, collection) {
            if (err) {
                mongodb.close();
                return err;
            }
            var data = [args];
            collection.update({"mac": data[0]["mac"]}, {$set: data[0]["set"]}, function (err, result) {
                mongodb.close();
                if (err) {
                    return err;
                }
            });
        });
    });
}


