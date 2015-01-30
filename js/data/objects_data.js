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
        days_lag: 30,
        plan: {
            steps_count: 7,
            steps_complete: 4,
            current_step: "Коллектор №4"
        },
        budget:12000000,
        budget_spent: 11000000, //закуплено метериалов на сумму
        budget_used: 8000000, //списано мат на сумму
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
                    material_bought:[49000000, 71000000, 106000000, 129000000, 144000000, 176000000, 135000000, 148000000, 216000000, 194000000, 95000000, 54000000],
                    material_spent: [83000000, 78000000, 98000000, 93000000, 106000000, 84000000, 105000000, 104000000, 91000000, 83000000, 106000000, 92000000]
                },
                month_data: {
                    "Январь": [[1, 2],[2, 1],[3, 2],[4, 5],[5, 2],[6, 1],[7, 2],[8, 3]],
                    "Февраль": [[1, 1],[2, 1],[3, 1],[4, 1],[5, 1],[6, 1],[7, 1],[8, 1]],
                    "Март": [[1, 1],[2, 1],[3, 1],[4, 1],[5, 1],[6, 1],[7, 1],[8, 1]]
                }
            },
            "2015": {
                year_data: {
                    material_bought: [83000000, 78000000, 98000000, 93000000, 106000000, 84000000, 105000000, 104000000, 91000000, 83000000, 106000000, 92000000],
                    material_spent:[49000000, 71000000, 106000000, 129000000, 144000000, 176000000, 135000000, 148000000, 216000000, 194000000, 95000000, 54000000]
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