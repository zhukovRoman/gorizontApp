gApp.object_view = {
    current_id: null,
    current_object: null,
    dateStart: null,
    dateEnd:null,
    filtered_by_dates_materials: null,
    storage_materials: null,
    requests: null,
    map: null,
    initObjectDetail: function(url){
        var id = url.split("?")[1].replace("id=","");
        this.current_id = parseInt(id);

        //this.current_id = 1;
        $.each(objects, function(i,val){
            if(val.id==gApp.object_view.current_id)
                gApp.object_view.current_object = val;
        })

        gApp.object_view.fillObjectInfo()
        gApp.object_view.changeObjectViewTab();
        gApp.object_view.loadStorageData();
        gApp.object_view.loadConsumtionData();
        gApp.object_view.loadRequestsData();

        $('#object_view .left-content [name=object-view-tab]').on('change', gApp.object_view.changeObjectViewTab)
        // TODO
        // need move event binding to tab processing
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
        $('#storage_search_input').on('keyup', function(){
            gApp.object_view.refillStorageTable();
        })

        gApp.setNotyContainersForOtherPages();

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
        if (current_tab=='plan')
            gApp.object_view.fillPlanTab();
        if (current_tab=='storage')
            gApp.object_view.fillStorageTab();
        if (current_tab=='requests')
            gApp.object_view.fillRequestsTab();

    },
    fillMaterialTab: function(){
        $('#object_view .material-content').show();
        gApp.object_view.setDates();
        gApp.object_view.getDataByDates();
        //gApp.object_view.refillTable();
    },
    getDataByDates: function(){
        gApp.dataSaver.getMaterialsConsumtionsByObject(gApp.object_view.current_id, function(data){
            gApp.object_view.filtered_by_dates_materials = gApp.object_view.materialDataProvider(data)
            gApp.object_view.refillTable();
        })

    },
    setDates: function(){
        if(!gApp.object_view.dateStart)
            gApp.object_view.dateStart = moment().subtract(1, 'week')
        if(!gApp.object_view.dateEnd)
            gApp.object_view.dateEnd = moment()
        //console.log(gApp.object_view.dateStart,gApp.object_view.dateEnd)
        $('#date_start').val(gApp.object_view.dateStart.format("YYYY-MM-DD"))
        $('#date_end').val(gApp.object_view.dateEnd.format("YYYY-MM-DD"))
    },
    refillTable: function(){
        var container = $('#materials_table_content').html('')
        $.each(gApp.object_view.filtered_by_dates_materials, function(notation,materials){
            if (!gApp.object_view.checkNotation(notation, $('#materials_search_input').val())) return;
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
    checkNotation: function(notation, query){
        var query = query.toLowerCase()
        if (query.length<2) return true;
        notation = notation.toLowerCase();
        if (notation.indexOf(query)>-1) return true;
        return false
    },
    materialDataProvider: function(data){
        dateStart = gApp.object_view.dateStart
        dateEnd = gApp.object_view.dateEnd
        var res = {}
        $.each(data.materials_spent, function(i,material_spent){
            $.each(material_spent.records, function(i,item){
                var date =  moment(item.date, "DD-MM-YYYY")
                if (date.isBefore(dateStart) || date.isAfter(dateEnd)) return;
                if (!res[material_spent.name]) res[material_spent.name]=[];
                res[material_spent.name].push(item)
            })
        })
        return res
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
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                fontSize: "20px"
                            }
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
                        y: gApp.object_view.current_object.material_bought||0
                    },{
                        name: 'Осталось закупить',
                        y:gApp.object_view.current_object.material_all_count||0 - gApp.object_view.current_object.material_bought||0
                    }],
                    size: 450,
                    innerSize: 300,
                    dataLabels: {
                        formatter: function () {
                            return this.percentage > 5 ? this.percentage.toFixed() + "%" : null;
                        },
                        color: 'white',
                        distance: -45
                    }
                }, {
                    name: 'Списано',
                    data: [{
                        name: 'Списано материалов',
                        y: gApp.object_view.current_object.material_used||0,
                        color: '#C31A1A'
                    },],
                    //color: 'red',
                    size: 550,
                    innerSize: 450,
                    startAngle: 0,
                    dataLabels: {
                        formatter: function () {
                            var percent = (gApp.object_view.current_object.material_used*100/gApp.object_view.current_object.material_bought).toFixed()||0
                            return percent > 2 ? percent + "%" : null;
                        }
                    },
                    endAngle: calcAngile(gApp.object_view.current_object.material_all_count||0, gApp.object_view.current_object.material_used||0)
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
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                fontSize: "20px"
                            }
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
                        y: gApp.object_view.current_object.budget_spent||0
                    },{
                        name: 'Остаток бюджета',
                        y:  (gApp.object_view.current_object.budget - gApp.object_view.current_object.budget_spent)||0
                    }],
                    size: 450,
                    innerSize: 300,
                    dataLabels: {
                        formatter: function () {
                            return this.percentage > 5 ? this.percentage.toFixed() + "%" : null;
                        },
                        color: 'white',
                        distance: -45
                    }
                }, {
                    name: 'Списано',
                    data: [{
                        name: 'Списано на сумму',
                        y: gApp.object_view.current_object.budget_used||0,
                        color: '#C31A1A'
                    },],
                    //color: 'red',
                    size: 550,
                    innerSize: 450,
                    startAngle: 0,
                    dataLabels: {
                        formatter: function () {
                            var percent = (gApp.object_view.current_object.budget_used*100/gApp.object_view.current_object.budget_spent).toFixed()||0
                            return percent > 2 ? percent + "%" : null;
                        }
                    },
                    endAngle: calcAngile(gApp.object_view.current_object.budget||0, gApp.object_view.current_object.budget_used||0)
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
                        data: [gApp.object_view.current_object.budget_spent||0]
                    },{
                    name: 'Планировали потратить',
                    data: [gApp.object_view.current_object.budget_current_plan||0]
                }]
            }
            )
        }

    },
    fillPlanTab: function (){
        $('#object_view .plan-content').show();
        gApp.object_view.refillPlanTable()
    },
    refillPlanTable: function(){
        function generateProgressBar (cl, value) {
            return $(document.createElement('div')).addClass('progress').addClass(cl)
                .append($(document.createElement('div')).addClass('progress-value').text(value+'%').width(value+'%'))
        }

        function generateStatus (status, lag){
            if (status=='completed' && lag==0)
                return 'completed'
            if (status=='completed' && lag>0)
                return 'completed-overdue'
            if (status=='completed' && lag<0)
                return 'completed-intime'
            if (status=='inprogress' && lag>0)
                return 'inprogress-overdue'
            if (status=='inprogress' && lag<=0)
                return 'inprogress'
            if(status=='notstarted')
                return 'inprogress'
        }

        function generateStatusText (status, lag, date){
            if (status=='notstarted')
                return 'не начато'
            if (status=='completed' && lag==0)
                return 'выполнено в срок'
            if (status=='completed' && lag>0)
                return 'позже на '+lag+' '+format_num(lag, {nom: 'день', gen: 'дня', plu: 'дней'})
            if (status=='completed' && lag<0)
                return 'раньше на '+lag*(-1)+' '+format_num(lag, {nom: 'день', gen: 'дня', plu: 'дней'})
            if (status=='inprogress' && lag>0)
                return 'отставание на '+lag+' '+format_num(lag, {nom: 'день', gen: 'дня', plu: 'дней'})
            if (status=='inprogress' && lag<=0)
                return 'срок '+moment(date).format('DD.MM.YYYY')
        }

        var container = $('#plan_table_content').html('');
        if(!gApp.object_view.current_object.schedule || gApp.object_view.current_object.schedule.subschedules.length < 1) {
            $('#plan_table_content').html(' <h1> Данных о плане нет… </h1>')
            return;
        }
        $.each(gApp.object_view.current_object.schedule.subschedules, function(i,step){
            var plan_item = $(document.createElement('div')).addClass('plan-item')
            var plan_part = $(document.createElement('div')).addClass('plan-part')

            plan_part.append($(document.createElement('span')).text(step.name))
            plan_part.append($(document.createElement('span')).append(generateProgressBar('progress-orange', step.percent)))
            plan_part.append($(document.createElement('span')).addClass(generateStatus(step.status, step.days_lag))
                .text(generateStatusText(step.status, step.days_lag, step.time)))
            plan_item.append(plan_part)
            $.each(step.subschedules, function(i, substep){
                var subpart = $(document.createElement('div')).addClass('plan-subpart');
                subpart.append($(document.createElement('span')).text(substep.name));
                subpart.append($(document.createElement('span')).append(generateProgressBar('progress-gray', substep.percent)))
                plan_item.append(subpart)
            })

            container.append(plan_item)
        })

    },
    refillStorageTable: function(){
        var container = $('#storage_table_content').html('')
        if (!gApp.object_view.storage_materials) { return $('#storage_table_content').html('<h4>Склад пуст</h4>')};
        if (gApp.object_view.storage_materials.length==0) { return $('#storage_table_content').html('<h4>Склад пуст</h4>')};
        $.each(gApp.object_view.storage_materials, function(i,mat){
            if (!gApp.object_view.checkNotation(mat.notation_name, $('#storage_search_input').val())) return;
            var mat_row = $(document.createElement('div')).addClass('storage-row')
            mat_row.append($(document.createElement('span')).text(mat.notation_name))
            mat_row.append($(document.createElement('span')).text(mat.quantity+' '+mat.unit_name))
            mat_row.append($(document.createElement('span')).text(thousands_sep((mat.price).toFixed())+' ₽'))
            container.append(mat_row);
        })
    },
    fillStorageTab: function(){
        //gApp.object_view.storage_materials = materials_storage;
        gApp.dataSaver.getMaterialsPlotByObject(gApp.object_view.current_id, function(data){
            gApp.object_view.storage_materials = data;
            gApp.object_view.refillStorageTable();
            $('#object_view .storage-content').show();
        })


    },
    fillInfoTab: function(){
        $('#object_view .info-content').show();
        initMap()
        function  initMap (){
            if (gApp.object_view.map) gApp.object_view.map.remove();
            var obj =  gApp.object_view.current_object
            gApp.object_view.map = L.map('object_map', {
                zoomControl: false,
                dragging: false,
                touchZoom: false,
                scrollWheelZoom: false,
                doubleClickZoom: false
                // - 0.01 потому что маркер должен быть по центру верхней трети
            }).setView([obj.latlng[0]-0.01,obj.latlng[1]], 15);
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '',
                //id: 'examples.map-20v6611k'
                //id: 'zhuk99.kpafdddm'
                id: 'examples.map-i86l3621'
            }).addTo(gApp.object_view.map);
            L.marker(obj.latlng,gApp.getMarkerOption(obj)).addTo(gApp.object_view.map)
        }
    },
    fillObjectInfo: function(){
        // fill budjet info
        $('#budget_info').text(mln_to_text(gApp.object_view.current_object.budget))
        $('#budget_spent').text(mln_to_text(gApp.object_view.current_object.budget_spent))

        var daysLastText = text_between_dates( moment(),
                                                (gApp.object_view.current_object.plan_date_end) ?
                                                    moment(gApp.object_view.current_object.plan_date_end, "DD.MM.YYYY") :
                                                    null
                                                )
        $('#days_last').text(format_num(daysLastText, {nom: ' Остался ', gen: ' Осталось ', plu: ' Осталось '})+daysLastText)
        if (gApp.object_view.current_object.days_lag <=0){
            $('.days-left').width('100%');
            $('.object-lag').hide();
        }
        $('#days_lag').text(
            "Отставание " + ((gApp.object_view.current_object.days_lag <= 0 || !gApp.object_view.current_object.days_lag ) ?
                            " 0 дней " :
                            gApp.object_view.current_object.days_lag + format_num(gApp.object_view.current_object.days_lag,
                                                                                {nom: ' день', gen: ' дня', plu: ' дней'})
                            )
        )

        var daysBetweenStartAndEnd = moment(gApp.object_view.current_object.plan_date_end, "DD.MM.YYYY").diff(
            moment(gApp.object_view.current_object.date_start, "DD.MM.YYYY"), 'days')
        var daysBetweenCurrentAndEnd = moment(gApp.object_view.current_object.plan_date_end, "DD.MM.YYYY").diff(
            moment(), 'days')
        $('#complete_progres').css('width', (daysBetweenStartAndEnd-daysBetweenCurrentAndEnd)*100/daysBetweenStartAndEnd+'%')
        $('#not_complete_progres').css('width', (daysBetweenCurrentAndEnd)*100/daysBetweenStartAndEnd+'%')
        $.each($('#object_view [data-value-name]'), function(i, element){
            var value = '';
            if (!gApp.object_view.current_object[$(element).attr('data-part')] &&
                                        $(element).attr('data-part')) {$(element).text('-'); return;}
            if ($(element).attr('data-part'))
                value = (gApp.object_view.current_object[$(element).attr('data-part')][$(element).attr('data-value-name')]||'-')
            else
                value = (gApp.object_view.current_object[$(element).attr('data-value-name')]||'-')

            $(element).text(value)
        })
        if(!gApp.object_view.current_object.schedule) {
            $('#steps_count').text('-');
            $('#steps_complete').text('-');
            return;
        }
        $('#steps_count').text(gApp.object_view.current_object.schedule.steps_count||0 +
            format_num(gApp.object_view.current_object.schedule.steps_count||0, {nom: ' этап', gen: ' этапа', plu: ' этапов'}))
        $('#steps_complete').text(gApp.object_view.current_object.schedule.steps_complete||0 +
            format_num(gApp.object_view.current_object.schedule.steps_complete||0, {nom: ' этап', gen: ' этапа', plu: ' этапов'}))

    },

    fillConsumptionTab: function() {
        $('#object_view .consumption-content').show();
        //$('#object_view .right-content').hide();
        //$('#object_view .left-content').css('width',"100%")


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
        $.each(gApp.object_view.current_object.consumption_data, function(id, data){
            select.append($('<option>', {value:data.year, text:data.year}));
        })
        select.val($('#consumption_current_year option').last().attr('value'));
        select.selectmenu( "refresh" );
    },
    fillConsumptionMonthSelect: function(){
        var select = $('#consumption_current_month');
        select.html('')
        var currentYear = gApp.object_view.getCurrentConsumtionYear();
        if (!currentYear) return
        $.each(currentYear.months, function(year, data){
            select.append($('<option>', {value:data.name, text:data.name}));
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
        var yearName = $('#consumption_current_year').val();
        if(!yearName) return null;
        var year = null;
        $.each(gApp.object_view.current_object.consumption_data, function(i,yearData){
            if (yearData.year == yearName) year = yearData;
        })
        return year;
    },
    getCurrentConsumtionMonth: function(yearData){
        var monthName = $('#consumption_current_month').val();
        if (!monthName) return null;
        var month = null;
        $.each(yearData.months, function(i,monthData){
            if (monthData.name == monthName) month = monthData;
        })
        return month;
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
        if (!selected_year) return
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
                    tooltip += tooltipHeader(this.x+ " " + selected_year.year)
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
                data: selected_year.material_spent
            }, {
                name: 'Завезено материалов на сумму',
                data: selected_year.material_bought

            }]
        });
        $('#year_consumption_chart .highcharts-xaxis-labels span').click(goToMaterialsTabFromYearChart)
         function goToMaterialsTabFromYearChart  (){
            var months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
            var month =   ""+(months.indexOf(this.textContent) + 1)
            if (month.length==1) month = '0'+month
            var year = selected_year.year;
            gApp.object_view.dateStart = moment(year+"-"+month+"-01", "YYYY-MM-DD").startOf('month');
            gApp.object_view.dateEnd = moment(year+"-"+month+"-01", "YYYY-MM-DD").endOf('month');
            $('#object_view .left-content [name=object-view-tab]').prop('checked', false)
            $('#object_view .left-content #material').prop('checked', true)
            gApp.object_view.changeObjectViewTab();
        };
    },

    drawConsumtionMonthChart: function(){
        var selectedYear = gApp.object_view.getCurrentConsumtionYear();
        var selectedMonth = gApp.object_view.getCurrentConsumtionMonth(selectedYear);
        if (!selectedYear|| !selectedMonth) return
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
                    tooltip += tooltipHeader(this.x + " "+ tooltipDict[selectedMonth.name])
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
                data: selectedMonth.data

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
            //var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь ', 'Ноябрь', 'Декабрь']
            //var month =   ""+(months.indexOf(selectedMonth.name) + 1)
            var month = ""+ selectedMonth.index;
            if (month.length==1) month = '0'+month
            var year = selectedYear.year;
            var day = ""+(this.textContent)
            if (day.length==1) day = '0'+day
            console.log(year+"-"+month+"-"+day)
            gApp.object_view.dateStart = moment(year+"-"+month+"-"+day, "YYYY-MM-DD").startOf('day');
            gApp.object_view.dateEnd = moment(year+"-"+month+"-"+day, "YYYY-MM-DD").endOf('day');
            $('#object_view .left-content [name=object-view-tab]').prop('checked', false)
            $('#object_view .left-content #material').prop('checked', true)
            gApp.object_view.changeObjectViewTab();
        };
    },
    loadStorageData: function (){
        gApp.httpApi.updateMaterialsPlotData(gApp.object_view.current_id, function(mat_plot){
            gApp.object_view.storage_materials = mat_plot;
        })
    },
    loadConsumtionData: function(){
        gApp.httpApi.updateMaterialsConsumtionData(gApp.object_view.current_id)
    },
    loadRequestsData: function(){
        gApp.httpApi.updateRequestsData(gApp.object_view.current_id)
    },
    fillRequestsTab: function(){

        $('#object_view .requests-content').show();
        $('#request_date_start').val(moment().subtract(2, 'week').format("YYYY-MM-DD"));
        $('#request_date_end').val(moment().format("YYYY-MM-DD"));

        $('#request_date_start, #request_date_end, .filters input').on('change', fillTable);
        $('#requests_search_input').on('keyup', function(){fillTable()});

        getRequestsData();

        function getRequestsData (){
            gApp.dataSaver.getRequestsByObject(gApp.object_view.current_id, function(data){
                gApp.object_view.requests = data;
                fillTable();
            })
        }
        function fillTable(){
            console.log('fill')
            var table = $('#requests_table_content').html('')
            //console.log(filtrateData(requestDataProvider()))
            $.each (filtrateData(gApp.object_view.requests), function(i, req){
                var request = $('<div class="request" data-request-id="'+req.id+'"></div>')
                var request_header = $('<div class="request-header"></div>')
                request_header.append($('<span> Заявка №'+req.type_id+'</span>'))
                request_header.append($('<span>'+req.pos_count+' позиций</span>'))
                request_header.append($('<span>от '+req.created_at+'</span>'))
                request_header.append($('<span>на '+req.amount.toFixed(2)+' ₽</span>'))
                request_header.append($('<span>'+(req.status)+'</span>'))
                request.append(request_header);
                $.each(req.documents, function(t, doc){
                    var part = $('<div class="request-part"></div>')
                    part.append($('<span>'+typeHumanized(doc.type)+' '+doc.type_id+'</span>'))
                    part.append($('<span>'+doc.created_at+'</span>'))
                    part.append($('<span>'+doc.contractor+'</span>'))
                    part.append($('<span>'+doc.status+'</span>'))
                    request.append(part);
                })
                table.append(request)
            })
            $('#requests_table_content .request').click(function(){
                var id = ($(this).attr("data-request-id"));
                var request = null;
                $.each(gApp.object_view.requests, function(i,val){
                    if (val.id == id) request = val;
                });
                gApp.object_view.showRequestDetail(request);
            })
        }
        function typeHumanized(type){
            types = {
                'Invoice' : 'Счет',
                'Request': 'Запрос'
            }
            return types[type];

        }
        function filtrateData(data){
            var statuses = (function(){
                 var res = [];
                $.each($('.filters input:checked'),function(i,checkbox){
                    res.push($(checkbox).attr('data-value'))
                })
                return res;
            })();
            var res = [];
            var dateStart =  $('#request_date_start').val();
            var dateEnd = $('#request_date_end').val();
            var notation = $('#requests_search_input').val();
            //console.log(statuses, dateStart, dateEnd, notation,data, moment("16.04.2015", 'DD.MM.YYYY'))
            $.each(data, function(i,val){
                 //console.log(moment(val.create_date, 'DD.MM.YYYY').isBetween(dateStart, dateEnd))
                 if(!moment(val.created_at, 'DD.MM.YYYY').isBetween(dateStart, dateEnd))return;
                 //console.log('date ok')
                 if(statuses.indexOf(val.status)==-1) return;
                 //console.log('stat ok')
                 var is_notation_check = false;
                 if(notation.length>=2){
                     $.each(val.documents, function(t,doc){
                         $.each(doc.items,function(k,item){
                             if(item.notation_name.toLowerCase().indexOf(notation.toLowerCase())!=-1) is_notation_check = true;
                         })
                     });
                     $.each(val.items, function(t,item){
                         if(item.notation_name.toLowerCase().indexOf(notation.toLowerCase())!=-1) is_notation_check = true;
                     });
                 }
                console.log(is_notation_check, notation.length>2,!is_notation_check && notation.length>2 )
                if (!is_notation_check && notation.length>=2) return;
                res.push(val)
            })
            //console.log('after filtrate',res)
            return res;
        }

    },
    showRequestDetail: function(req){
        //console.log(req.documents[0].ship_price)
         $('.requests-content').hide();
         $('.request_details h1').text('Заявка №'+req.type_id+' от '+req.created_at)
         $('.request_details h2').text('Автор: '+req.author)
         var table = $('.request-detail-table').html('');
        $.each (req.documents, function(i, doc){
            var request = $('<div class="request"></div>')
            var request_header = $('<div class="request-part-header"></div>')
            request_header.append($('<span>'+typeHumanized(doc.type)+' №'+doc.type_id+'</span>'))
            request_header.append($('<span>'+doc.contractor+'</span>'))
            request_header.append($('<span>Доставка: '+(doc.ship_price||'-')+' ₽</span>'))
            request.append(request_header);
            //console.log(doc.ship_price)
            $.each(doc.items, function(t, item){
                var part = $('<div class="request-part-row"></div>')
                part.append($('<span>'+item.notation_name+'</span>'))
                part.append($('<span>'+item.quantity+" "+item.unit_name+'</span>'))
                part.append($('<span>к '+item.required_date+'</span>'))
                part.append($('<span>'+item.price+' ₽</span>'))
                request.append(part);
            })
            table.append(request)
        })
        var request = $('<div class="request"></div>')
        var request_header = $('<div class="request-part-header"></div>')
        request_header.append($('<span>Не заказано</span>'))
        request_header.append($('<span></span>'))
        request_header.append($('<span></span>'))
        request.append(request_header);
        $.each(req.items, function(t, item){
            var part = $('<div class="request-part-row"></div>')
            part.append($('<span>'+item.notation_name+'</span>'))
            part.append($('<span>'+item.quantity+" "+item.unit_name+'</span>'))
            part.append($('<span>к '+item.required_date+'</span>'))
            part.append($('<span>'+item.price+' ₽</span>'))
            request.append(part);
        })
        table.append(request)
         $('.request_details').show();


        function typeHumanized(type){
            types = {
                'Invoice' : 'Счет',
                'Request': 'Запрос'
            }
            return types[type];

        }
    },
    hideRequestDetail: function(){
        $('.requests-content').show();
        $('.request_details').hide();
    }
}