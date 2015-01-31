gApp.object_view = {
    current_id: null,
    current_object: null,
    dateStart: null,
    dateEnd:null,
    filtered_by_dates_materials: null,
    initObjectDetail: function(url){
        var id = url.split("?")[1].replace("id=","");
        this.current_id = parseInt(id);
        this.current_id = 1;
        $.each(objects, function(i,val){
            if(val.id==gApp.object_view.current_id)
                gApp.object_view.current_object = val;
        })

        gApp.object_view.fillObjectInfo()
        gApp.object_view.changeObjectViewTab();

        $('#object_view .left-content [name=object-view-tab]').on('change', gApp.object_view.changeObjectViewTab)
        $('#date_start').on('change', function(e){
            gApp.object_view.dateStart = moment($(this).val())
            gApp.object_view.getDataByDates();
            gApp.object_view.refillTable();
        })
        $('#date_end').on('change', function(e){
            gApp.object_view.dateEnd = moment($(this).val())
            gApp.object_view.getDataByDates();
            gApp.object_view.refillTable();
        })
        $('#materials_search_input').on('keyup', function(){
            gApp.object_view.refillTable();
        })

    },
    changeObjectViewTab: function(){
        $('#object_view .tab-content').hide();
        var current_tab=$('#object_view .left-content [name=object-view-tab]:checked').attr('id')
        if (current_tab=='info')
            gApp.object_view.fillInfoTab();
        if (current_tab=='budget')
            gApp.object_view.fillBudgetTab();
        if (current_tab=='consumption')
            gApp.object_view.fillConsumptionTab();
        if (current_tab=='material')
            gApp.object_view.fillMaterialTab();
    },
    fillMaterialTab: function(){
        $('#object_view .material-content').show();
        gApp.object_view.setDates();
        gApp.object_view.getDataByDates();
        gApp.object_view.refillTable();
    },
    getDataByDates: function(){
        gApp.object_view.filtered_by_dates_materials = gApp.object_view.materialDataProvider()
    },
    setDates: function(){
        console.log(gApp.object_view.dateStart, gApp.object_view.dateEnd)
        if(!gApp.object_view.dateStart)
            gApp.object_view.dateStart = moment().subtract(1, 'week')
        if(!gApp.object_view.dateEnd)
            gApp.object_view.dateEnd = moment()
        $('#date_start').val(gApp.object_view.dateStart.format("YYYY-MM-DD"))
        $('#date_end').val(gApp.object_view.dateEnd.format("YYYY-MM-DD"))
    },
    refillTable: function(){
        var container = $('#materials_table_content').html('')
        $.each(gApp.object_view.filtered_by_dates_materials, function(notation,materials){
            if (!gApp.object_view.checkNotation(notation)) return;
            var table_row = $(document.createElement('div')).addClass('material-table-row')
            var notation =  $(document.createElement('div')).addClass('notation').text(notation)
            var mat_spends = $(document.createElement('div')).addClass('material-spends')
            $.each(materials, function(i, val){
                var mat_row = $(document.createElement('div')).addClass('material-row')
                mat_row.append($(document.createElement('span')).text(val.date))
                mat_row.append($(document.createElement('span')).text(val.count+' '+val.unit))
                mat_row.append($(document.createElement('span')).text(val.price.toFixed()+' ₽'))
                mat_row.append($(document.createElement('span')).text((val.price*val.count).toFixed()+' ₽'))
                mat_spends.append(mat_row)
            })
            table_row.append(notation).append(mat_spends)
            container.append(table_row)
        })
    },
    checkNotation: function(notation){

        var query = $('#materials_search_input').val().toLowerCase()
        if (query.length<2) return true;
        notation = notation.toLowerCase();
        if (notation.indexOf(query)>-1) return true;
        return false
    },
    materialDataProvider: function(obj_id){
        dateStart = gApp.object_view.dateStart
        dateEnd = gApp.object_view.dateEnd
        var data = {
            "Масло гидравлическое PETRO-CANADA HYDREX XV ALL SEASON 205л":
            [{date: '10.02.2015', count: 2, unit:'шт', price:1222.50 },
                {date: '12.01.2015', count: 2, unit:'шт', price:1222.50 }],
            "Седелка компрессионная с резьбовым отводом 110х1 1/4 мм":
                [{date: '15.01.2015', count: 2, unit:'шт', price:1222.50 },
                    {date: '22.01.2015', count: 2, unit:'шт', price:1222.50 }],
            "Бензомаслоотделитель 80л/с D=3200мм L=5300мм с колодцем":
                [{date: '25.01.2015', count: 2, unit:'шт', price:1222.50 },
                    {date: '22.01.2015', count: 2, unit:'шт', price:1222.50 }]
        }
        var res = {}
        $.each(data, function(not,mats){
            $.each(mats, function(i,item){
                var date =  moment(item.date, "DD-MM-YYYY")
                if (date.isBefore(dateStart) || date.isAfter(dateEnd)) return;
                if (!res[not]) res[not]=[]
                res[not].push(item)
            })
        })
        return res
    },
    fillInfoTab: function(){
        $('#object_view .info-content').show();
        initMap()
        function  initMap (){
            var obj =  gApp.object_view.current_object
            var map = L.map('object_map', {
                zoomControl: false,
                dragging: false,
                touchZoom: false,
                scrollWheelZoom: false,
                doubleClickZoom: false
            }).setView([obj.latlng[0]-0.01,obj.latlng[1]], 15);
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '',
                //id: 'examples.map-20v6611k'
                //id: 'zhuk99.kpafdddm'
                id: 'examples.map-i86l3621'
            }).addTo(map);
            L.marker(obj.latlng,gApp.getMarkerOption(obj)).addTo(map)
        }
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
                            '<div style="text-align: right; float: right; width: 250px;"> '+ (this.y) +' шт</div></div>';
                    }
                },
                series: [{
                    name: 'Бюджет',
                    data: [{
                        name: 'Принято материалов',
                        y: gApp.object_view.current_object.material_bought
                    },{
                        name: 'Осталось закупить',
                        y:gApp.object_view.current_object.material_all_count - gApp.object_view.current_object.material_bought
                    }],
                    size: 450,
                    innerSize: 300
                }, {
                    name: 'Списано',
                    data: [{
                        name: 'Списано материалов',
                        y: gApp.object_view.current_object.material_used,
                        color: '#C31A1A'
                    },],
                    //color: 'red',
                    size: 550,
                    innerSize: 450,
                    startAngle: 0,
                    endAngle: calcAngile(gApp.object_view.current_object.material_all_count, gApp.object_view.current_object.material_used)
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
                        y: gApp.object_view.current_object.budget_spent
                    },{
                        name: 'Остаток бюджета',
                        y:  gApp.object_view.current_object.budget - gApp.object_view.current_object.budget_spent
                    }],
                    size: 450,
                    innerSize: 300
                }, {
                    name: 'Списано',
                    data: [{
                        name: 'Списано на сумму',
                        y: gApp.object_view.current_object.budget_used,
                        color: '#C31A1A'
                    },],
                    //color: 'red',
                    size: 550,
                    innerSize: 450,
                    startAngle: 0,
                    endAngle: calcAngile(gApp.object_view.current_object.budget, gApp.object_view.current_object.budget_used)
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
                        data: [gApp.object_view.current_object.budget_spent]
                    },{
                    name: 'Планировали потратить',
                    data: [gApp.object_view.current_object.budget_current_plan]
                }]
            }
            )
        }

    },

    fillObjectInfo: function(){
        // fill budjet info
        $('#budget_info').text(mln_to_text(gApp.object_view.current_object.budget))
        $('#budget_spent').text(mln_to_text(gApp.object_view.current_object.budget_spent))

        var daysLastText = text_between_dates( moment(),
                                moment(gApp.object_view.current_object.plan_date_end, "DD.MM.YYYY"))
        $('#days_last').text("Осталось " + daysLastText)
        if (gApp.object_view.current_object.days_lag <=0){
            $('.days-left').width('100%');
            $('.object-lag').hide();
        }
        $('#days_lag').text(
            (gApp.object_view.current_object.days_lag <= 0 ) ? "" :
                "Отставание "
                + gApp.object_view.current_object.days_lag
                + format_num(gApp.object_view.current_object.days_lag, {nom: ' день', gen: ' дня', plu: ' дней'})
        )

        var daysBetweenStartAndEnd = moment(gApp.object_view.current_object.plan_date_end, "DD.MM.YYYY").diff(
            moment(gApp.object_view.current_object.date_start, "DD.MM.YYYY"), 'days')
        var daysBetweenCurrentAndEnd = moment(gApp.object_view.current_object.plan_date_end, "DD.MM.YYYY").diff(
            moment(), 'days')
        $('#complete_progres').css('width', (daysBetweenStartAndEnd-daysBetweenCurrentAndEnd)*100/daysBetweenStartAndEnd+'%')
        $('#not_complete_progres').css('width', (daysBetweenCurrentAndEnd)*100/daysBetweenStartAndEnd+'%')
        $.each($('#object_view [data-value-name]'), function(i, element){
            var value = '';
            if ($(element).attr('data-part'))
                value = (gApp.object_view.current_object[$(element).attr('data-part')][$(element).attr('data-value-name')])
            else
                value = (gApp.object_view.current_object[$(element).attr('data-value-name')])

            $(element).text(value)
        })
        $('#steps_count').text(gApp.object_view.current_object.plan.steps_count +
         format_num(gApp.object_view.current_object.plan.steps_count, {nom: ' этап', gen: ' этапа', plu: ' этапов'}))
        $('#steps_complete').text(gApp.object_view.current_object.plan.steps_complete +
        format_num(gApp.object_view.current_object.plan.steps_complete, {nom: ' этап', gen: ' этапа', plu: ' этапов'}))

    },

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

        $( "#prev_year_button, #next_year_button" ).unbind();

        $('#consumption_current_year').on('change', gApp.object_view.redrawConsumtionsCharts)
        $('#prev_year_button').click(gApp.object_view.selectPrevYear)
        $('#next_year_button').click(gApp.object_view.selectNextYear)


        $( "#prev_month_button, #next_month_button" ).unbind();

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
                categories: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                labels: {
                    style:{
                        border: '2px solid #e9e9e8',
                        borderRadius: '10px',
                        padding: '3px 7px'
                    },
                    useHTML: true
                },
                useHTML: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Рубли, млн'
                },
                labels:{
                    formatter: function() {return this.value/1000000}
                }
            },
            tooltip: {
                enabled: true,
                useHTML: true,
                shared: true,
                formatter: function(){
                    var tooltip = "<div class='gorizont-tooltip'>"
                    tooltip += tooltipHeader(this.x+ " " + selected_year)
                    $.each(this.points, function(i,point){
                        tooltip += tooltipRow(point.series.name, point.y,  point.series.color)
                    })
                    return tooltip;
                }
            },
            plotOptions: {
                column: {
                    //pointPadding: 0.2,
                    //    borderWidth: 0
                }
            },
            series: [ {
                name: 'Потрачено материалов на сумму',
                data: gApp.object_view.current_object.consumption_data[selected_year].year_data.material_spent
            }, {
                name: 'Завезено материалов на сумму',
                data: gApp.object_view.current_object.consumption_data[selected_year].year_data.material_bought

            }]
        });
        $('#year_consumption_chart .highcharts-xaxis-labels span').click(goToMaterialsTabFromYearChart)
         function goToMaterialsTabFromYearChart  (){
            var months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
            var month =   ""+(months.indexOf(this.textContent) + 1)
            if (month.length==1) month = '0'+month
            var year = gApp.object_view.getCurrentConsumtionYear()
            gApp.object_view.dateStart = moment(year+"-"+month+"-01", "YYYY-MM-DD").startOf('month');
            gApp.object_view.dateEnd = moment(year+"-"+month+"-01", "YYYY-MM-DD").endOf('month');
            $('#object_view .left-content [name=object-view-tab]').prop('checked', false)
            $('#object_view .left-content #material').prop('checked', true)
            gApp.object_view.changeObjectViewTab();
        };
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
                min: 1,
                categories: function () { var res = []; for (var t = 1; t<32; t++) {res.push(t)} return res} ,
                labels: {
                    style:{
                        border: '2px solid #e9e9e8',
                        borderRadius: '10px',
                        padding: '3px 7px'
                    },
                    useHTML: true
                },
                useHTML: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Рубли, тыс'
                },
                labels:{
                    formatter: function() {return this.value/1000}
                }
            },
            tooltip: {
                enabled: true,
                useHTML: true,
                shared: true,
                formatter: function(){
                    var tooltip = "<div class='gorizont-tooltip'>"
                    tooltip += tooltipHeader(this.x + " "+ tooltipDict[selectedMonth])
                    $.each(this.points, function(i,point){
                        tooltip += tooltipRow(point.series.name, point.y,  point.series.color, ths_to_text)
                    })
                    return tooltip;
                }
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
                name: 'Израсходовано материалов на сумму',
                data: gApp.object_view.current_object.consumption_data[selectedYear].month_data[selectedMonth]

            }]
        });
        var tooltipDict ={
            "Январь": "января",
            "Февраль" : "февраля",
            "Март": "марта",
            "Апрель" : "апреля",
            "Май": "мая",
            "Июнь" : "июня",
            "Июль" : "июля",
            "Август": "авнуста",
            "Сентябрь": "сентября",
            "Октябрь": "декабря",
            "Ноябрь" :"ноября",
            "Декабрь":"декабря"
        }
        $('#month_consumption_chart .highcharts-xaxis-labels span').click(goToMaterialsTabFromMonthChart)
        function goToMaterialsTabFromMonthChart  (){
            var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
            var month =   ""+(months.indexOf(selectedMonth) + 1)
            if (month.length==1) month = '0'+month
            var year = gApp.object_view.getCurrentConsumtionYear()
            var day = ""+(this.textContent)
            if (day.length==1) day = '0'+day
            console.log(year+"-"+month+"-"+day)
            gApp.object_view.dateStart = moment(year+"-"+month+"-"+day, "YYYY-MM-DD").startOf('day');
            gApp.object_view.dateEnd = moment(year+"-"+month+"-"+day, "YYYY-MM-DD").endOf('day');
            $('#object_view .left-content [name=object-view-tab]').prop('checked', false)
            $('#object_view .left-content #material').prop('checked', true)
            gApp.object_view.changeObjectViewTab();
        };
    }
}