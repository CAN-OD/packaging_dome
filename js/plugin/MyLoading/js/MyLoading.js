/**
 * Created by SF-1888 on 2016/8/22.
 */

    // 动态加在css 与 js 文件方法
    // $.extend({
    //     includePath: '',
    //     include: function(file){
    //         var files = typeof file == "string" ? [file] : file;
    //         var styleTag = "";
    //         for (var i = 0; i < files.length; i++)
    //         {
    //             var name = files[i].replace(/^s|$/g, "");
    //             var att = name.split('.');
    //             var ext = att[att.length - 1].toLowerCase();
    //             var isCSS = ext === "js";
    //             var tag = !isCSS ? '<link />' : '<script></script>';
    //             var attrType = !isCSS ? 'text/css' : 'text/javascript';
    //             var attrRl= !isCSS ? 'stylesheet' : 'javascript';
    //             styleTag = $(tag);
    //             styleTag.attr("type", attrType);
    //             if(!isCSS){
    //                 styleTag.attr({
    //                     "rel": attrRl,
    //                     "href": $.includePath + name
    //                 });
    //             }else{
    //                 styleTag.attr({
    //                     "language": attrRl,
    //                     "src": $.includePath + name
    //                 });
    //             }
    //             $("head").append(styleTag);
    //         }
    //     }
    // });

(function (window, undefined) {
    //定义Loading的构造函数
    var MyLoading = function(ele, opt) {
        this.scollBarInit = false;
        this.$element = ele,
        // 默认参数设置
        this.defaults = {
            thisCss:{},
            MaskCss:{},
            loadingCss:{},
            loadShow:true,
            loadHide:false
        };
        this.options = $.extend({}, this.defaults, opt);
        this.init();
    };

    //定义AreaCho的方法
    MyLoading.prototype = {
        init:function(){
            this.htmlInit();
            this.loadingShow();
            this.loadingHide();
        },
        htmlInit:function(){
            var that = this.$element,
                option = this.options;
            // J.include(['../MyLoading/css/MyLoading.css']);
            var Html = $('<div class="wwbPop" >'+
                '<div class="wwbPop_Mask"></div>'+
                '<div class="wwbPop_Cont" id="wwbPop_Cont">'+
                '<div class="loading"></div>'+
                '</div>'+
                '</div>');

            var h = $(window).height();
            Html.find(".wwbPop_Cont").css("height",h);
            Html.css(option.thisCss);
            Html.find(".wwbPop_Mask").css(option.MaskCss);
            Html.find(".loading").css(option.loadingCss);
            $(window).resize(function(){
                var h = $(window).height();
                Html.find(".wwbPop_Cont").css("height",h);
            });
            that.append(Html); // Html 初始化
            alert(11111)
            console.log(that.html())
        },
        loadingShow:function(){
            var  $this = this,
                that = $this.$element;
            if(this.options.loadShow){
                that.find(".wwbPop").css("display","block");
            }
        },
        loadingHide:function(){
            var $this = this,
                that = $this.$element;
            if(this.options.loadHide) {
                that.find(".wwbPop").css("display", "none");
            }
        }
    };
    // $.fn.MyLoading = function(option){
    //     //创建table的实体
    //     var beautifier = new Loading(this,option);
    //     //调用其方法
    //     beautifier.init();
    //     return beautifier;
    // };
    window.MyLoading = MyLoading;
})(window);
