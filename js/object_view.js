gApp.object_view = {
    current_id: null,
    current_object: null,
    initObjectDetail: function(url){
        var id = url.split("?")[1].replace("id=","");
        this.current_id = parseInt(id);
        $.each(objects, function(i,val){
            if(val.id==gApp.object_view.current_id)
                gApp.object_view.current_object = val;
        })

        $('#object_view .left-content [name=object-view-tab]').on('change', gApp.object_view.changeObjectViewTab)
        gApp.object_view.changeObjectViewTab();

    },
    changeObjectViewTab: function(){
        $('#object_view .tab-content').hide();
        var current_tab=$('#object_view .left-content [name=object-view-tab]:checked').attr('id')
        if (current_tab=='budget')
            gApp.object_view.fillBudgetTab();
        if (current_tab=='consumption')
            gApp.object_view.fillConsumptionTab();
        if (current_tab=='material')
            gApp.object_view.fillBudgetTab();
    },
    fillBudgetTab: function(){
        //show map
        $('#object_view .right-content').show();
        $('#object_view .left-content').css('width',"1448px")

        $('#object_view .budget-content').show();
        gApp.object_view.fillObjectInfo()
        gApp.object_view.initMap()
        gApp.object_view.drawConsumptionChart();
        gApp.object_view.drawBudgetChart();
    },

    fillObjectInfo: function(){
        $.each($('#object_view [data-value-name]'), function(i, element){
            $(element).text(gApp.object_view.current_object[$(element).attr('data-value-name')])
        })
    },
    initMap: function(){
        var obj =  gApp.object_view.current_object
        var map = L.map('object_map', {
            zoomControl: false,
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false
        }).setView(obj.latlng, 15);
        L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '',
            //id: 'examples.map-20v6611k'
            id: 'zhuk99.kpafdddm'
        }).addTo(map);
        L.marker(obj.latlng).addTo(map)


    } ,
    drawConsumptionChart: function(){
        var chart = new Highcharts.Chart({
            chart: {
                renderTo:'consumption_chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Расход материалов на объекте',
                style: {
                    "fontSize": "32px"
                }
            },
            plotOptions: {
                pie: {
                    center: ['25%', '50%'],
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            tooltip: {
                enabled: false
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'center',
                floating: true,
                x: 700,
                y: 300,
                useHTML: true,
                itemMarginBottom: 45,
                //itemStyle: { "color": "#8d9296", "fontSize": "18pt", "fontWeight": "normal", "white-space": "normal" },
                labelFormatter: function () {
                    return '<div style="width: 650px; padding-top: 5px">' +
                        '<div class = "legend-series-name" style="float: left; width: 400px; white-space: normal">'+this.name+'</div>' +
                        '<div style="text-align: right; float: right; width: 250px;"> '+ mln_to_text(this.y) +'</div></div>';
                }
            },
            series: [{
                type: 'pie',
                name: 'Сумма',
                innerSize: '45%',
                size: 550,
                data: [
                    ['Израсходовано материалов на сумму', gApp.object_view.current_object.material_spent],
                    ['Осталось материалов на сумму', gApp.object_view.current_object.material_left]
                ]
            }]
        });
    },
    drawBudgetChart: function(){
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'budget_chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'bar',
                marginTop: -50
            },
            title: {
                text: 'Освоение бюджета в '+new Date().getFullYear()+' году',
                margin:20,
                floating: true,
                y: 20
            },
            xAxis: {
                lineWidth: 0,
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title:{
                    text: null
                },
                gridLineWidth: 0,
                labels: {
                    enabled: false
                }
            },
            tooltip: {
                enabled: false

            },
            legend:{
                reversed: true,
                align: 'center',
                useHTML: true,
                floating: true,
                layout: 'horizontal',
                itemStyle: { "color": "#91a0ab",
                    "fontSize": "26px",
                    "white-space": "normal",
                    "padding-top": '5px'
                    //font: '18pt Helvetica, Arial, sans-serif'
                },
                labelFormatter: function () {
                    //console.log(this)
                    return '<div class = "legend-series-name" style="float: left; width: 600px; white-space: normal; ">'+this.name +
                        ' <span id="work-chart-values'+this._i+'"> '+ mln_to_text((this.userOptions.data[0])) +'</span> </div>';
                }
            },
            plotOptions: {
                series: {
                    stacking: 'percent',
                    pointWidth: 50
                }
            },
            series: [{
                name: 'Закуплено материалов на сумму',
                data: [gApp.object_view.current_object.current_year_budget_spent]
            }, {
                name: 'Остаток бюджета',
                data: [gApp.object_view.current_object.current_year_budget-
                gApp.object_view.current_object.current_year_budget_spent]
            }]
        });

    },

    //Consumption tab
    fillConsumptionTab: function() {
        $('#object_view .consumption-content').show();
        $('#object_view .right-content').hide();
        $('#object_view .left-content').css('width',"100%")


        gApp.object_view.fillConsumtionYearSelect();

        $('#consumption_current_year').on('change', gApp.object_view.redrawConsumtionCharts)
        $('#prev_year_button').click(gApp.object_view.selectPrevYear)
        $('#next_year_button').click(gApp.object_view.selectNextYear)

        gApp.object_view.drawConsumtionYearChart();
        gApp.object_view.drawConsumtionMonthChart();
    },
    fillConsumtionYearSelect: function(){
        var select = $('#consumption_current_year');
        $.each(gApp.object_view.current_object.consumption_data, function(year, data){
            select.append($('<option>', {value:year, text:year}));
        })
        select.val($('#consumption_current_year option').last().attr('value'));
        select.selectmenu( "refresh" );
    },
    redrawConsumtionCharts: function(){
        gApp.object_view.drawConsumtionYearChart();
        gApp.object_view.drawConsumtionMonthChart();
    },
    getCurrentConsumtionYear: function(){
        return $('#consumption_current_year').val()
    },
    selectNextYear: function(){
        var selected = $('#consumption_current_year option:selected').next();
        selected = (selected.length==0) ? $('#consumption_current_year option').first() : selected
        selected.attr('selected', 'selected');
        //$('#consumption_current_year').val(selected.attr('value'))
        selected.prop('selected', true);
        $('#consumption_current_year').selectmenu( "refresh" );
        gApp.object_view.redrawConsumtionCharts();
    },
    selectPrevYear: function(){
        var selected = $('#consumption_current_year option:selected').prev();
        selected = (selected.length==0) ? $('#consumption_current_year option').last() : selected
        selected.attr('selected', 'selected');
        //$('#consumption_current_year').val(selected.attr('value'))
        selected.prop('selected', true);
        $('#consumption_current_year').selectmenu( "refresh" );
        gApp.object_view.redrawConsumtionCharts();
    },
    drawConsumtionYearChart: function(){
        var selected_year=gApp.object_view.getCurrentConsumtionYear();
        var chart = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'year_consumption_chart',
                backgroundColor: 'rgba(255,255,255, 0)'
            },
            title: {
                text: 'Расход бюджета на материалы ПО МЕСЯЦАМ ЗА 2015 ГОД'
            },
            xAxis: {
                categories: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Рубли, млн'
                }
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    //pointPadding: 0.2,
                    //    borderWidth: 0
                }
            },
            series: [{
                name: 'завезено материалов на сумму',
                data: gApp.object_view.current_object.consumption_data[selected_year].year_data.material_bought

            }, {
                name: 'Потрачено материалов на сумму',
                data: gApp.object_view.current_object.consumption_data[selected_year].year_data.material_spent

            }]
        });
    },
    drawConsumtionMonthChart: function(){
        var chart = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'month_consumption_chart',
                backgroundColor: 'rgba(255,255,255, 0)'
            },
            title: {
                text: 'ИЗРАСХОДОВАННО МАТЕРИАЛОВ НА СУММУ'
            },
            xAxis: {
                categories: function () { var res = []; for (var t = 1; t<32; t++) {res.push(t)} return res}
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Рубли, млн'
                }
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    //pointPadding: 0.2,
                    //    borderWidth: 0
                }
            },
            legend:{
                enabled: false
            },

            series: [{
                name: 'завезено материалов на сумму',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

            }]
        });
    }
}