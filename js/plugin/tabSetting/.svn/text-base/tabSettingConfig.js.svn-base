define([
    "lazy-load/lazyLoad",
    "business/tabSetting/tabSettingCtrl"
], function (lazyLoadModule, tabSettingCtrl){
        "use strict";

        var configArr = [{
                name:"tabSetting",
                url: "/tabSetting",
                templateUrl: "scripts/app/business/tabSetting/tabSettingTpl.html"
        }];
        var moduleDep = [];

        var tabSettingModule = angular.module('tabSettingModule', moduleDep);
        
        //controller
        tabSettingModule.controller('tabSettingCtrl', tabSettingCtrl);
        //module lazy load
        tabSettingModule = lazyLoadModule.makeLazy(tabSettingModule);
        tabSettingModule.tinyStateConfig({stateConfig:configArr});

        return tabSettingModule;
});
