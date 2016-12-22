/**
 * Created by SF-1888 on 2016/9/7.
 */


define(['jquery'],function($){

// ----------------------扩展插件----------------------------------

var J = {};  

// J 扩展方法
$.extend(J,{
    includePath:"",
    // 插件css文件按需引用
    includePathCss:function(){
        return 'js/plugin/';
    },
    // 动态加在css 与 js 文件方法
    include: function(file){
        var files = typeof file == "string" ? [file] : file;
        var styleTag = "";
        for (var i = 0; i < files.length; i++)
        {
            var name = files[i].replace(/^s|$/g, "");
            var att = name.split('.');
            var ext = att[att.length - 1].toLowerCase();
            var isCSS = ext === "js";
            var tag = !isCSS ? '<link />' : '<script></script>';
            var attrType = !isCSS ? 'text/css' : 'text/javascript';
            var attrRl= !isCSS ? 'stylesheet' : 'javascript';
            styleTag = $(tag);
            styleTag.attr("type", attrType);
            if(!isCSS){
                styleTag.attr({
                    "rel": attrRl,
                    "href": J.includePath + name
                });
            }else{
                styleTag.attr({
                    "language": attrRl,
                    "src": J.includePath + name
                });
            }
            $("head").append(styleTag);
        }
    },
    // 页面初始化获取数据
    pageData: function(params) {
        if (!params) return;
        var returnData;
        $.ajax({
            url: params.url ? params.url : window.location.pathname.replace('.jsp', '.json',".html"),
            type: params.type?params.type:'post',
            async: params.async?params.async:false,
            data: params.data? params.data : '',
            success: function(data) {
                returnData = data.data;
            }
        });
        return returnData;
    },
    //解析url参数
    getUrlString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2])
        };
        return null;
    },
    // 解析url参数
    getQueryString:function (key, url) {
        url = (url) ? url : location.search;
        if (key != null && key != "" && key != undefined) {
            var value = url.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
            return value ? value[1] : value;
        }
        var result = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
        if (result == null) return null;
        for (var i = 0; i < result.length; i++) {
            result[i] = result[i].substring(1);
        }
        return result;
    },
    //截取字符串  str 截取内容  / cutlen 截取长度
    strLeng: function(str, cutlen) {
        var strArray = str.split('');
        var count = 0;
        var reg = /[^\u4E00-\u9FA5]/;
        var newArray = [];
        for (var i = 0; i < strArray.length; i++) {
            if (!reg.test(strArray[i])) {
                count = count + 2;
            } else {
                count = count + 1;
            };
            if (cutlen && count > cutlen) {
                break;
            }
            newArray.push(strArray[i]);
        };
        if (cutlen) {
            return newArray.join('');
        }
        return count;
    },
    //文字省略  e 对象 / i 截取文本长度
    slight: function(e, i) {
        $(e).each(function() {
            //获取td当前对象的文本,如果长度大于25;
            if ($(this).text().length >= i) {
                //给td设置title属性,并且设置td的完整值.给title属性.
                $(this).attr("title", $(this).text());
                //获取td的值,进行截取。赋值给text变量保存.
                var text = $(this).text().substring(0, i) + "...";
                //重新为td赋值;
                $(this).text(text);
                // .siblings("i").css({"left":(($(this).text().length)-(text.length))+"px"})
            }
        });
    },
    // 获取当前 地址端口
    locationHref: function() {
        // return window.location.origin + "/helppoor";
        return window.location.origin;
    },
    // 获取相应节点name ,并赋值
    domName: function(option) {
        var data = option.data,        // 数据集合 
            detail = option.domMyName,  // name字段集合 
            $target = option.target,  // 赋值范围 
            textDom = '';
        for (var i = 0, len = detail.length; i < len; i++) {
            var domName = detail.eq(i).attr("name");
            for (var k in data) {
                if (domName == k) {
                    $("[name=" + domName + "]",$target).html(data[k]);
                }
            }
        }
    },
    //自定义alert
    alert: function(txt, status,callback){
        var html = '<div class="c-alert-wrapper"><div class="c-alert">\
                    <div class="c-alert-head">提示</div>\
                    <p class="c-alert-ct-txt"><i class="'+ status +'"></i>'+ txt +'</p>\
                    <p class="c-alert-sure-btn"><button class="c-alert-close">确&nbsp;&nbsp;定</button></p>\
                    <div class="c-alert-close-btn c-alert-close">\
                    </div></div></div>';
        var bodyObj = $('body'),
            obj = $('.c-alert-wrapper');
     
        alertShow(callback);

        //
        function alertHidden(){
            var   obj = $('.c-alert-wrapper');
            obj.remove();
        };

        //
        function alertShow(callback){
            $('body').append(html);
            var innerObj = $('.c-alert'),
                innerHeight = innerObj.height() + 42;
            innerObj.css({'margin-top': -Math.round(innerHeight / 2)+'px'});
            $(innerObj.find('p')[0]).html('<i class="'+ status +'"></i>' + txt);

            $('.c-alert-close').off().on('click', (function(c){
                return function(){
                    alertHidden();
                    c && c();
                }
            })(callback));
        };
    },
    //自定义 默认系统信息提示框alert
    alertOne:function (msg,sure,msgClass,onClose) {
        J.include([J.includePathCss()+'alert/alert.css']);   // 加载本方法特殊css文件
        if($(".alert-alert").last().text()==msg) return;
        msgClass=(msgClass?msgClass:"");
        if(msg.indexOf("成功")>=0||msg.indexOf("完成")>=0)
            msgClass="success";
        else if(msg.indexOf("失败")>=0||msg.indexOf("错误")>=0)
            msgClass="error";
        new dacAlert({
            title:"系统消息",
            type:"alert",
            content:msg,
            onClose:onClose,
            msgClass:msgClass,
            btn:[{
                text:"确定",
                click:function(target){
                    if(typeof sure=="function") return sure(target);
                }
            }
            ]
        });
    },
    //阻止浏览器默认行为触发的通用方法
    stopDefault: function (e) {
        //防止浏览器默认行为(W3C)
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        //IE中组织浏览器行为
        else {
            window.event.returnValue = false; //实际上在IE8以下，会报错
            return false;
        }
    }, 
    // 删除 报错提示框
    resetPage:function(){
        $("body>.validator-msg").remove();
    },
    // 弹出框   message 内容 /  onConfirm 确认按钮回调/ onCancel 取消按钮回调 / title 标题
    confirm:function (message, onConfirm, onCancel, title) {
        J.resetPage();
        $("<div class='dialog-alert'>" + message + "</div>").dialog({
            title:"确认框",
            width:300,
            dialogClass:"aa",
            minHeight:180,
            modal:true,
            resizable:false,
            buttons:{
                "确定":function () {
                    var rs;
                    if (typeof onConfirm == "function") {
                        rs = onConfirm.call(this);
                    }
                    if (rs !== false) {
                        $(this).dialog("close");
                    }
                },
                "取消":function () {
                    if (typeof onCancel == "function") {
                        rs = onCancel.call(this);
                    }
                    if (rs !== false) {
                        $(this).dialog("close");
                    }
                }
            },
            close:function () {
                $(this).closest(".ui-dialog").remove();
            }
        });
    },
    //
    form: function (options) {
        var page = J.getQueryString("page", options.page);
        var $div = $("<div></div>");
        var buttons = {};

        options = $.extend({
            title:"对话框",
            page:"",
            submitAction:"",
            width:400,
            idKey:"flowId",
            data:{},
            showTitle:true,
            beforeSend:false,
            callBack:false,
            btn:[
                {
                    text:"确定",
                    sureBtn:true,
                    click:function (container, form) {
                        if (form && form.valid()) {
                            var requestData = container.getFormData(),
                                submitAction = form.attr("action"),
                                beforeSend = options.beforeSend;

                            submitAction = submitAction || options.submitAction;

                            if (!submitAction) {
                                J.alert("错误：表单submitAction为空，请检查！");
                                return false;
                            }

                            if (typeof beforeSend === 'function') {
                                var result = beforeSend.call(requestData, content);
                                if (result === false) return false;
                            }

                            J.request({
                                url:submitAction,
                                data:requestData,
                                success:function (data) {
                                    $div.dialog("close");
                                    if (typeof options.callBack == "function") {
                                        options.callBack(data, requestData);
                                    }
                                }
                            });
                        }
                        return false;
                    }
                },
                {
                    text:"取消",
                    sureBtn:true,
                    click:function () {

                    }
                }
            ]
        }, options || {});

        /*
         * add btns
         * */
        if (options["btn"] && options["btn"].length && page != "view") {
            $(options["btn"]).each(function (i, v) {
                buttons[v["text"]] = function () {
                    var rs = v["click"].call(this, $(this), $("form", this));
                    if (rs !== false) {
                        $div.dialog("close");
                    }
                }
            });
        }

        $div.loadPage(options.page, options.data, function (container) {

            var form = $("form", container).eq(0);

            if (form.length > 0 && page != "view") {
                form.validate({
                    debug:true
                });
            }

            if (typeof options["data"] == "object") {
                J.buildFormValue(form, options["data"]);
            }

            if (page == "view") {
                $div.find("input,select,textarea").addClass("read-only").attr("readonly",true);
                $div.find("select,[type=radio],[type=checkbox]").attr("disabled", true);
            }

            $div.dialog({
                title:options["title"],
                modal:true,
                resizable:options["fullScreen"] !== true,
                width:options["width"] || "auto",
                height:options["height"] || "auto",
                buttons:buttons,
                beforeClose:function () {
                },
                open:function (e) {
                    if (options["fullScreen"] == true) {
                        var bottom = options["btn"].length ? "40px" : "5px";
                        $(e.target).closest(".ui-dialog").addClass("fullScreen");
                        $div.css({
                            bottom:bottom,
                            left:"5px",
                            position:"absolute",
                            right:"5px",
                            top:options["showTitle"] ? "35px" : "5px"
                        });
                    }
                    if (options["showTitle"] == false) {
                        $div.prev(".ui-dialog-titlebar").hide();
                    }
                    J.popResize($div);
                },
                close:function () {
                    $(this).closest(".ui-dialog").remove();
                }
            });
        });
    },
    //
    setNoCacheUrl:function(url){
        if(url.indexOf("?")>=0)  url+="&rd="+Math.random();
        else url+="?rd="+Math.random();
        url = url.replace(/\/{2}/, '/');
        return url;
    },
    // ajax请求 模板
    request : function(option){
        var _this=J,ajaxTimeoutTest,
            async=(option.async===false?false:true);
        if(option.loading!=false)_this.loadingShow(option.markShow,option.loadingBox||$("body"));
        ajaxTimeoutTest=$.ajax(
            {
                type:option.type||'POST',
                data:option.data||{},
                url:_this.setNoCacheUrl(option.url)||'',
                async:async,
                timeout : 60000,
                dataType:option.dataType||'JSON',
                beforeSend:function(){
                    if(typeof option.beforeSend=="function") option.beforeSend();
                },
                success: function(data){
                     result=data;
                      if(option.loading!=false) _this.loadingHide(option.loadingBox);
                   
                    if(typeof option.success == 'function' ) option.success(data);
                },
                error:function(ex){
                      $(".page-loading").hide();
                    switch(ex.status){
                        case 0:
                               var msg="服务器已经停止运行，请通知系统管理员检查并解决。";
                               
                               if($(".alert-alert").last().text().indexOf(msg)<0) dac.alert(msg);
                               
                            break;
                        case 401:
                            
                            window.location.reload();
                            break;
                            
                        case 403:
                            if(ex.getResponseHeader("Logout-Flag")=="1") $("#J-container").empty();

                            _this.alert(decodeURIComponent(ex.getResponseHeader("Error-Message")),function(){
                                if(ex.getResponseHeader("Logout-Flag")=="1"){
                                    window.location.href='http://10.0.3.119:8089/cas/login';
                                }
                            });
                            break;
                        case 404:
                            _this.alert(option.url+"，请求服务器的接口不存在。");
                            break;
                        case 500:
                            var msg=decodeURIComponent(ex.getResponseHeader("Error-Message"));
                            if($(".alert-alert").last().text()!=msg) dac.alert(msg,ex.responseText);
                            break;
                    }
                  
                    
                    if(typeof option.error == 'function' ) option.error(ex);
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数

                if(status=='timeout'){//超时,status还有success,error等值的情况
                 ajaxTimeoutTest.abort();
                  dac.alert("超时");
                };
                }
            }
        );
        if(async==false) return result;
    },
    // 返回ajax请求结果集  (参照:J.getJson($$("/hsql/importExceltoHdb.json"),'post',data))
    getJson:function(url,type,data,loading,loadingBox,markShow){
        return J.request({
            url:url,
            data:data||{},
            loading:loading||false,
            loadingBox:loadingBox||$("body"),
            async:false,
            markShow:markShow||true,
            type:type||"get",
            dataType:"json"
        });
    },
    //正则校验
    valiReg: function(type, str) {
        var reg = {
            phone: /^1[3|4|5|7|8][0-9]{9}$/
        }
        return reg[type].test(str);
    },
    // 相对路径省略
    saite:function(uri){
        var contextPath="<%=request.getSession().getServletContext().getContextPath()%>";
        this.$$ = function(uri) {
            return (contextPath + uri).replace(/\/{2}/, '/');
        };
        this.filePath=this.uir = contextPath+"/static/pages/tpl";
    },
    //
    buildFormValue:function(target,data,dataObjectName){
        if(typeof data!="object") return;
        var obj,
            type,
            value;
        target.find("input,textarea,select").each(function(){
            if($(this).attr("noreturn")) return;
            var name=$(this).attr("name");
            if(name&&data[name.replace(dataObjectName,"")]!=undefined){
                obj=$(this);
                type=(obj[0].tagName).toLowerCase();
                value=data[name.replace(dataObjectName,"")];
                switch(type){
                    case "select":
                        var selected=obj.find("option[value=\""+value+"\"]"),
                            selectList=obj.next(".controls-select");
                        selected.attr("selected",true);
                        if(typeof obj.refreshSelect == "function"){
                            obj.refreshSelect();
                        }
                        if(selectList.size()>0){
                            selectList.find(".value").text(selected.text());
                            $(window).resize();
                        }
                        break;
                    case "input":
                        if(obj.attr("type")=="text"||obj.attr("type")=="password"||obj.attr("type")=="hidden"){
                            obj.val(value);
                        }
                        else if(obj.attr("type")=="radio"){
                            var temp=target.find("[name=\""+name+"\"][value=\""+value+"\"]");
                            if(temp.attr("init")) return;
                            if(temp.size()==1) {
                                if(temp.hasClass("read-only")){
                                    target.find("[name=\""+name+"\"]").removeAttr("checked").parent().removeClass("checked");
                                    temp.parent().addClass("checked");
                                    temp.attr("checked",true);
                                }
                                else {
                                    temp.parent().click();
                                }
                                temp.attr("init",true);
                            }
                        }
                        else if(obj.attr("type")=="checkbox"){
                            var tempAttr=value+"";
                            if(tempAttr) tempAttr=tempAttr.split(",");
                            else return;

                            if(target.find("[name=\""+name+"\"]").eq(0).hasClass("checked")){
                                target.find("[name=\""+name+"\"]").removeAttr("checked").parent().removeClass("checked");
                            }
                            for(var i=0;i<tempAttr.length;i++){
                                var temp=target.find("[name=\""+name+"\"][value=\""+tempAttr[i]+"\"]");
                                if(temp.attr("init")) return;
                                if(temp.size()>0){
                                    if(temp.hasClass("read-only")){
                                        temp.parent().addClass("checked");
                                        temp.attr("checked",true);
                                    }
                                    else temp.parent().click();
                                    temp.attr("init",true);
                                }
                            }
                        }
                        break;
                    case "textarea":
                        obj.val(value);
                        break;
                }
            }
        });
    },
    //
    htmlFormat:function(value){
        value=value+"";
        value=value.replace(/'|"/g,"&quot;");
        value=value.replace(/</g,"&lt;");
        value=value.replace(/>/g,"&gt;");
        return value;
    },
    // 加载显示遮罩层
    maskShow:function(){
        var mask=$(".mask");
        if(mask.size()>0){ mask.eq(0).show();}
        else{
            $("body").append("<div class=\"mask\"></div>");
        }
    },
    // 加载隐藏遮罩层
    maskHide:function(){
        $(".mask").css("filter","alpha(opacity=15)");
        $(".mask").fadeOut("fast");
    },
    // 加载显示  maskShow 是否有遮罩 / loadingBox html加载位置
    loadingShow:function(maskShow,loadingBox){
        var left=loadingBox.offset().left,top=loadingBox.offset().top;
        var w=loadingBox.width(),h=loadingBox.height();
        var loading=loadingBox.children('.page-loading');
        if(loading.length>0) {
            loading.show(); 
        }else{
            // loadingBox.append($("<div  class=\"page-loading\"><span class=\"text-hide\">加载中，请稍后...</span></div>"));
            loadingBox.append($("<div  class=\"page-loading\"><span class=\"text-hide\"></span></div>"));
        };
        if(maskShow===true||maskShow==undefined){
            J.maskShow();
        }
    },
    // 加载隐藏  loadingBox html父级容器
    loadingHide:function(loadingBox){
        J.maskHide();
        loadingBox?loadingBox.find(".page-loading").fadeOut("fast"):$("body").children(".page-loading").fadeOut("fast");
    },
    // 简单显示 Loading 
    MyLoadingShow:function(ele,option){
       J.include([J.includePathCss()+'MyLoading/css/MyLoading.css']);
      new MyLoading(ele,option);
    },
    // 简单隐藏 Loading 
    MyLoadingHide:function(ele,option){
      new MyLoading(ele,{loadHide:true});
    },
    // input禁止输入特殊符号
    checkInput:function(){
        $("body").on("keyup","input[checkZf]",function(){
            if(this.value==""){
                return false;
            }   
            var re=/[\(\)\<\>\=\!]{1,}/ ;
            if(re.test(this.value)==true){
               this.value=this.value.substring(0,this.value.length - 1);
               alert(this.value)
            }
       });
    },
    // 
    loadPage: function(tpl, container, callBack, cacheData, options) {
        if (typeof tpl == "object") {
            options = tpl;
            tpl = options.tpl;
            callBack = options.callBack;
            container = options.container;
            cacheData = options.cacheData || {};
        }
        cacheData = cacheData || {};

        container = container || $("#J-right-container");

        if (!tpl || !container) {
            return;
        }

        var loader = $("#J-loader");

        if (loader.length) {
            loader.empty();
        } else {
            loader = $("<div id='J-loader' class='J-loader'></div>").appendTo("body");
        }

        J.resetPage();
        J.pageCallback = null;
        container[0].cacheData = {};

        J.loadingShow();
        if (J.config.pageLogClear) {
            J.clearLog();
            J.startTime("Page execution time");
        }

        var tplPath = /^\/.*$/.test(tpl) ? tpl : config.pageBasePath + tpl;
        var noCacheTpl = J.setNoCacheUrl(tplPath);

        loader.load(noCacheTpl, function (tplResult, status, jqXHR) {
            var pageCallBack = {};
            var pageBuildComplete = function () {

                container.flexResize();
                container.css("visibility", "visible");

                if (J["ajaxCount"] <= 0) {
                    J.loadingHide();
                }

                if (J.config.pageLogClear) {
                    J.endTime("Page execution time");
                }

                //callback
                if (typeof callBack === "function") {
                    callBack(container);
                }
                J.pageCallback = null;
            };

            //error
            if (status == "error") {
                J.log("Tpl Error:" + tpl + " load fail");
                //container.closest(".ePop-container").remove();
                J.loadingHide();
                var XHR_status = jqXHR["status"];

                if (XHR_status == 404) {
                    container.loadPage("404.html", {tpl:tplPath}, callBack);
                } else {
                    var msg = "请求的页面不存在或者服务器已经停止运行，请通知系统管理员检查并解决。";
                    if ($(".ePop-alert").last().text().indexOf(msg) < 0) {
                        J.alert(msg);
                    }
                }
            } else {
                var html = tplResult.replace(/<\s*script.*>(\s*|\S*)*<\/\s*script\s*>/gi, "");

                //fill html
                container.css("visibility", "hidden").html(html);
                loader.empty();

                //cacheData
                container[0].cacheData = cacheData;

                if (J.isFunction(J.pageCallback)) {

                    window.queryString = J.getQueryString(null, tpl);

                    pageCallBack = new J.pageCallback(container, cacheData);
                    seajs.use(pageCallBack.use, function () {
                        if (typeof pageCallBack.pageLogic === "function") {
                            pageCallBack.pageLogic.apply(this, arguments);
                        }
                        pageBuildComplete();
                    });
                } else {
                    pageBuildComplete();
                }
            }
        });
    },
    // 拖拽方法封装
    // 拖动事件
    MineDrag:function(options) {
        var aDiv = $("#" + options.dom);
        aDiv.mousedown(function(ev) { //鼠标点击
            var ev = ev || event;
            var disX = ev.clientX - $(this).offset().left;
            var disY = ev.clientY - $(this).offset().top;
            var Mleft = parseInt($(this).css("margin-left")) != 0 ? parseInt($(this).css("width")) / 2 : "";
            var MTop = parseInt($(this).css("margin-top")) != 0 ? parseInt($(this).css("height")) / 2 : "";
            var that = $(this);

            $(document).mousemove(function(ev) {
                var ev = ev || event,
                    maxTop = options.maxTop?options.maxTop:0,     // 
                    minTop = options.minTop?options.minTop:0,     //
                    maxLeft = options.maxLeft?options.maxLeft:0,  //
                    minLeft = options.minLeft?options.minLeft:0,  //
                    parentLeft = options.parentLeft?parseInt(options.parentLeft.width()):0,//获取当前元素之前的元素宽度
                    parentTop = options.parentTop?parseInt(options.parentTop.height()):0,//获取当前元素之前的元素高度
                    zLeft =  ev.clientX - disX + Mleft-parentLeft ,
                    zTop = ev.clientY - disY + MTop -parentLeft;
                // 移动范围
                if(zLeft<minLeft || zLeft>maxLeft){
                    zLeft = parseInt(that.css("left"));
                }
                if(zTop<minTop || zTop>maxTop){
                    zTop = parseInt(that.css("top"));
                }
                aDiv.css({
                    "left": zLeft+ 'px',
                    "top": zTop + 'px'
                });
                // 获取鼠标 回调返回
                options.callBackMove && options.callBackMove.call(that,zLeft,zTop);
            });
            $(document).mouseup(function(ev) {
                $(document).unbind("mousemove");
                $(document).unbind("mouseup");

                // 松开鼠标 回调返回
                options.callBackUp && options.callBackUp.call(that,parseInt(that.css("left")),parseInt(that.css("top")));
            });
        });
    },
    // 检测是否碰撞 、是否有交集
    isOverlap: function(objOne, objTwo) {
        var offsetOne = objOne.offset();
        var offsetTwo = objTwo.offset();
        var x1 = offsetOne.left;
        var y1 = offsetOne.top;
        var x2 = x1 + objOne.width();
        var y2 = y1 + objOne.height();

        var x3 = offsetTwo.left;
        var y3 = offsetTwo.top;
        var x4 = x3 + objTwo.width();
        var y4 = y3 + objTwo.height();

        var zx = Math.abs(x1 + x2 - x3 - x4);
        var x = Math.abs(x1 - x2) + Math.abs(x3 - x4);
        var zy = Math.abs(y1 + y2 - y3 - y4);
        var y = Math.abs(y1 - y2) + Math.abs(y3 - y4);

        if(y2<y3 || x1>x4 || y1>y4 || x2<x3){// 表示没碰上  
           return false;
        }else{  
           return true; 
        }  
        return (zx <= x && zy <= y);
    }

});


