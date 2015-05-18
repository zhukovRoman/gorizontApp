gApp.httpApi = {
    url: 'cosmos.gorizontgroup.net/api/',
    version: 'v1',
    username:'mobileapp',
    pass: 'yp6mFYjpxsgwY2',
    methods:{
        objects: 'plots',
        materials_consumption: ''
    },
    getRequestOption: function(method){
        return{
            url: "http://"+gApp.httpApi.username+":"+gApp.httpApi.pass+"@"+gApp.httpApi.url+gApp.httpApi.version+'/'+method,
            dataType: 'jsonp'
        }
    },
    updateData: function(){
        gApp.removeAllUpdateNoty();
        if(!navigator.onLine){
            var nId = gApp.Noty.add('Отсутствует интернет соединение. Обновление данных невозможно.',
                                    Noty.types.error, {text: "попробовать снова", fn: gApp.httpApi.updateData},
                                    0, true)
            gApp.Noty.updateNotifications.push(nId);
            gApp.dataSaver.checkDataFresh();
            return;
        }
        console.log('updateData start')
        gApp.httpApi.updateObjectsData();
    },
    updateObjectsData: function(){
        console.log('plots update start')
        $.ajax(gApp.httpApi.getRequestOption('plots'))
            .done(function(data) {
                console.log(data);
                gApp.Noty.add('Ваши данные успешно обновленны до '+moment().format('DD.MM.YYYY'), Noty.types.success, null, 3000, true)

                gApp.dataSaver.setObjectsInfo(data);
                console.log('plots update end')
            })
            .error(function(){
                var nId =  gApp.Noty.add('Произошла ошибка при обновлении данных',
                                Noty.types.error, {text: "попробовать снова", fn: gApp.httpApi.updateData},
                                0, true);
                gApp.Noty.updateNotifications.push(nId);
                gApp.dataSaver.checkDataFresh();
                console.log('plots update end')
            });
    },
    updateMaterialsPlotData: function(object_id, callback){
        console.log('materials_plot start update')
        $.ajax(gApp.httpApi.getRequestOption('plots/'+object_id+'/material_records'))
            .done(function(data) {
                console.log(data);
                gApp.Noty.add('Данные по остаткам материалов на участке обновлены до '+moment().format('DD.MM.YYYY'), Noty.types.success, null, 3000, true)
                gApp.dataSaver.setMaterialsPlotByObject(object_id , data)
                console.log('plots update end')
                if(callback){
                    callback(data);
                }
            })
            .error(function(){
                var nId =  gApp.Noty.add('Произошла ошибка при обновлении данных по остаткам материалов на участке', null,
                    0, true);
                gApp.Noty.updateNotifications.push(nId);
                console.log('plots update end')
            });
    },
    updateMaterialsConsumtionData: function(object_id, callback){
        console.log('materials_plot start update')
        $.ajax(gApp.httpApi.getRequestOption('plots/'+object_id+'/materials_spent'))
            .done(function(data) {
                gApp.Noty.add('Данные по списанию материалов на участке обновлены до '+moment().format('DD.MM.YYYY'), Noty.types.success, null, 3000, true)
                gApp.dataSaver.setMaterialsConsumtionsByObject(object_id , data)
                console.log('plots update end')
                if(callback){
                    callback(data);
                }
            })
            .error(function(){
                var nId =  gApp.Noty.add('Произошла ошибка при обновлении данных по остаткам материалов на участке', null,
                    0, true);
                gApp.Noty.updateNotifications.push(nId);
                console.log('plots update end')
            });
    },
    updateRequestsData: function(object_id, callback){
        console.log('materials_plot start update')
        $.ajax(gApp.httpApi.getRequestOption('plots/'+object_id+'/orders'))
            .done(function(data) {
                gApp.Noty.add('Данные по заявкам участка обновлены до '+moment().format('DD.MM.YYYY'), Noty.types.success, null, 3000, true)
                gApp.dataSaver.setRequestsByObject(object_id , data)
                console.log('plots update end')
                if(callback){
                    callback(data);
                }
            })
            .error(function(){
                var nId =  gApp.Noty.add('Произошла ошибка при обновлении данных по остаткам материалов на участке', null,
                    0, true);
                gApp.Noty.updateNotifications.push(nId);
                console.log('plots update end')
            });
    }
}


