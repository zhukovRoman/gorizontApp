var gApp = {
    options: {
      animationDuration: 300
    },
    pages_links:{
      'objects': 'objects-menu-item',
      'material':"material-menu-item",
      'employee':"empl-menu-item",
      'tech': "tech-menu-item",
      'avto': "avto-menu-item"
    },

    initialize: function(){
        $(document).on('databaseready', gApp.httpApi.updateData);
        gApp.Noty = new Noty('', '');
        gApp.Noty.updateNotifications = [];
        gApp.dataSaver.initDB();
        gApp.dataSaver.getObjectsInfo(function(data){
            window.objects = data;
            gApp.bindPageEvents();
        })
    },
    bindPageEvents: function(){
        function fillCommonInfo(){
            var data = {count:0, budget_spent:0, budget:0};
            console.log(objects)
            $.each(objects, function(i, obj){
                if(obj.is_completed) return;
                data.count++;
                data.budget+=obj.budget||0;
                data.budget_spent+=obj.budget_spent||0;
            })
            console.log(data)
            setTimeout(function(){
                $('#objects_count').text(data.count);
                $('#all_objects_budget_spent').text(mln_to_text(data.budget_spent))
                $('#all_objects_budget').text(mln_to_text(data.budget))
            },100)

        }
        fillCommonInfo();
        gApp.setNotyContainersForMainPage();


        $( document ).on( "pagebeforehide","#main", function( event ) {
            $('.main-menu').removeClass('show-main-menu');
            $('.main-menu').addClass('hide-main-menu')
        })
        $(document).on( "pageshow","#main", function( event ) {
            fillCommonInfo();
            $('.main-menu').removeClass('hide-main-menu');
            $('.main-menu').addClass('show-main-menu');
            gApp.setNotyContainersForMainPage();
        });

        $( document ).on( "pagebeforehide", function( event,data ) {
            if (data.nextPage[0].id=='main') {
                $('.pages-menu').removeClass('show-pages-menu')
                $('.pages-menu').addClass('hide-pages-menu');
            }

        })
        $(document).on('pageshow', '#object_view', function(event, data){
            gApp.object_view.initObjectDetail($(this).data('url'));

        })
        $(document).on( "pageshow",'#objects', gApp.objects.onShowActions)
        gApp.addCommonEvents();
    },
    addCommonEvents: function(){
        $(document).on('pageshow', function(e, data){
            if( data.toPage[0].id!='main'){
                $('.pages-menu').removeClass('hide-pages-menu')
                $('.pages-menu').addClass('show-pages-menu')
                gApp.setActiveIconOnMenu(data.toPage[0].id)
            }
            gApp.attachFastClick();
        });
    },
    attachFastClick: function(){
        $.each(document.getElementsByClassName('need-fastclick'), function(i,el){
            FastClick.attach(el);
        })
    },
    getMarkerOption: function(obj){
        var activeIcon = gApp.activeIconForMap();
        var disactiveIcon = gApp.disactiveIconForMap();
        return {icon: obj.is_completed ? disactiveIcon : activeIcon}
    },
    getMarkerPopupContent: function(obj){
        return ('<a href="object_detail.html?id='+obj.id+'">'+obj.name+'</a>')
    },
    activeIconForMap: function(){
        return L.icon({
            iconUrl: 'img/marker_active.png',
            iconRetinaUrl: 'img/marker_active@2x.png',
            shadowUrl: 'img/marker_shadow.png',

            iconSize:     [46, 74], // size of the icon
            shadowSize:   [72, 61], // size of the shadow
            iconAnchor:   [23, 74], // point of the icon which will correspond to marker's location
            shadowAnchor: [1, 61],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
    },
    disactiveIconForMap: function(){
        return L.icon({
            iconUrl: 'img/marker_disactive.png',
            iconRetinaUrl: 'img/marker_disactive@2x.png',
            shadowUrl: 'img/marker_shadow.png',

            iconSize:     [46, 74], // size of the icon
            shadowSize:   [72, 61], // size of the shadow
            iconAnchor:   [22, 74], // point of the icon which will correspond to marker's location
            shadowAnchor: [1, 61],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
    },
    setActiveIconOnMenu:function(new_page){
        if(gApp.pages_links[new_page]) {
            $('.pages-menu a').removeClass('active');
            $('.pages-menu a.' + gApp.pages_links[new_page]).addClass('active')
        }
    }

}

