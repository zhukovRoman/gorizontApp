var gorizontApp = {
    options: {
      animationDuration: 300
    },
    initialize: function(){
        gorizontApp.bindPageEvents();
    },
    bindPageEvents: function(){
        $( document ).on( "pagebeforehide","#main", function( event ) {
            $('#main_menu').animate({
                left: '-450px'
            }, {
                duration: gorizontApp.options.animationDuration, queue: false
            })
            $('.content').animate({
                'margin-left': '0px',
                width: '2048px'
            }, {
                duration: gorizontApp.animationDuration, queue: false
            })
        })
        $( document ).on( "pageshow","#main", function( event ) {
            $('#main_menu').animate({
                left: '0px'
            }, {
                duration: gorizontApp.options.animationDuration, queue: false
            })
            $('.content').animate({
                'margin-left': '450px',
                width: '1598px'
            }, {
                duration: gorizontApp.options.animationDuration, queue: false
            })
        })
        $(document).on( "pageshow",'#objects', gorizontApp.objects.onShowActions)
        $(document).on('pagebeforehide', gorizontApp.hideMenu);
        $(document).on('pageshow', '#object_view', function(event, data){
            gorizontApp.objects.initObjectDetail($(this).data('url'));
        })
        $(document).on('pageshow', function(e, data){
            if( data.toPage[0].id!='main'){
                $('#menu-button').click(gorizontApp.toggleMenu)
                $( ".content" ).on( "swiperight", gorizontApp.showMenu)
                $( ".content" ).on( "swipeleft", gorizontApp.hideMenu)
            }

        });


    },
    toggleMenu: function(){
        if ($('#new_menu').css('left') == '0px')
            gorizontApp.hideMenu()
        else
            gorizontApp.showMenu()
    },
    showMenu: function(e){
        console.log('swipe')

            $('#new_menu').animate({
                left: 0
            }, {
                duration: gorizontApp.options.animationDuration, queue: false
            })
            $('.content').animate({
                'margin-left': '478px'
            }, {
                duration: gorizontApp.options.animationDuration, queue: false
            })

    },
    hideMenu: function(){
        $('#new_menu').animate({
            left: '-478px'
        }, {
            duration: gorizontApp.options.animationDuration, queue: false
        })
        $('.content').animate({
            'margin-left': '0px'
        }, {
            duration: gorizontApp.options.animationDuration, queue: false
        })
    }

}

