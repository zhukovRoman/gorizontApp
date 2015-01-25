var url = 'http://localhost:8000/'
module.exports = {
    'Correct go to objects': function (test) {
            setUp(test)
            .assert.chain()
                .text("h1.ui-title").is(String('Список Объектов').toUpperCase())
                .css('#main_menu', 'left', '-450px')
                .css('#new_menu', 'left', '-478px')
            .end()
        .done();
    },
    'correct fill objects page': function(test) {
        setUp(test)
            .assert.chain()
                .numberOfElements('#object_search_result a', 3, '3 list row')
                .numberOfElements('#objects_map .leaflet-marker-icon', 3, '3 markers')
                .exists('.tf-row', 'tf successfully inserted')
            .end()
        .done();
    },
    'correct show comleted objects': function(test) {
        setUp(test)
            .click('.switchery')
            .assert.chain()
                .numberOfElements('#object_search_result a', 4, '4 list row')
                .numberOfElements('#objects_map .leaflet-marker-icon', 4, '4 markers')
            .end()
        .done();
    },
    'correct show menu': function(test) {
        setUp(test)
            .click('#menu-button')
            .wait(1000)
            .assert.chain()
                .css('#new_menu', 'left', '0px')
                .css('.content.ui-page-active', 'margin-left', '478px')
            .end()
            .click('#menu-button')
            .wait(1000)
            .assert.chain()
                .css('#new_menu', 'left', '-478px')
                .css('.content.ui-page-active', 'margin-left', '0px')
            .end()
        .done();
    },
    'correct filter objects by name': function(test) {
        setUp(test)
            .type('#objects_search_input', 'ку')
            .assert.chain()
                .numberOfElements('#object_search_result a', 1, '1 list row')
                .numberOfElements('#objects_map .leaflet-marker-icon', 1, '1 markers')
            .end()
        .done();
    }
};

function setUp(test){
    return test
        .open(url)
        //.assert.title().is('Горизонт')
        .wait(1000)
        .click('#main_menu li.objects-menu-item a')
        .wait(5000)
}