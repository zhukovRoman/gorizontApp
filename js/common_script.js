function thousands_sep (value)
{
    return (value||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function mln_to_text (value){
    return  thousands_sep(((parseFloat(value)||0)/1000000).toFixed(3)) + ' млн ₽'
}

function ths_to_text (value){
    return  thousands_sep(((parseFloat(value)||0)/1000).toFixed(3)) + ' тыс ₽'
}

$(function(){
    $.mobile.defaultPageTransition = 'fade'
    $.mobile.page.prototype.options.domCache = false;
    moment.locale('ru');
});

/**
 * Возвращает текстовое представление разницы между датами
 * требует moment.js
 * @param {moment} dateFrom      от даты
 * @param {moment} dateTo    до даты
 * @return {String}  текстовое представление разницы '10 лет 4 месяца 4 дня'
 */
function text_between_dates (dateFrom, dateTo){
    var string = ''
    var yearsDiff = dateTo.diff(dateFrom, 'years')
    if (yearsDiff != 0){
        string += yearsDiff + format_num(yearsDiff, {nom: ' год ', gen: ' года ', plu: ' лет '})
        dateFrom = dateFrom.add(yearsDiff, 'years')
    }
    var monthDiff = dateTo.diff(dateFrom, 'month')
    if (monthDiff != 0){
        string += monthDiff + format_num(monthDiff, {nom: ' месяц ', gen: ' месяца ', plu: ' месяцев '})
        dateFrom = dateFrom.add(monthDiff, 'month')
    }
    console.log(dateFrom)
    var daysDiff = dateTo.diff(dateFrom, 'day') +1
    if (daysDiff != 0){
        string += daysDiff + format_num(daysDiff, {nom: ' день ', gen: ' дня ', plu: ' дней '})
    }
    return string;

}

/**
 * Возвращает единицу измерения с правильным окончанием
 *
 * @param {Number} num      Число
 * @param {Object} cases    Варианты слова {nom: 'час', gen: 'часа', plu: 'часов'}
 * @return {String}
 */
function format_num (num, cases) {
    num = Math.abs(num);

    var word = '';

    if (num.toString().indexOf('.') > -1) {
        word = cases.gen;
    } else {
        word = (
            num % 10 == 1 && num % 100 != 11
                ? cases.nom
                : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
                ? cases.gen
                : cases.plu
        );
    }

    return word;
}

/**
 * Возвращает header для тултипа
 *
 * @param {String} text     Текст для заголовка
 * @return {String} html строка
 */
function tooltipHeader (text) {
    return "<div class='tooltip-header'>"+text+"</div>"
}

/**
 * Возвращает строку для тултипа
 *
 * @param {String} name     Название
 * @param {Number} value    Значение
 * @param {String} color     Цвет серии
 * @return {String} html строка
 */
function tooltipRow (name, value, color, formatFunction) {
    if (!formatFunction) formatFunction =  mln_to_text;
    return  "<div class='tooltip-row'>"
            +"<span class='tooltip-point' style='background-color: "
            + color+"'></span>"+ name + ": " + formatFunction(value)
            + "</div>"
}

///// METRICA
//(function (d, w, c) {
//    (w[c] = w[c] || []).push(function() {
//        try {
//            w.yaCounter28156962 = new Ya.Metrika({id:28156962,
//                webvisor:true,
//                clickmap:true,
//                trackLinks:true,
//                trackHash:true,
//                ut:"noindex"});
//        } catch(e) { }
//    });
//
//    var n = d.getElementsByTagName("script")[0],
//        s = d.createElement("script"),
//        f = function () { n.parentNode.insertBefore(s, n); };
//    s.type = "text/javascript";
//    s.async = true;
//    s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";
//
//    if (w.opera == "[object Opera]") {
//        d.addEventListener("DOMContentLoaded", f, false);
//    } else { f(); }
//})(document, window, "yandex_metrika_callbacks");