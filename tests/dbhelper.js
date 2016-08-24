/**
 * Created by Administrator on 2016/8/10.
 */
var mongodb = require('andon-bluetooth-database');

/**
 * 通用，新增操作
 * @param tablename 操作表名
 * @param args  插入内容
 * @callback 返回结果
 */
exports.insertMongo = function (tablename, args, callback) {
    //重新连接数据库
    if (!mongodb.openCalled) {
        mongodb.open(function (err, db) {
            if (err) {
                return callback(err);
            }
            //读取 posts 集合
            db.collection(tablename, function (err, collection) {
                if (err) {
                    mongodb.close();
                }
                collection.insert(args, function (err, result) {
                    console.log("insert MongoDB:" + JSON.stringify(result));
                    if (err) {
                        return callback(err);
                    }
                    callback("ok");
                    mongodb.close();
                });
            });
        });
    }
    else    //数据库已连接，直接对数据进行操作
    {
        mongodb.collection(tablename, function (err, collection) {
            if (err) {
                mongodb.close();
            }
            collection.insert(args, function (err, result) {
                console.log("insert MongoDB:" + JSON.stringify(result));
                if (err) {
                    return err;
                }
                callback("ok");
                mongodb.close();
            });
        });
    }
}

/**
 * 通用，修改操作
 * @param tablename 操作表名
 * @param where 查询条件，格式：{name: 'defaulthandle'}
 * @param sets  修改内容，格式：{$set: {value: data}}
 *  @callback 返回结果
 */
exports.updataMongo = function (tablename, where, sets, callback) {
    //重新连接数据库
    if (!mongodb.openCalled) {
        mongodb.open(function (err, db) {
            if (err) {
                return callback(err);
            }
            //读取 posts 集合
            db.collection(tablename, function (err, collection) {
                if (err) {
                    mongodb.close();
                }
                collection.update(where, sets, function (err, result) {
                    console.log("updata MongoDB:" + JSON.stringify(result));
                    if (err) {
                        return callback(err);
                    }
                    callback("ok");
                    mongodb.close();
                });
            });
        });
    }
    else    //数据库已连接，直接对数据进行操作
    {
        mongodb.collection(tablename, function (err, collection) {
            if (err) {
                mongodb.close();
            }
            collection.update(where, sets, function (err, result) {
                console.log("updata MongoDB:" + JSON.stringify(result));
                if (err) {
                    return callback(err);
                }
                callback("ok");
                mongodb.close();
            });
        });
    }
}


/**
 * 通用，修改操作
 * @param tablename 操作表名
 * @param where 查询条件，格式：{name: 'defaulthandle'}
 * @param sets  修改内容，格式：{$set: {value: data}}
 * @param option upsert: <boolean>,multi: <boolean>,writeConcern: <document>
 * @callback 返回结果
 */
exports.updateMongoWithOption = function (tablename, where, sets,option, callback) {
    //重新连接数据库
    if (!mongodb.openCalled) {
        mongodb.open(function (err, db) {
            if (err) {
                return callback(err);
            }
            //读取 posts 集合
            db.collection(tablename, function (err, collection) {
                if (err) {
                    mongodb.close();
                }
                collection.update(where, sets,option, function (err, result) {
                    console.log("updata MongoDB:" + JSON.stringify(result));
                    if (err) {
                        return callback(err);
                    }
                    callback("ok");
                    mongodb.close();
                });
            });
        });
    }
    else    //数据库已连接，直接对数据进行操作
    {
        mongodb.collection(tablename, function (err, collection) {
            if (err) {
                mongodb.close();
            }
            collection.update(where, sets,option,function (err, result) {
                console.log("updata MongoDB:" + JSON.stringify(result));
                if (err) {
                    return callback(err);
                }
                callback("ok");
                mongodb.close();
            });
        });
    }
}


/**
 * 通用，查询操作
 * @param tablename 操作表名
 * @param args  查询条件
 * @callback 返回结果
 */
exports.selectMongo = function (tablename, args, callback) {
    //重新连接数据库
    if (!mongodb.openCalled) {
        mongodb.open(function (err, db) {
            if (err) {
                return callback(err);
            }
            //读取 posts 集合
            db.collection(tablename, function (err, collection) {
                if (err) {
                    mongodb.close();
                }
                collection.insert(args, function (err, result) {
                    console.log("select MongoDB:" + JSON.stringify(result));
                    if (err) {
                        return callback(err);
                    }
                    callback(result);
                    mongodb.close();
                });
            });
        });
    }
    else    //数据库已连接，直接对数据进行操作
    {
        mongodb.collection(tablename, function (err, collection) {
            if (err) {
                mongodb.close();
            }
            collection.insert(args, function (err, result) {
                console.log("select MongoDB:" + JSON.stringify(result));
                if (err) {
                    return callback(err);
                }
                callback(result);
                mongodb.close();
            });
        });
    }
}




