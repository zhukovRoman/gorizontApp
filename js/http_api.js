gApp.httpApi = {
    url: 'http://cosmos.gorizontgroup.net/api/v1/plots',
    version: 'v1',
    username:'mobileapp',
    pass: 'yp6mFYjpxsgwY2',
    methods:{
        objects: 'plots',
        materials_consumption: ''
    },
    getRequestOption: function(method){
        return{
            url: "http://cosmos.gorizontgroup.net/api/"+gApp.httpApi.version+'/'+method,
            beforeSend: function(xhr) { xhr.setRequestHeader("Authorization", "Basic " + btoa(gApp.httpApi.username + ":" + gApp.httpApi.pass)); },
            dataType: 'jsonp'
        }
    },
    updateData: function(){
        console.log('updateData start')
        gApp.httpApi.updateObjectsData();
    },
    updateObjectsData: function(){
        $.ajax(gApp.httpApi.getRequestOption('plots'))
            .done(function(data) {
                gApp.dataSaver.setObjectsInfo(data,evalData)
            });

        function evalData (data){
            //objects = eval(data);
        }
    }
}