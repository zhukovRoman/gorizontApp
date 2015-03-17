gApp.objects = {
    map: null,
    marker_group: null,
    filter_logic: null,
    filterate_objects: null,
    filterObjects: function(){
        gApp.objects.filterate_objects = gApp.objects.filter_logic.filtrate();
    },
    onShowActions: function(){

        //$('#type-filter').touchFilter({
        //    name: "Объект",
        //    items: gApp.objects.getAllTypesByObjects()
        //})

        $('#distinct-filter').touchFilter({
            name: "Округ",
            columns: 4,
            items:  gApp.objects.getAllDistinctsByObjects()
        })
        //var elem = ;
        new Switchery(document.querySelector('.js-switch'), { color: '#f17e30', size: 'large' });

        gApp.objects.initMap();

        gApp.objects.filter_logic = gApp.filter(objects, gApp.objects.testsFunction)

        gApp.objects.filterObjectAndRedrawAll();

        $('#distinct-filter').on('tf.change', gApp.objects.filterObjectAndRedrawAll)

        $('#objects_search_input').on('keyup', gApp.objects.filterObjectAndRedrawAll);
        $('#show_complete_checkbox').on('change', gApp.objects.filterObjectAndRedrawAll);

    },

    //getAllTypesByObjects: function(){
    //    var items = {}
    //    $.each(objects, function(i,val){
    //        if (!items[val.type])items[val.type] = val.type
    //    })
    //    var res =[];
    //    $.each(items, function(i, val){
    //        res.push ([val, val])
    //    })
    //    return res;
    //},
    getAllDistinctsByObjects: function(){
        var items = {}
        $.each(objects, function(i,val){
            if (!items[val.district])items[val.district] = val.district
        })
        var res =[];
        $.each(items, function(i, val){
            res.push ([val, val])
        })
        return res;

    },
    filterObjectAndRedrawAll: function(){
        gApp.objects.filterObjects();
        gApp.objects.bindRowsInList();
        gApp.objects.bindMarkersOnMap();
    },
    testsFunction: [
        //testDistinct:
        function(obj){
            return $('#distinct-filter').touchFilter('getValues').indexOf(obj.district)>=0
        },
        //testType:
        //function(obj){
        //    return $('#type-filter').touchFilter('getValues').indexOf(obj.type)>=0
        //},
        //testNameAndAddress:
        function(obj){
            var query = $('#objects_search_input').val().toLowerCase()
            if (query.length == 0) return true
            var name = [obj.name, objects.district, obj.address].join(' ').toLowerCase()
            return name.indexOf(query)>=0
        },
        //test is complete:
        function(obj){
            if (!obj.is_completed) return true
            return $('#show_complete_checkbox').prop("checked")
        }
    ],
    initMap: function() {
        gApp.objects.map = L.map('objects_map',{maximumAge: 1000000}).setView([55.5705, 37.43], 10);
        L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '',
            //id: 'examples.map-20v6611k'
            //id: 'zhuk99.kpafdddm'
            id: 'examples.map-i86l3621',
            detectRetina: false,
            reuseTiles: true,
            unloadInvisibleTiles: false
        }).addTo(gApp.objects.map);
        gApp.objects.map.dragging.enable()
    },
    bindMarkersOnMap: function(){
        if (gApp.objects.map && gApp.objects.marker_group)
            gApp.objects.map.removeLayer(gApp.objects.marker_group)
        var markerArray = [];
        $.each(gApp.objects.filterate_objects, function (i,obj){
            markerArray.push(L.marker(obj.latlng, gApp.getMarkerOption(obj))
                                    .bindPopup(gApp.getMarkerPopupContent(obj),{closeButton:false}))
        })

        if (markerArray.length==0) return
        gApp.objects.marker_group = L.featureGroup(markerArray).addTo(gApp.objects.map);
        gApp.objects.map.fitBounds(gApp.objects.marker_group.getBounds().pad(0.03));
    },
    bindRowsInList: function(){
        var container = $('#object_search_result').html('')
        $.each(gApp.objects.filterate_objects, function (i,val){
            var a = $(document.createElement('a')).attr('href', 'object_detail.html?id='+val.id)
            a.append($(document.createElement('span')).text(val.name))
            a.append($(document.createElement('span')).text(val.district))
            container.append(a)
        })
    }

}