// ----------------------通用方法----------------------------------
//  扩展插件
$.extend($.fn,{
    //通用短信验证码
    sendMessage: function(options){
        var _this = this,
            params = {
                url:'/psportal/csInfo/getAuthCode.json',
                debug: false,
                phoneNum: ''
            },
            countTime = null,
            nodeFlag = true,
            count = 60; //计数器

        $.extend(true, params, options);
        var phoneObjName = $(_this).attr('data-phone');
        if(!phoneObjName){
            return;
        }
        var thisNodeName = $(_this).context.nodeName;
        var phoneObj = $('input[name='+ phoneObjName +']'), //用name来查找
            phoneVal = params.phoneNum ? params.phoneNum : phoneObj.val();
        if(thisNodeName == 'INPUT'){
            nodeFlag = false;
        }
        if(!phoneVal){
            $.alert('请填写手机号码','warm');
            return;
        }else if(!valiReg('phone', phoneVal)){
            $.alert('请输入正确的手机号码','warm');
            return;
        }
      
        $.ajax({
            url: params.url,
            type: 'post',
            data: {
                phoneNum: phoneVal
            },
            success: function(data){
                if(params.debug){
                    console.log(data);
                };
                var btnHtml = nodeFlag ? $(_this).html() : $(_this).val();
                $(_this).attr('disabled', true);
                countTime = setInterval(function(){
                    count = count - 1;
                    nodeFlag ? $(_this).html(btnHtml + '('+ count +'s)') : $(_this).val(btnHtml + '('+ count +'s)');
                    if(count == 0){
                        clearInterval(countTime);
                        $(_this).removeAttr('disabled');
                        nodeFlag ? $(_this).html(btnHtml) : $(_this).val(btnHtml);
                        return;
                    }
                }, 1000);
                if(data.data.authNum){
                    $.alert(data.data.authNum);
                }
            }
        })
    },
    // 
    validateCode: function (phoneNum,authCode,url) {
        var ret = false;
        if(authCode){
                $.ajax({
                    url: url,
                    async: false,
                    type: 'post',
                    data:{'phoneNum':phoneNum,"authCode":authCode},
                    success: function(data){
                        if(!data.data.ret){
                            $.alert(data.data.msg);
                        }else{
                            ret =  true;
                        }
                        
                    }
                });
        }else{
            $.alert("请输入验证码！");
        }
        return ret;
    },
    // 
    alert:function (option) {
        new dacAlert({
            title: option.title || "",
            type: option.type || "url",
            cacheData: option.data || {},
            width: option.width || "auto",
            height: option.height || "auto",
            content: option.url,
            btnAlign: option.btnAlign || "center",
            move: true,
            btn: option.btnShow == false ? [] : option.btn || [
                {
                    text: option.submitText || "保存",
                    sureBtn: true,
                    click: function (form) {
                        if (typeof option.beforeSubmit == "function") option.beforeSubmit(form);
                        form.validator();
                        if(form.find(".validator-msg").length!=0){
                            form.find(".validator-msg").prev("input")[0].focus();
                            return false;
                        }
                        if (form.validatorResult()) {
                            var go = true,
                                submitAction = $(".form-container[action]", form).attr("action");

                            submitAction = submitAction ? $$(submitAction) : option.submitAction;
                            //editor validate
                            $("textarea[editor]", form).each(function () {
                                if (UE) {
                                    $(this).val(UE.getEditor($(this).siblings(".edui-default").attr("id")).getContent());
                                }
                            });

                            if (typeof option.onSubmit == "function") go = (option.onSubmit(form) == false ? false : true);
                            if (go == false) return false;

                            var requestData = form.getFormData(),
                                beforeSend = option.beforeSend;
                            if (typeof beforeSend === 'function') {
                                var result = beforeSend.call(requestData, form);
                                if (result === false) return false;
                            }
                      
                       
                            $.ajax({
                                url: submitAction,
                                data: requestData,
                                type:"POST",
                                success: function (data) {

                                    if (form.find(".form-container").size() > 0 && (typeof form.find(".form-container").data()["callBack"]) == "function")
                                        form.find(".form-container").data()["callBack"]();

                                    form.parents(".alert-container").remove();
                                    if (typeof option.callBack == "function") option.callBack(data, requestData,form);

                                },
                                error: function (ex) {
                                    if (typeof option.error == "function") option.error(ex);
                                }
                            });
                        }
                        return false;
                    }
                },

                {
                    text: "取消",
                    click: function (form) {
                        if (typeof option.onCancel == "function") option.onCancel(form);

                    }
                }
            ],
            onClose: function (form) {

                //calendar
                $("[lang=zh-cn]").hide();
                if (typeof option.onClose == "function") return option.onClose(form);
            },
            init: function (form) {
                if (typeof option.data == "object") {
                    form.data(option.data);
                }
            },
            callBack: function (form) {
        
                if (typeof option.data == "object") {
                    var dataObjectName = (option.dataObjectName ? option.dataObjectName + "." : "");
                    dac.buildFormValue(form, form.data(), dataObjectName);

                    $("textarea[editor]", form).each(function () {
                        var editorId = $(this).siblings(".edui-default").attr("id");
                        var value = $(this).val();
                        var editor;
                        if (UE && editorId && value) {
                            editor = UE.getEditor(editorId);
                            editor.ready(function () {
                                editor.setContent(value);
                            });
                        }
                    });

                    //expand
                    //form.find("select").Select();
                    form.find(".controls-radio").Radio();
                    form.find(".controls-checkbox").CheckBox();
                    form.find(".controls-input").addClass("clearfix");
                    form.find(".read-only").attr("readonly", "readonly");

                    if (page == "edit") {
                        form.append("<input type=\"hidden\" value=\"" + (option["idKey"] ? option.data[option["idKey"]] : option.data.flowId) + "\" name=\"" + dataObjectName + (option["idKey"] ? option["idKey"] : "flowId") + "\"/>");
                    }
                }
                form.validator({
                    msgDirection: "right",
                    msgShow: false
                });
            }
        });
    },
    // 弹出框样式设置
    dialog:function(options) {
        var dialog = {
            title:options.title,
            modal:true,
            resizable:options.fullScreen !== true,
            width:options.width || "auto",
            height:options.height || "auto",
            buttons:options.buttons,
            beforeClose:function () {

            },
            open:function (e) {
                if (options.fullScreen == true) {
                    var bottom = options.btn.length ? "40px" : "5px";
                    $(e.target).closest(".ui-dialog").addClass("fullScreen");
                    $div.css({
                        bottom:bottom,
                        left:"5px",
                        position:"absolute",
                        right:"5px",
                        top:options.showTitle ? "35px" : "5px"
                    });
                }
                if (options.showTitle == false) {
                    $div.prev(".ui-dialog-titlebar").hide();
                }
                J.popResize($div);
            },
            close:function () {
                $(this).closest(".ui-dialog").remove();
            }
        }
    },
    // 请求加载 页面碎片
    // loadPage:function(option,callBack){
    //     var defaultOption={
    //             el:$("#contentRight"),
    //             cacheData:{},
    //             type:"GET"
    //         },
    //         _this=this;
    //     var option=$.extend({},defaultOption,option);
    //     J.loadingShow(true,$("body"));
    //     $.ajax({
    //         type:"GET",
    //         async : false,
    //         url:option.url,
    //         success:function(d){
    //             J.loadingHide();
    //             window.tabC=[];
    //             option.el.data({
    //                 getPageData:function(){
    //                     return option.cacheData;
    //                 }
    //             }); 
    //             option.el.append(d);
    //             if(typeof callBack=="function")callBack();
    //         }
    //     })
    // },
    loadPage:function (tpl, cacheData, callBack) {
        return this.each(function () {
            J.loadPage(tpl, $(this), callBack, cacheData);
        });
    }
})


if (J) {
    return J;
}

// ----------------------通用方法----------------------------------
//     // 通用方法 基类
//     var Class = function() {

//     };

//     Class.prototype ={
//         'init':function(options){
//             // this.saite();  
//             // this.alert();  
//         },
//         //
//         'valiReg': function(type, str) {
//         },
//         // 
//         'saite':function(uri){
//         }
        
//     }
//     var myT = new Class;
//     return myT;

});