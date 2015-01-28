objects=[
    {
        id:1,
        name: 'Moscow-city',
        address: 'Москва, Кутузовский проспект',
        distinct: 'СВАО',
        latlng: [55.6905, 37.67],
        type: 'Дороги', //depricated
        director: {
            fio: 'Иванов Иван Иванович',
            phone: '+79251282427',
            mail: 'mail@mail.com'
        } ,
        is_complete: false,
        date_start: "12.12.2014",
        plan_date_end: '13.12.2015',
        plan: {
            steps_count: 7,
            steps_complete: 4,
            current_step: "Коллектор №4"
        },
        budget:12000000,
        budget_spent: 10000000, //закуплено метериалов на сумму
        budget_used: 7000000, //списано мат на сумму
        budget_current_plan: 6000000, // планировали потратить на текущий момент

        material_all_count: 60,  //матералов всего надо на объект в шт
        material_bought: 50, // закуплено мат в шт
        material_used: 40, // заюзано мат в шт

        consumption_data: {
            "2013":{
                year_data: {
                    material_bought:[11, 33],
                    material_spent: [22, 22]
                },
                month_data: {}
            },
            "2014": {
                year_data: {
                    material_bought:[49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                    material_spent: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
                },
                month_data: {
                    "Январь": [[0, 30],[1, 2],[2, 1],[3, 2],[4, 5],[5, 2],[6, 1],[7, 2],[8, 3]],
                    "Февраль": [[0, 20],[1, 1],[2, 1],[3, 1],[4, 1],[5, 1],[6, 1],[7, 1],[8, 1]],
                    "Март": [[0, 15],[1, 1],[2, 1],[3, 1],[4, 1],[5, 1],[6, 1],[7, 1],[8, 1]]
                }
            },
            "2015": {
                year_data: {
                    material_bought: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
                    material_spent:[49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                },
                month_data: {
                    "Январь": [[1, 1],[2, 1],[3, 2],[4, 5],[5, 2],[6, 1],[7, 2],[8, 3]],
                    "Февраль": [[1, 2],[2, 1],[3, 1],[4, 1],[5, 1],[6, 1],[7, 1],[10, 1]]
                }
            }
        }
    },
    {
        id:2,
        name: 'Moscow-city2',
        address: 'Москва',
        distinct: 'ВАО',
        latlng: [55.497657, 37.589328 ],
        type: 'Переход',
        objects_director: 'Иванов Иван Иванович',
        full_type: 'Автомобильные дороги',
        is_complete: false,
        material_spent: 12000000,
        material_left: 36000000,
        current_year_budget: 80000000,
        current_year_budget_spent: 50000000
    },
    {
        id:3,
        name: 'Moscow-city3',
        address: 'Москва',
        distinct: 'ЮВАО',
        latlng: [ 55.739023, 37.741063],
        type: 'Мосты',
        objects_director: 'Иванов Иван Иванович',
        full_type: 'Автомобильные дороги',
        is_complete: false,
        material_spent: 12000000,
        material_left: 36000000,
        current_year_budget: 80000000,
        current_year_budget_spent: 50000000
    },
    {
        id:4,
        name: 'Moscow-city4',
        address: 'Москва',
        distinct: 'ЗАО',
        latlng: [55.874276, 37.627562],
        type: 'Мосты',
        objects_director: 'Иванов Иван Иванович',
        full_type: 'Автомобильные дороги',
        is_complete: true,
        material_spent: 12000000,
        material_left: 36000000,
        current_year_budget: 80000000,
        current_year_budget_spent: 50000000
    }
]