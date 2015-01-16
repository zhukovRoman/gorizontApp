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
        $(document).on( "pageshow",'#objects', function( event ) {
            $('#type-filter').touchFilter({
                name: "Объект",
                items: [['roads','Дороги'],['junction','Переход'],['bridges','Мосты']]
            })

            $('#type-filter').on('tf.change', function(){console.log($('#type-filter').touchFilter('getValues'))})


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
        })
    },
    toggleMenu: function(){
        if ($('#new_menu').css('left') == '0px')
            gorizontApp.hideMenu()
        else
            gorizontApp.showMenu()
    },
    showMenu: function(){
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
    },
    filterObjects: function(){

        console.log($(this).val())
    }

}

