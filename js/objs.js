gorizontApp.objects={
    filterObjects: function(){
        console.log($(this).val())
    },
    onShowActions: function(){
        //bind events
        $('#type-filter').touchFilter({
            name: "Объект",
            items: [['roads','Дороги'],['junction','Переход'],['bridges','Мосты']]
        })

        $('#distinct-filter').touchFilter({
            name: "Округ",
            columns: 4,
            items: [['СВАО','СВАО'],['ЗАО','ЗАО'],['САО','САО'],['ЮВАО','ЮВАО'],
                ['ВАО','ВАО'],['ЮАО','ЮАО'],['ЮЗАО','ЮЗАО'],['СЗАО','СЗАО'],
                ['ЦАО','ЦАО']]
        })


        $('#menu-button').click(gorizontApp.toggleMenu)

        $( ".content" ).on( "swiperight", gorizontApp.showMenu)
        $( ".content" ).on( "swipeleft", gorizontApp.hideMenu)

        $('#type-filter').on('tf.change', function(){console.log($('#type-filter').touchFilter('getValues'))})

        $('#objects_search_input').on('keyup', gorizontApp.objects.filterObjects);

        gorizontApp.objects.bindRowsInList();

        var map = L.map('objects_map').setView([55.5705, 37.43], 10);
        L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '',
            id: 'examples.map-20v6611k'
            //id: 'zhuk99.kpafdddm'
        }).addTo(map);

        map.dragging.enable()

    },
    bindRowsInList: function(){
        var container = $('#object_search_result')
        $.each(objects, function (i,val){
            var a = $(document.createElement('a')).attr('href', '#')
            a.append($(document.createElement('span')).text(val.name))
            a.append($(document.createElement('span')).text(val.type))
            container.append(a)
        })
    }
}