var materialFake = {id: 12,
    updated_at: 'ffff',
    materials_spent: [{
        name: "Масло гидравлическое PETRO-CANADA HYDREX XV ALL SEASON 205л",
        records: [
            {date: '03.03.2015', count: 2, unit:'шт', price:1222.50 },
            {date: '05.03.2015', count: 2, unit:'м3', price:1222.50 }
        ]
    },
        {
            name: "Масло гидравлическое PETRO-CANADA HYDREX XV ALL SEASON 100л",
            records: [
                {date: '10.04.2015', count: 2, unit:'л', price:1222.50 },
                {date: '05.04.2015', count: 2, unit:'уп', price:1222.50 }
            ]
        },

]}
var shedule = {"id":1,
    "name":"Некрасовка",
    "estimated_start_at":"2015-05-01T00:00:00.000+03:00",
    "estimated_end_at":"2015-05-31T00:00:00.000+03:00",
    "percent":0,"started_at":null,"ended_at":null,"days_lag":0,
    "status":"notstarted",
    "subschedules":[
        {"id":2,"name":"Первый этап",
            "estimated_start_at":"2015-05-01T00:00:00.000+03:00",
            "estimated_end_at":"2015-05-31T00:00:00.000+03:00",
            "percent":100,
            "started_at":"2015-05-12T00:00:00.000+03:00",
            "ended_at":"2015-05-12T19:55:33.697+03:00",
            "days_lag":0,"status":"completed",
            "subschedules":[
                {"id":4,"name":"Подэтаж 1.1",
                    "estimated_start_at":"2015-05-07T00:00:00.000+03:00",
                    "estimated_end_at":"2015-05-23T00:00:00.000+03:00",
                    "percent":0,"started_at":null,
                    "ended_at":null,"days_lag":0,
                    "status":"notstarted",
                    "subschedules":[{"id":5,"name":"1.1.1","estimated_start_at":"2015-05-14T00:00:00.000+03:00","estimated_end_at":"2015-05-15T00:00:00.000+03:00","percent":0,"started_at":null,"ended_at":null,"days_lag":3,"status":"notstarted","subschedules":[]},{"id":6,"name":"1.1.2","estimated_start_at":"2015-05-14T00:00:00.000+03:00","estimated_end_at":"2015-05-17T00:00:00.000+03:00","percent":0,"started_at":null,"ended_at":null,"days_lag":1,"status":"notstarted","subschedules":[]},{"id":7,"name":"asdasd","estimated_start_at":"2015-05-15T00:00:00.000+03:00","estimated_end_at":"2015-05-17T00:00:00.000+03:00","percent":0,"started_at":"2015-05-17T00:00:00.000+03:00","ended_at":null,"days_lag":1,"status":"inprogress","subschedules":[{"id":9,"name":"ываывавыа","estimated_start_at":"2015-05-16T00:00:00.000+03:00","estimated_end_at":"2015-05-17T00:00:00.000+03:00","percent":0,"started_at":null,"ended_at":null,"days_lag":1,"status":"notstarted","subschedules":[]}]}]}]},{"id":8,"name":"sdasdasd","estimated_start_at":"2015-05-01T00:00:00.000+03:00","estimated_end_at":"2015-05-31T00:00:00.000+03:00","percent":0,"started_at":null,"ended_at":null,"days_lag":0,"status":"notstarted","subschedules":[]},{"id":3,"name":"Второй этап","estimated_start_at":"2015-05-21T00:00:00.000+03:00","estimated_end_at":"2015-05-29T00:00:00.000+03:00","percent":0,"started_at":null,"ended_at":null,"days_lag":0,"status":"notstarted","subschedules":[]}]}
var fake = [{"id":14,
    "name":"Долгопрудный база",
    "address":"","district":"ЮВАО",
    "latlng":[55.75222,37.61556],
    "updated_at":"2015-04-15T02:35:55.186+03:00",
    "budget":10,
    "budget_spent":80000,
    "budget_used":7,
    "budget_current_plan":80000,
    "consumption_data":[],
    "material_all_count":20,
    "is_completed":false,
    "material_bought":10,
    "material_used":7,
    "manager":{"name":"Иванов А. Н.","phone":"","email":"iv@ya.ru"},
    "schedule":shedule},
    {"id":13,"name":"Основной склад","address":"","district":"","latlng":[55.75222,37.61556],"updated_at":"2015-04-07T18:15:45.104+03:00","budget":0.0,"budget_spent":0.0,"budget_used":0.0,"budget_current_plan":0.0,"consumption_data":[],"material_all_count":0,"is_completed":false,"material_bought":0,"material_used":0,"manager":{"name":"Иванов А. Н.","phone":"","email":"iv@ya.ru"},"schedule":null},
    {"id":12,"name":"КНС № 2 Напорный коллектор","address":"","district":"","latlng":[55.75222,37.61556],"updated_at":"2015-04-14T20:00:40.082+03:00","budget":0.0,"budget_spent":0.0,
        "budget_used":0.0,"budget_current_plan":0.0,
        "consumption_data":[
            {"year":2015,
                "material_bought":[0,0,0,10,0,0,0,0,0,0,0,0],
                "material_spent": [0,0,0,12.0,0,0,0,0,0,0,0,0],
                "months":[
                    {
                        "index":4,
                        "name":"Апрель",
                        "data":[[14,10.0]]
                }
                ]
            }
        ],"material_all_count":0,"is_completed":false,"material_bought":0,"material_used":55.0,"manager":{"name":"Краснышев А. В.","phone":"","email":"sad@sdf.ru"},"schedule":null},{"id":11,"name":"Хорда","address":"","district":"","latlng":[55.6822301094108,37.9254913330078],"updated_at":"2015-04-07T18:15:41.597+03:00","budget":0.0,"budget_spent":0.0,"budget_used":0.0,"budget_current_plan":0.0,"consumption_data":[],"material_all_count":0,"is_completed":false,"material_bought":0,"material_used":0,"manager":{"name":"Васенев А. С.","phone":"","email":"vs@sadasd.ru"},"schedule":null},{"id":10,"name":"Некрасовка","address":"","district":"","latlng":[55.75222,37.61556],"updated_at":"2015-04-15T02:35:55.111+03:00","budget":0.0,"budget_spent":0.0,"budget_used":0.0,"budget_current_plan":0.0,"consumption_data":[{"year":2015,"material_bought":[0,0,0,0,0,0,0,0,0,0,0,0],"material_spent":[0,0,0,0.0,0,0,0,0,0,0,0,0],"months":[{"index":4,"name":"Апрель","data":[[14,0.0]]}]}],"material_all_count":0,"is_completed":false,"material_bought":0,"material_used":1.0,"manager":{"name":"Участка Н.","phone":"","email":"builder@gorizont.ru"},"schedule":null}]