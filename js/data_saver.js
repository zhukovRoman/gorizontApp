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
        gApp.Noty.add('Произошла ошибка при работе с БД. Сообшите разработчику о проблеме.', Noty.types.error, null, 0, true)

    },
    createDB: function(){
        gApp.dataSaver.db.transaction(query, gApp.dataSaver.onError, success);
        function query (tx){
            //tx.executeSql('CREATE TABLE IF NOT EXISTS SETTINGS ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "key" TEXT, "value" TEXT)');
            //tx.executeSql('DROP TABLE IF EXISTS OBJECTS');
            //tx.executeSql('DROP TABLE IF EXISTS MATERIALS_CONSUMPTIONS');
            //tx.executeSql('DROP TABLE IF EXISTS MATERIALS_PLOT');
            tx.executeSql('CREATE TABLE IF NOT EXISTS OBJECTS ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "key" TEXT, "value" TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS MATERIALS_CONSUMPTIONS ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "object_id" TEXT, "value" TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS MATERIALS_PLOT ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "object_id" TEXT, "value" TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS REQUESTS_PLOT ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "object_id" TEXT, "value" TEXT)');
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
            var res = null;
            for (var i=0; i<len; i++){
                res = (eval(results.rows.item(i).value));
            }
            callback(res||[]);
        }
    },
    setObjectsInfo: function(value, callback){
        gApp.dataSaver.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM OBJECTS", [], querySuccess, gApp.dataSaver.onError);
        });
        function querySuccess(tx, results) {
            if (results.rows.length == 0 ) {
                gApp.dataSaver.db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO OBJECTS (key, value) values(?, ?)", ['objects_info', JSON.stringify(value)], onSuccess, gApp.dataSaver.onError);
                });

            }
            else gApp.dataSaver.db.transaction(function(tx) {
                tx.executeSql("UPDATE OBJECTS SET value = ? where key =  ?", [JSON.stringify(value), 'objects_info'], onSuccess, gApp.dataSaver.onError);
            });
        }
        function onSuccess (){
            window.objects = eval (value)
            //callback(value)
        }
    },
    getMaterialsConsumtionsByObject: function(obj_id, callback){
        gApp.dataSaver.db.transaction(query, gApp.dataSaver.onError);
        function query (tx){
            tx.executeSql("SELECT * FROM MATERIALS_CONSUMPTIONS WHERE object_id=?", [obj_id], success, gApp.dataSaver.onError)
        }
        function success(tx, results){
            var len = results.rows.length;
            var res = null;
            for (var i=0; i<len; i++){
                console.log((results.rows.item(i).value))
                res = (results.rows.item(i).value+'')
            }
            console.log('fin')
            var tmp = eval("["+res+"]");
            if(callback) callback(tmp[0]);
        }
    },
    setMaterialsConsumtionsByObject: function(obj_id, value, callback){
        gApp.dataSaver.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM MATERIALS_CONSUMPTIONS where object_id=?", [obj_id], querySuccess, gApp.dataSaver.onError);
        });
        function querySuccess(tx, results) {
            if (results.rows.length == 0 ) {
                gApp.dataSaver.db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO MATERIALS_CONSUMPTIONS (object_id, value) values(?, ?)", [obj_id, JSON.stringify(value)], callback, gApp.dataSaver.onError);
                });
            }
            else gApp.dataSaver.db.transaction(function(tx) {
                tx.executeSql("UPDATE MATERIALS_CONSUMPTIONS SET value = ? where object_id =  ?", [JSON.stringify(value), obj_id], callback, gApp.dataSaver.onError);
            });
        }

    },
    getRequestsByObject: function(obj_id, callback){
        gApp.dataSaver.db.transaction(query, gApp.dataSaver.onError);
        function query (tx){
            tx.executeSql("SELECT * FROM REQUESTS_PLOT WHERE object_id=?", [obj_id], success, gApp.dataSaver.onError)
        }
        function success(tx, results){
            var len = results.rows.length;
            var res = null;
            for (var i=0; i<len; i++){
                console.log((results.rows.item(i).value))
                res = (results.rows.item(i).value+'')
            }
            console.log('fin')
            var tmp = eval("["+res+"]");
            if(callback) callback(tmp[0]);
        }
    },
    setRequestsByObject: function(obj_id, value, callback){
        gApp.dataSaver.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM REQUESTS_PLOT where object_id=?", [obj_id], querySuccess, gApp.dataSaver.onError);
        });
        function querySuccess(tx, results) {
            if (results.rows.length == 0 ) {
                gApp.dataSaver.db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO REQUESTS_PLOT (object_id, value) values(?, ?)", [obj_id, JSON.stringify(value)], callback, gApp.dataSaver.onError);
                });
            }
            else gApp.dataSaver.db.transaction(function(tx) {
                tx.executeSql("UPDATE REQUESTS_PLOT SET value = ? where object_id =  ?", [JSON.stringify(value), obj_id], callback, gApp.dataSaver.onError);
            });
        }

    },
    setMaterialsPlotByObject: function(obj_id, value, callback){
        gApp.dataSaver.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM MATERIALS_PLOT where object_id=?", [obj_id], querySuccess, gApp.dataSaver.onError);
        });
        function querySuccess(tx, results) {
            if (results.rows.length == 0 ) {
                gApp.dataSaver.db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO MATERIALS_PLOT (object_id, value) values(?, ?)", [obj_id, JSON.stringify(value)], callback, gApp.dataSaver.onError);
                });
            }
            else gApp.dataSaver.db.transaction(function(tx) {
                tx.executeSql("UPDATE MATERIALS_PLOT SET value = ? where object_id =  ?", [JSON.stringify(value), obj_id], callback, gApp.dataSaver.onError);
            });
        }

    },
    getMaterialsPlotByObject: function(obj_id, callback){
        gApp.dataSaver.db.transaction(query, gApp.dataSaver.onError);
        function query (tx){
            tx.executeSql("SELECT * FROM MATERIALS_PLOT WHERE object_id=?", [obj_id], success, gApp.dataSaver.onError)
        }
        function success(tx, results){
            var len = results.rows.length;
            var res = null;
            for (var i=0; i<len; i++){
                res = (eval(results.rows.item(i).value))
            }
            if(callback) callback(res);
            //console.log(res)
        }
    },
    checkDataFresh: function(){
        var dateNow = new Date().getTime();

        //  TODO  сделать проверку на дату последнего обновления
        var nId = gApp.Noty.add('Отображаюися данные от '+moment().format('DD.MM.YYYY')+'.',
                                Noty.types.alert, {text: "обновить", fn: gApp.httpApi.updateData},
                                3000, false)
        gApp.Noty.updateNotifications.push(nId);

    }
}