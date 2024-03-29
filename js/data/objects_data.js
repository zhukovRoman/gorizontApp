objects=[
    {
        id:1,
        name: 'Ростокино',
        address: 'г.Москва, Будайский проезд, дом 9',
        district: 'СВАО',
        latlng: [55.6905, 37.67], // координаты объекта
        type: 'Дороги', //depricated может быть пустым или отсутствовать
        manager: {    // информация о начальнике участка
            fio: 'Иванов Иван Иванович',
            phone: '+79251282422',
            mail: 'mail@mail.com'
        } ,
        is_completed: false,  // завершен ли объект
        date_start: "12.12.2014",  // дата начала работ
        plan_date_end: '13.12.2015',   // планируемая дата окончания
        days_lag: 30, // отставание в днях
        plan: {    // игформация о плане работ
            steps_count: 7, // всего этапов/вех
            steps_complete: 2, //завершено этапов/вех
            current_step: "Коллектор №4",  // текущий этап
            steps: [{
                name: 'ГЛАВА 1. Подготовка территории строительства',
                percent: 100,
                status: 'completed',
                time: '2015-12-25',
                days_lag: 0,
                substeps: [{
                    name:'Смета №1 - Разработка а/б покрытий',
                    percent: 100
                },{
                    name:'Смета №2 - Вырубка зеленных насаждений',
                    percent: 100
                }]
            },{
                name: 'ГЛАВА 2. Основные объекты строительства',
                percent: 100,
                status: 'completed',
                days_lag: 30,
                time: '2015-12-25',
                substeps: [{
                    name:'Смета №3 - Канализация',
                    percent: 30
                },{
                    name: 'Смета №4 - Дождевая канализация',
                    percent: 1
                },{
                    name: 'Водопонижение эжекторными иглофильтрами. Канализация AVN700',
                    percent: 25
                },{
                    name: 'Водопонижение вакуумными УВВ-3. Канализация открытая прокладка',
                    percent: 55
                },{
                    name: 'Водопонижение эжекторными иглофильтрами. Канализация ВМ500',
                    percent: 75
                },{
                    name: 'Водопонижение вакуумными УВВ-3. Канализация AVN700',
                    percent: 65
                },{
                    name: 'Водопонижение эжекторными иглофильтрами. Канализация AVN1200',
                    percent: 45
                },{
                    name: 'Водопонижение эжекторными иглофильтрами. Канализация AVN1000',
                    percent: 45
                },{
                    name: 'Водопонижение вакуумными УВВ-3. ДК',
                    percent: 25
                }]
            },{
                name: 'ГЛАВА 7. Благоустройство и озеленение территории',
                percent: 5,
                status: 'inprogress',
                days_lag: -4,
                time: '2015-08-25',
                substeps: [{
                    name:'Устройство газона',
                    percent: 10
                },{
                    name: 'Озеленение',
                    percent: 1
                },{
                    name: 'Уличное освещение',
                    percent: 0
                }]
            },{
                name: 'ГЛАВА 8. Временные здания и сооружения',
                percent: 30,
                status: 'inprogress',
                days_lag: 0,
                time: '2015-12-25',
                substeps: [{
                    name:'Временное уширение проезжей части',
                    percent: 30
                },{
                    name: 'Организация дорожного движения (установка бетонных блоков)',
                    percent: 90
                },{
                    name: 'Временная дорога',
                    percent: 50
                }]
            }]
        },
        budget:12000000,
        budget_spent: 3000000, //закуплено метериалов на сумму
        budget_used: 2500000, //списано мат на сумму

        budget_current_plan: 2000000, // планировали потратить на текущий момент

        material_all_count: 60,  //матералов всего надо на объект в шт
        material_bought: 20, // закуплено мат в шт
        material_used: 19, // заюзано мат в шт

        consumption_data: {  // информация о списании и закупке материалов
            "2013":{ // информация за год
                year_data: {
                    material_bought:[11, 33], // материалов закуплено по месяцам в рублях по месяцам через запятую
                    material_spent: [22, 22]  // материалов потрачено по месяцам в рублях
                    // если в кокой-то месяц не списали или не закупили то надо отдавать 0
                },
                month_data: {} // информация по списаниям по месяцам
                // в формате "месяц": [[число, сумма в рублях], []…]
                // если появлися год, то должен быть хотя бы один месяц!
            },
            "2014": {
                year_data: {
                    material_bought:[490000, 710000, 1060000, 1290000, 1440000, 1760000, 1350000, 1480000, 2160000, 1940000, 950000, 540000],
                    material_spent: [830000, 780000, 980000, 930000, 1060000, 840000, 1050000, 1040000, 910000, 830000, 1060000, 920000]
                },
                month_data: {
                    "Январь": [[1, 2],[2, 1],[3, 2],[4, 5],[5, 2],[6, 1],[7, 2],[8, 3]],
                    "Февраль": [[1, 1],[2, 1],[3, 1],[4, 1],[5, 1],[6, 1],[7, 1],[8, 1]],
                    "Март": [[1, 1],[2, 1],[3, 1],[4, 1],[5, 1],[6, 1],[7, 1],[8, 1]]
                }
            },
            "2015": {
                year_data: {
                    material_bought: [830000, 780000, 980000, 930000, 1060000, 840000, 1050000, 1040000, 910000, 830000, 1060000, 920000],
                    material_spent:[490000, 710000, 1060000, 1290000, 1440000, 1760000, 1350000, 1480000, 2160000, 1940000, 950000, 540000]
                },
                month_data: {
                    "Январь": [[1, 100000],[2, 100000],[3, 200000],[4, 500000],[5, 200000],[6, 100000],[7, 200000],[8, 300000]],
                    "Февраль": [[1, 200000],[2, 100000],[3, 100000],[4, 100000],[5, 100000],[6, 100000],[7, 100000],[10, 100000]]
                }
            }
        }
    },
    {
        id:2,
        name: 'Большая Академическая (Николаев)',
        address: 'г.Москва, Будайский проезд, дом 9',
        district: 'ЮЗАО',
        latlng: [55.497657, 37.589328 ],
        type: 'Переход',
        objects_manager: 'Иванов Иван Иванович',
        full_type: 'Автомобильные дороги',
        is_completed: false,  // завершен ли объект
        date_start: "12.12.2014",  // дата начала работ
        plan_date_end: '13.12.2015',   // планируемая дата окончания
        manager: {    // информация о начальнике участка
        } ,
        days_lag: 0, // отставание в днях
        plan: {    // игформация о плане работ
            steps_count: 7, // всего этапов/вех
            steps_complete: 4, //завершено этапов/вех
            current_step: "Коллектор №4"  // текущий этап
        },
        budget:12000000,
        budget_spent: 11000000, //закуплено метериалов на сумму
        budget_used: 8000000, //списано мат на сумму

        budget_current_plan: 6000000, // планировали потратить на текущий момент

        material_all_count: 60,  //матералов всего надо на объект в шт
        material_bought: 50, // закуплено мат в шт
        material_used: 40, // заюзано мат в шт
        consumption_data: {}
        },
    {
        id:3,
        name: 'Бескудниково (Васенев)',
        address: 'Москва',
        district: 'ЮВАО',
        latlng: [ 55.739023, 37.741063],
        type: 'Мосты',
        objects_manager: 'Иванов Иван Иванович',
        full_type: 'Автомобильные дороги',
        is_completed: false,
        material_spent: 12000000,
        material_left: 36000000,
        current_year_budget: 80000000,
        current_year_budget_spent: 50000000
    },
    {
        id:4,
        name: 'Большая Академическая,57 (Бобков)',
        address: 'Москва',
        district: 'ЗАО',
        latlng: [55.874276, 37.627562],
        type: 'Мосты',
        objects_manager: 'Иванов Иван Иванович',
        full_type: 'Автомобильные дороги',
        is_completed: true,
        material_spent: 12000000,
        material_left: 36000000,
        current_year_budget: 80000000,
        current_year_budget_spent: 50000000
    }
]

