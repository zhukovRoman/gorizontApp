var gApp = {
    options: {
      animationDuration: 300
    },
    initialize: function(){
        gApp.bindPageEvents();
        gApp.dataSaver.initDB();

    },
    bindPageEvents: function(){
        function fillCommonInfo(){
            var data = {count:0, budget_spent:0, budget:0}
            $.each(objects, function(i, obj){
                if(obj.is_completed) return;
                data.count++;
                data.budget+=obj.budget||0;
                data.budget_spent+=obj.budget_spent||0;
            })
            $('#objects_count').text(data.count);
            $('#all_objects_budget_spent').text(mln_to_text(data.budget_spent))
            $('#all_objects_budget').text(mln_to_text(data.budget))
        }
        fillCommonInfo();
        $(document).on('databaseready', gApp.httpApi.updateData)
        $( document ).on( "pagebeforehide","#main", function( event ) {
            $('.main-menu').removeClass('show-main-menu');
            $('.main-menu').addClass('hide-main-menu')
        })
        $(document).on( "pageshow","#main", function( event ) {
            fillCommonInfo();
            $('.main-menu').removeClass('hide-main-menu');
            $('.main-menu').addClass('show-main-menu');
        })

        $( document ).on( "pagebeforehide", function( event,data ) {
            if (data.nextPage[0].id=='main')
                $('.pages-menu').removeClass('show-pages-menu')
                $('.pages-menu').addClass('hide-pages-menu');

        })
        $(document).on( "pageshow",'#objects', gApp.objects.onShowActions)
        $(document).on( "pagebeforeshow",'#objects', function(){
            $(".pages-menu a").removeClass('active')
            $(".pages-menu a.objects-menu-item").addClass('active')
        })

        $(document).on( "pagebeforeshow",'#material', function(){
            $(".pages-menu a").removeClass('active')
            $(".pages-menu a.material-menu-item").addClass('active')
        })

        $(document).on( "pagebeforeshow",'#employee', function(){
            $(".pages-menu a").removeClass('active')
            $(".pages-menu a.empl-menu-item").addClass('active')
        })

        $(document).on( "pagebeforeshow",'#tech', function(){
            $(".pages-menu a").removeClass('active')
            $(".pages-menu a.tech-menu-item").addClass('active')
        })

        $(document).on( "pagebeforeshow",'#avto', function(){
            $(".pages-menu a").removeClass('active')
            $(".pages-menu a.avto-menu-item").addClass('active')
        })

        $(document).on('pageshow', '#object_view', function(event, data){
            gApp.object_view.initObjectDetail($(this).data('url'));
        })
        gApp.addCommonEvents();
    },
    addCommonEvents: function(){
        $(document).on('pageshow', function(e, data){
            if( data.toPage[0].id!='main'){
                $('.pages-menu').removeClass('hide-pages-menu')
                $('.pages-menu').addClass('show-pages-menu')
            }
            gApp.attachFastClick();
        });
    },
    attachFastClick: function(){
        $.each(document.getElementsByClassName('need-fastclick'), function(i,el){
            FastClick.attach(el);
        })
    },
    //toggleMenu: function(){
    //    if ($('#new_menu').hasClass('show-new-menu'))
    //        gApp.hideMenu()
    //    else
    //        gApp.showMenu()
    //},
    //showMenu: function(e){
    //    $('#new_menu').addClass('show-new-menu')
    //    $('.content').addClass('move-content-right')
    //    $('#new_menu').removeClass('hide-new-menu')
    //    $('.content').removeClass('move-content-left')
    //
    //},
    //hideMenu: function(){
    //    if ($('#new_menu').hasClass('show-new-menu')) {
    //        $('#new_menu').addClass('hide-new-menu')
    //        $('.content').addClass('move-content-left')
    //        $('#new_menu').removeClass('show-new-menu')
    //        $('.content').removeClass('move-content-right')
    //    }
    //},
    //hideMenuByClickOnContent: function(){
    //    if ($('#new_menu').hasClass('show-new-menu'))
    //        gApp.hideMenu();
    //},
    getMarkerOption: function(obj){
        var activeIcon = gApp.activeIconForMap();
        var disactiveIcon = gApp.disactiveIconForMap();
        return {icon: obj.is_complete ? disactiveIcon : activeIcon}
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
    setActiveIconOnMenu:function(newActivePage){
        $('#new_menu a').removeClass('active');
        $('#new_menu a.'+newActivePage+'-menu-item').addClass('active')
    }

}

