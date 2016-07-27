var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://10.0.0.2:27017/wilsondb1';

/**
 * 查询扫描记录
 * @param callback
 */
exports.selectdb=function (callback) {
    var selectData = function(db, callback) {
        //连接到表
        var collection = db.collection('tb2');
        //查询数据
        collection.find().toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }


    MongoClient.connect(DB_CONN_STR, function(err, db) {
        // console.log("连接成功！");
        selectData(db, function(result) {
            // console.log(result);
            callback(result);
            db.close();
        });
    });

}


/**
 * 新增扫描记录
 * @param args
 */
exports.insertdb=function (args) {

    var insertData = function(db, callback) {
        //连接到表
        var collection = db.collection('BleConnectTimers');
        //插入数据
        var data = [args];
        collection.insert(data, function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }


    MongoClient.connect(DB_CONN_STR, function(err, db) {
        // console.log("连接成功！");
        insertData(db, function(result) {
            // console.log(result);
            db.close();
        });
    });

}

/**
 *查询handle
 * @param callback
 */
exports.selecthandledb=function (callback) {
    var selecthandleData = function(db, callback) {
        //连接到表
        var collection = db.collection('BleCookie');
        //查询数据
        collection.find({"name":"defaulthandle"}).toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }


    MongoClient.connect(DB_CONN_STR, function(err, db) {
        selecthandleData(db, function(result) {
            // console.log(result);
            callback(result);
            db.close();
        });
    });

}

/**
 * 更新handle
 * @param args
 */
exports.updatahandledb=function (args) {

    var updatahandleData = function(db, callback) {
        //连接到表
        var collection = db.collection('BleCookie');
        //updata handle
        var data = [args];
        collection.update({name:'defaulthandle'}, {$set:{value:data}}, function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }


    MongoClient.connect(DB_CONN_STR, function(err, db) {
        // console.log("连接成功！");
        updatahandleData(db, function(result) {
            // console.log(result);
            db.close();
        });
    });

}

/**
 * 新增统计记录
 * @param args
 */
exports.insertCountdb=function (args) {

    var insertCountData = function(db, callback) {
        //连接到表
        var collection = db.collection('BleConnectCount');
        //插入数据
        var data = [args];
        collection.insert(data, function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }


    MongoClient.connect(DB_CONN_STR, function(err, db) {
        // console.log("连接成功！");
        insertCountData(db, function(result) { 
            db.close();
        });
    });

}

/**
 *查询count
 * @param callback
 */
exports.selectCountdb=function (args,callback) {
    var selectCountData = function(db, callback) {
        //连接到表
        var collection = db.collection('BleConnectCount');
        //查询数据
        collection.find(args).toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }


    MongoClient.connect(DB_CONN_STR, function(err, db) {
        selectCountData(db, function(result) {
            // console.log(result);
            callback(result);
            db.close();
        });
    });

}

/**
 * 更新count
 * @param args
 */
exports.updataCountdb=function (args) {

    var updataCountData = function(db, callback) {
        //连接到表
        var collection = db.collection('BleConnectCount');
        //updata handle
        var data = [args]; 
        collection.update({"mac":data[0]["mac"]}, {$set:data[0]["set"]}, function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }


    MongoClient.connect(DB_CONN_STR, function(err, db) {
        // console.log("连接成功！");
        updataCountData(db, function(result) {
            // console.log(result);
            db.close();
        });
    });

}