//request_data = [
//    {"id":33,
//        "type_id":1,
//        "pos_count":19,
//        "created_at":"16.04.2015",
//        "amount":0,
//        "status":"В процессе",
//        "author":"Краснышев А. В.",
//        "items":[
//            {"notation_name":"Сверла по дереву перьевые",
//                "quantity":10.0,"unit_name":"шт",
//                "price":0.0,"required_date":"23.04.2015"}
//        ],
//        "documents":[
//            {"type":"Invoice",
//                "type_id":4,
//                "created_at":"17.04.2015",
//                "contractor":"Доска и брус ООО",
//                "status":"Новый",
//                "ship_price":null,
//                "items":[
//                    {"notation_name":"Доска обрезная 50*150*6 м",
//                        "quantity":20.0,
//                        "unit_name":"м3",
//                        "price":136500.0,
//                        "required_date":"18.04.2015"}]},
//            {"type":"Invoice",
//                "type_id":3,
//                "created_at":"17.04.2015",
//                "contractor":"СпецСтрой Групп ООО",
//                "status":"Новый",
//                "ship_price":2596.0,
//                "items":[
//                    {"notation_name":"Пергамин ",
//                        "quantity":60.0,
//                        "unit_name":"рул",
//                        "price":8160.0,
//                        "required_date":"23.04.2015"},
//                    {"notation_name":"Фиксатор \"Стульчик\" 35",
//                        "quantity":800.0,"unit_name":"шт",
//                        "price":4000.0,"required_date":
//                        "23.04.2015"}]},
//            {"type":"Invoice","type_id":1,"created_at":"17.04.2015","contractor":"ТД ПРОЖБИ ООО","status":"Новый","ship_price":null,"items":[{"notation_name":"Плита перекрытия ВП 16-6","quantity":2.0,"unit_name":"шт","price":3226.0,"required_date":"18.04.2015"},{"notation_name":"Плита канальная ВП 16-18 с отверстием","quantity":1.0,"unit_name":"шт","price":4624.0,"required_date":"18.04.2015"},{"notation_name":"Плита канальная ВП 28-18","quantity":1.0,"unit_name":"шт","price":10968.0,"required_date":"18.04.2015"},{"notation_name":"Плита канальная ВП 28-12","quantity":1.0,"unit_name":"шт","price":7411.0,"required_date":"18.04.2015"},{"notation_name":"Балка доборная ДБ-34","quantity":2.0,"unit_name":"шт","price":10060.0,"required_date":"18.04.2015"},{"notation_name":"Кольцо колодезное К-8-10чс","quantity":2.0,"unit_name":"шт","price":3082.0,"required_date":"18.04.2015"},{"notation_name":"Опорная плита ОП-1 д","quantity":2.0,"unit_name":"шт","price":7216.0,"required_date":"18.04.2015"},{"notation_name":"Крышка колодца ПВК-8","quantity":2.0,"unit_name":"шт","price":2088.0,"required_date":"18.04.2015"},{"notation_name":"Плита опорная УОП-6","quantity":2.0,"unit_name":"шт","price":13262.0,"required_date":"18.04.2015"},{"notation_name":"Плита перекрытия камер коллектора ВП 22-18","quantity":1.0,"unit_name":"шт","price":6594.0,"required_date":"18.04.2015"},{"notation_name":"Плита канальная ВП 22-6","quantity":1.0,"unit_name":"шт","price":2144.0,"required_date":"18.04.2015"},{"notation_name":"ВГ-15 Колодец железобетонный","quantity":5.0,"unit_name":"шт","price":62125.0,"required_date":"18.04.2015"}]},{"type":"Invoice","type_id":2,"created_at":"17.04.2015","contractor":"А ГРУПП","status":"Новый","ship_price":null,"items":[{"notation_name":"Арматура А-3 d10мм","quantity":6.0,"unit_name":"т","price":170100.0,"required_date":"22.04.2015"},{"notation_name":"Арматура А-3 d12мм","quantity":6.0,"unit_name":"т","price":160500.0,"required_date":"22.04.2015"},{"notation_name":"Арматура А-3 d14мм","quantity":6.0,"unit_name":"т","price":158700.0,"required_date":"22.04.2015"}]}]}]