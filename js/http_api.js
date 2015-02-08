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