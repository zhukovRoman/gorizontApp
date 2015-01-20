gApp.filter = (function(arrayOfObjs, functions){
    var allObj = null;
    var filtrateFunctions= null;

    (function(){
        allObj = arrayOfObjs.concat()
        filtrateFunctions = functions.concat()
    })()

    return {
        filtrate: function(){
            var res = []
            $.each(allObj, function (i,obj){
                var testObj = true;
                for (var i = 0; i < filtrateFunctions.length; i++) {
                    var testObj = testObj && filtrateFunctions[i](obj)
                }
                if (testObj == true) res.push(obj)
            })
            return res;
        }

    }
})