var gApp = {
    options: {
      animationDuration: 300
    },
    initialize: function(){
        gApp.bindPageEvents();
    },
    bindPageEvents: function(){
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
            $('.content').animate({
                'margin-left': '450px',
                width: '1598px'
            }, {
                duration: gApp.options.animationDuration, queue: false
            })
        })
        $(document).on( "pageshow",'#objects', gApp.objects.onShowActions)
        $(document).on('pagebeforehide', gApp.hideMenu);
        $(document).on('pageshow', '#object_view', function(event, data){
            gApp.object_view.initObjectDetail($(this).data('url'));
        })
        $(document).on('pageshow', function(e, data){
            if( data.toPage[0].id!='main'){
                $('#menu-button').click(gApp.toggleMenu)
                $( ".content" ).on( "swiperight", gApp.showMenu)
                $( ".content" ).on( "swipeleft", gApp.hideMenu)
            }

        });


    },
    toggleMenu: function(){
        if ($('#new_menu').css('left') == '0px')
            gApp.hideMenu()
        else
            gApp.showMenu()
    },
    showMenu: function(e){
        console.log('swipe')

            $('#new_menu').animate({
                left: 0
            }, {
                duration: gApp.options.animationDuration, queue: false
            })
            $('.content').animate({
                'margin-left': '478px'
            }, {
                duration: gApp.options.animationDuration, queue: false
            })

    },
    hideMenu: function(){
        $('#new_menu').animate({
            left: '-478px'
        }, {
            duration: gApp.options.animationDuration, queue: false
        })
        $('.content').animate({
            'margin-left': '0px'
        }, {
            duration: gApp.options.animationDuration, queue: false
        })
    }

}

