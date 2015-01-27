gApp.object_view = {
    current_id: null,
    current_object: null,
    initObjectDetail: function(url){
        var id = url.split("?")[1].replace("id=","");
        this.current_id = parseInt(id);
        this.current_id = 1;
        $.each(objects, function(i,val){
            if(val.id==gApp.object_view.current_id)
                gApp.object_view.current_object = val;
        })

        $('#object_view .left-content [name=object-view-tab]').on('change', gApp.object_view.changeObjectViewTab)
        gApp.object_view.fillObjectInfo()
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
    fillInfoTab: function(){
        //show map
        //$('#object_view .right-content').show();
        //$('#object_view .left-content').css('width',"1448px")
        //
        //$('#object_view .budget-content').show();
        //gApp.object_view.fillObjectInfo()
        //gApp.object_view.initMap()
        //gApp.object_view.drawConsumptionChart();
        //gApp.object_view.drawBudgetChart();
    },
    fillBudgetTab: function(){
        $('#object_view .budget-content').show();
        drawMaterialBudgetChart();
        drawFinanceBudgetChart();
        drawMaterialFinanceChart();

        function calcAngile (full, part){
          return (360)*(part/full)
        };
        function drawMaterialBudgetChart (){
            var chart = new Highcharts.Chart({
                chart: {
                    type: 'pie',
                    renderTo:'material_budget_chart',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Материалы'
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ['50%', '35%'],
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
                    verticalAlign: 'top',
                    floating: true,
                    x: 150,
                    y: 670,
                    useHTML: true,
                    itemMarginBottom: 20,
                    //itemStyle: { "color": "#8d9296", "fontSize": "18pt", "fontWeight": "normal", "white-space": "normal" },
                    labelFormatter: function () {
                        return '<div style="width: 650px; padding-top: 5px">' +
                            '<div class = "legend-series-name" style="float: left; width: 400px; white-space: normal">'+this.name+'</div>' +
                            '<div style="text-align: right; float: right; width: 250px;"> '+ (this.y) +' унивресальные шт</div></div>';
                    }
                },
                series: [{
                    name: 'Бюджет',
                    data: [{
                        name: 'Принято материалов',
                        y: 22
                    },{
                        name: 'Осталось закупить',
                        y:44
                    }],
                    size: 450,
                    innerSize: 300
                }, {
                    name: 'Списано',
                    data: [{
                        name: 'Списано материалов',
                        y: 22,
                        color: '#C31A1A'
                    },],
                    //color: 'red',
                    size: 550,
                    innerSize: 450,
                    startAngle: 0,
                    endAngle: calcAngile(22+44, 22)
                }]
            })
        };
        function drawFinanceBudgetChart(){
            var chart = new Highcharts.Chart({
                chart: {
                    type: 'pie',
                    renderTo:'finance_budget_chart',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Финансы'
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ['50%', '35%'],
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
                    verticalAlign: 'top',
                    floating: true,
                    x: 150,
                    y: 670,
                    useHTML: true,
                    itemMarginBottom: 20,
                    //itemStyle: { "color": "#8d9296", "fontSize": "18pt", "fontWeight": "normal", "white-space": "normal" },
                    labelFormatter: function () {
                        return '<div style="width: 650px; padding-top: 5px">' +
                            '<div class = "legend-series-name" style="float: left; width: 400px; white-space: normal">'+this.name+'</div>' +
                            '<div style="text-align: right; float: right; width: 250px;"> '+ mln_to_text(this.y) +'</div></div>';
                    }
                },
                series: [{
                    name: 'Бюджет',
                    data: [{
                        name: 'Принято на сумму',
                        y: 22000000
                    },{
                        name: 'Остаток бюджета',
                        y:40000000
                    }],
                    size: 450,
                    innerSize: 300
                }, {
                    name: 'Списано',
                    data: [{
                        name: 'Списано на сумму',
                        y: 22000000,
                        color: '#C31A1A'
                    },],
                    //color: 'red',
                    size: 550,
                    innerSize: 450,
                    startAngle: 0,
                    endAngle: 150
                }]
            })
        };
        function drawMaterialFinanceChart(){
            var chart = new Highcharts.Chart({
                chart: {
                    type: 'bar',
                    renderTo:'material_finance_chart'
                },
                title: {
                    text: 'Расход бюджета'
                },
                xAxis: {
                    categories: [''],
                        title: {
                        text: null
                    },
                    lineColor: '#414141',
                    lineWidth: 2
                },
                yAxis: {
                    min: 0,
                        title: {
                        text: ''
                    },
                    labels: {
                        overflow: 'justify',
                        formatter: function() {return this.value/1000000}
                    },
                    lineColor: '#414141',
                    lineWidth: 2
                },
                tooltip: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                            pointWidth: 70,
                            pointPadding: 0.1,
                            groupPadding: 0.1
                        }

                },
                legend: {
                    useHTML: true,
                    itemMarginBottom: 0,
                    //itemStyle: { "color": "#8d9296", "fontSize": "18pt", "fontWeight": "normal", "white-space": "normal" },
                    labelFormatter: function () {
                        console.log(this.yData)
                        //
                        return '<div style="display: inline-block; padding-top: 5px; margin-right: 20px">' +
                            '<div class = "legend-series-name" style="display: inline-block; white-space: nowrap">'+this.name+'</div>' +
                            '<div style="text-align: right; padding-left: 30px; display: inline-block"> '+ mln_to_text(this.yData[0]) +'</div></div>';
                    }
                },
                credits: {
                    enabled: false
                },
                series: [
                    {
                        name: 'Потратили',
                        data: [133000000]
                    },{
                    name: 'Планировали потратить',
                    data: [107000000]
                }]
            }
            )
        }

    },

    fillObjectInfo: function(){
        $.each($('#object_view [data-value-name]'), function(i, element){
            console.log(gApp.object_view.current_object[$(element).attr('data-value-name')])
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
            //id: 'zhuk99.kpafdddm'
            id: 'examples.map-i86l3621'
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
        gApp.object_view.fillConsumptionMonthSelect();

        $('#consumption_current_year').on('change', gApp.object_view.redrawConsumtionsCharts)
        $('#prev_year_button').click(gApp.object_view.selectPrevYear)
        $('#next_year_button').click(gApp.object_view.selectNextYear)

        $('#consumption_current_month').on('change', gApp.object_view.drawConsumtionMonthChart)
        $('#prev_month_button').click(gApp.object_view.selectPrevMonth)
        $('#next_month_button').click(gApp.object_view.selectNextMonth)

        gApp.object_view.drawConsumtionYearChart();
        gApp.object_view.drawConsumtionMonthChart();
    },
    fillConsumtionYearSelect: function(){
        var select = $('#consumption_current_year');
        select.html('')
        $.each(gApp.object_view.current_object.consumption_data, function(year, data){
            select.append($('<option>', {value:year, text:year}));
        })
        select.val($('#consumption_current_year option').last().attr('value'));
        select.selectmenu( "refresh" );
    },
    fillConsumptionMonthSelect: function(){
        var select = $('#consumption_current_month');
        select.html('')
        var currentYear = gApp.object_view.getCurrentConsumtionYear();
        $.each(gApp.object_view.current_object.consumption_data[currentYear].month_data, function(year, data){
            select.append($('<option>', {value:year, text:year}));
        })
        select.val($('#consumption_current_month option').last().attr('value'));
        select.selectmenu( "refresh" );
    },
    redrawConsumtionsCharts: function(){
        gApp.object_view.drawConsumtionYearChart();
        gApp.object_view.fillConsumptionMonthSelect();
        gApp.object_view.drawConsumtionMonthChart();
    },
    getCurrentConsumtionYear: function(){
        return $('#consumption_current_year').val()
    },
    getCurrentConsumtionMonth: function(){
        return $('#consumption_current_month').val()
    },
    selectNextYear: function(){
        var selected = $('#consumption_current_year option:selected').next();
        selected = (selected.length==0) ? $('#consumption_current_year option').first() : selected
        //selected.attr('selected', 'selected');
        $('#consumption_current_year option:selected').prop('selected', false)
        selected.prop('selected', true);
        $('#consumption_current_year').selectmenu( "refresh" );
        gApp.object_view.redrawConsumtionsCharts();
    },
    selectPrevYear: function(){
        var selected = $('#consumption_current_year option:selected').prev();
        selected = (selected.length==0) ? $('#consumption_current_year option').last() : selected
        //selected.attr('selected', 'selected');
        $('#consumption_current_year option:selected').prop('selected', false)
        //$('#consumption_current_year').val(selected.attr('value'))
        selected.prop('selected', true);
        $('#consumption_current_year').selectmenu( "refresh" );
        gApp.object_view.redrawConsumtionsCharts();
    },

    selectNextMonth: function(){
        var selected = $('#consumption_current_month option:selected').next();
        selected = (selected.length==0) ? $('#consumption_current_month option').first() : selected
        $('#consumption_current_month option:selected').prop('selected', false)
        selected.prop('selected', true);
        $('#consumption_current_month').selectmenu( "refresh" );
        gApp.object_view.drawConsumtionMonthChart();
    },
    selectPrevMonth: function(){
        var selected = $('#consumption_current_month option:selected').prev();
        selected = (selected.length==0) ? $('#consumption_current_month option').last() : selected
        $('#consumption_current_month option:selected').prop('selected', false)
        selected.prop('selected', true);
        $('#consumption_current_month').selectmenu( "refresh" );
        gApp.object_view.drawConsumtionMonthChart()
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
                text: 'Расход бюджета на материалы ПО МЕСЯЦАМ ЗА '+gApp.object_view.getCurrentConsumtionYear()+' ГОД'
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
        var selectedMonth = gApp.object_view.getCurrentConsumtionMonth();
        var selectedYear = gApp.object_view.getCurrentConsumtionYear();
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
                data: gApp.object_view.current_object.consumption_data[selectedYear].month_data[selectedMonth]

            }]
        });
    }
}