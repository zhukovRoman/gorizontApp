var gApp = {
    options: {
      animationDuration: 300
    },
    initialize: function(){
        gApp.bindPageEvents();
    },
    bindPageEvents: function(){
        $(document).on('pagebeforehide', gApp.hideMenu);
        $( document ).on( "pagebeforehide","#main", function( event ) {
            $('#main_menu').animate({
                left: '-450px'
            }, {
                duration: gApp.options.animationDuration, queue: false
            })

            $('.content').animate({
                'margin-left': '0px',
                width: '2048px'
            }, {
                duration: gApp.animationDuration, queue: false
            })
        })
        $( document ).on( "pageshow","#main", function( event ) {
            $('#main_menu').animate({
                left: '0px'
            }, {
                duration: gApp.options.animationDuration, queue: false
            })
            $('.content').removeClass('move-content-left')
            $('.content').removeClass('move-content-right')
            $('.content').animate({
                'margin-left': '450px',
                width: '1598px'
            }, {
                duration: gApp.options.animationDuration, queue: false
            })
        })
        $(document).on( "pageshow",'#objects', gApp.objects.onShowActions)

        $(document).on('pageshow', '#object_view', function(event, data){
            gApp.object_view.initObjectDetail($(this).data('url'));
        })
        gApp.addCommonEvents();
    },
    addCommonEvents: function(){
        $(document).on('pageshow', function(e, data){
            if( data.toPage[0].id!='main'){
                $('#menu-button').click(gApp.toggleMenu)
                $( ".content" ).on( "swiperight", gApp.showMenu)
                $( ".content" ).on( "swipeleft", gApp.hideMenu)
                $( ".need-hide-menu" ).on( "mousedown", gApp.hideMenuByClickOnContent)
            }
            gApp.attachFastClick();
        });
    },
    attachFastClick: function(){
        $.each(document.getElementsByClassName('need-fastclick'), function(i,el){
            FastClick.attach(el);
        })
    },
    toggleMenu: function(){
        if ($('#new_menu').hasClass('show-new-menu'))
            gApp.hideMenu()
        else
            gApp.showMenu()
    },
    showMenu: function(e){
        $('#new_menu').addClass('show-new-menu')
        $('.content').addClass('move-content-right')
        $('#new_menu').removeClass('hide-new-menu')
        $('.content').removeClass('move-content-left')

    },
    hideMenu: function(){
        if ($('#new_menu').hasClass('show-new-menu')) {
            $('#new_menu').addClass('hide-new-menu')
            $('.content').addClass('move-content-left')
            $('#new_menu').removeClass('show-new-menu')
            $('.content').removeClass('move-content-right')
        }
    },
    hideMenuByClickOnContent: function(){
        if ($('#new_menu').hasClass('show-new-menu'))
            gApp.hideMenu();
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

