function thousands_sep (value)
{
    return (value||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function mln_to_text (value){
    return  thousands_sep(((parseFloat(value)||0)/1000000).toFixed(3)) + ' млн ₽'
}

$(function(){
    $.mobile.defaultPageTransition = 'fade'
    $.mobile.page.prototype.options.domCache = false;
    moment.locale('ru');
});
