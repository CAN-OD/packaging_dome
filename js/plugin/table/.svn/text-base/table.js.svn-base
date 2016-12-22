define(["lazy-load/lazyLoad",
    "business/table/tableCtrl",
    "business/table/tableService"
], function (lazyLoadModule, tableCtrl, tableService) {
    "use strict";

    var configArr = [
        {
            name:"table",
            url:"/table",
            templateUrl:"scripts/app/business/table/tableTpl.html"
        }
    ];

    //module dependency
    var tableModuleDep = [
        'ui.router'
    ];

    var tableModule = angular.module("table", tableModuleDep);

    //module lazy load
    tableModule = lazyLoadModule.makeLazy(tableModule);

    //service
    tableModule.service('tableService', tableService);

    //controller
    tableModule.controller('tableCtrl', tableCtrl);

    // stateConfig属性配置路由状态基本信息；urlMatch属性配置异常url对应的url路径
    tableModule.tinyStateConfig({
        stateConfig:configArr,
        urlMatch:[
            ["/table/", "/table"],
            ["/table", "/table"]
        ]
    });

    return tableModule;
});
