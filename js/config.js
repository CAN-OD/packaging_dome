require.config({
   urlArgs: "bust=" +  (new Date()).getTime(),
   waitSeconds: 0,
   baseUrl:"./js/",
   paths:{
       "jquery":"jQuery-1.7.1",
       "packaging":"packaging", // 共用控件
       "MyLoading":"plugin/MyLoading/js/MyLoading",
       "alert":"plugin/alert/alert",
       "validator":"plugin/validator/validator",
       "mCustomScrollbar":"plugin/mCustomScrollbar/jquery.mCustomScrollbar.min",
       "css":"requirejs/css"
   },
    shim:{
        "packaging":{
            "deps": ["jquery","css"],
            "exports": "J"
        },
        "angularJS":{
            "deps": ["jquery","css"],
            "exports": "angularJS"
        },
        "mCustomScrollbar":{
            "deps": ["jquery","mousewheel"],
            "exports": "mCustomScrollbar"
        },
        "validator":{
            "deps": ["jquery"],
            "exports": "$.fn.validator"
        },
        "ztree": {
            "deps": ["jquery"],
            "exports": "$.fn.ztree"
        },
        "index'": ["css!../css/index.css"],
        "rest": ["css!../css/rest.css"]
    },
    map: {
        "*": {
            "css": "css"
        }
    }
});

require(['jquery','packaging','MyLoading','alert'],function($,J){

    // J.alert("aaaa",'success',function(){
    //   console.log(1111)
    // });
  
    // J.loadingShow(true,$("body"));
   J.confirm("你确定要删除？",function(){
       alert('成功')
   },function(){
    alert('取消')
   },'是是是');
   J.form("/dome2.html")
   // J.laodPage({url:window.filePath+"/dome2.html",el:$("body")});
    // $("input").alert({
    //     title:"连接数据库",
    //     url:"file:///E:/360data/重要数据/桌面/packaging_dome/dome2.html",
    //     btnAlign : "center",
    //     btn:[{
    //       text: "连接",
    //       sureBtn: true,
    //       click: function (form) {

    //       }
    //     },{
    //       text: "取消",
    //       sureBtn: true,
    //       click: function (form) {
            
    //       }
    //     }]
    // })
    // $(".mask").on("click",function(){
    //   J.alertOne(J.strLeng("123456789",2))
    //   J.loadingHide();
    // })
});



