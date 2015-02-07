gApp.dataSaver = {
    db: null,
    options: {
        db_name: 'GorizontApp',
        size: 1024*1024*15
    },
    initDB:function(){
        gApp.dataSaver.openDB();
        gApp.dataSaver.createDB();
    },
    openDB: function(){
        gApp.dataSaver.db = window.openDatabase(gApp.dataSaver.options.db_name, "1.1", gApp.dataSaver.options.db_name, gApp.dataSaver.options.size);
    },
    onError: function(err){
        console.log("Error processing SQL: "+err.code, err);
    },
    createDB: function(){
        gApp.dataSaver.db.transaction(query, gApp.dataSaver.onError, success);
        function query (tx){
            //tx.executeSql('CREATE TABLE IF NOT EXISTS SETTINGS ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "key" TEXT, "value" TEXT)');
            tx.executeSql('DROP TABLE IF EXISTS OBJECTS');
            tx.executeSql('DROP TABLE IF EXISTS MATERIALS_CONSUMPTIONS');
            tx.executeSql('CREATE TABLE IF NOT EXISTS OBJECTS ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "key" TEXT, "value" TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS MATERIALS_CONSUMPTIONS ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "object_id" TEXT, "value" TEXT)');
        }
        function success(){
            $(document).trigger('databaseready');
        }
    },
    getObjectsInfo: function(callback){
        gApp.dataSaver.db.transaction(query, gApp.dataSaver.onError);
        function query (tx){
            tx.executeSql("SELECT * FROM OBJECTS", [], success, gApp.dataSaver.onError)
        }
        function success(tx, results){
            var len = results.rows.length;
            var res = [];
            for (var i=0; i<len; i++){
                res.push(eval(results.rows.item(i).value))
            }
            callback(res);
        }
    },
    setObjectsInfo: function(value, callback){
        gApp.dataSaver.db.transaction(function(tx) {
            console.log(1)
            tx.executeSql("SELECT * FROM OBJECTS", [], querySuccess, gApp.dataSaver.onError);
        });
        function querySuccess(tx, results) {
            if (results.rows.length == 0 ) {
                gApp.dataSaver.db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO OBJECTS (key, value) values(?, ?)", ['objects_info', value], onSuccess, gApp.dataSaver.onError);
                });

            }
            else gApp.dataSaver.db.transaction(function(tx) {
                tx.executeSql("UPDATE OBJECTS SET value = ? where key =  ?", [value, 'objects_info'], onSuccess, gApp.dataSaver.onError);
            });
        }
        function onSuccess (){
            callback(value)
        }
    },
    getMaterialsConsumtionsByObject: function(obj_id, callback){
        gApp.dataSaver.db.transaction(query, gApp.dataSaver.onError);
        function query (tx){
            tx.executeSql("SELECT * FROM OBJECTS WHERE object_id=?", [obj_id], success, gApp.dataSaver.onError)
        }
        function success(tx, results){
            var len = results.rows.length;
            var res = [];
            for (var i=0; i<len; i++){
                res.push(eval(results.rows.item(i).value))
            }
            callback(res);
        }
    },
    setMaterialsConsumtionsByObject: function(obj_id, value, callback){
        gApp.dataSaver.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM MATERIALS_CONSUMPTIONS where object_id=?", [obj_id], querySuccess, gApp.dataSaver.onError);
        });
        function querySuccess(tx, results) {
            if (results.rows.length == 0 ) {
                gApp.dataSaver.db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO MATERIALS_CONSUMPTIONS (object_id, value) values(?, ?)", [obj_id, value], callback, gApp.dataSaver.onError);
                });
            }
            else gApp.dataSaver.db.transaction(function(tx) {
                tx.executeSql("UPDATE INFO SET value = ? where object_id =  ?", [val, value], callback, gApp.dataSaver.onError);
            });
        }

    }
}