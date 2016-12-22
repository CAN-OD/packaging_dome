/**
 * Created by SF-1888 on 2016/10/21.
 */

define(function (require, exports, module) {

    var $ = require("jquery");

    require("jquery-ui");
    require("easy-ui");

    //jquery param reset
    var r20 = /%20/g,
        rbracket = /\[\]$/;

    function buildParams(prefix, obj, add) {
        if (jQuery.isArray(obj)) {
            jQuery.each(obj, function (i, v) {
                if (rbracket.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(prefix + "[" + i + "]", v, add);
                }
            });
        } else if (jQuery.type(obj) === "object") {
            for (var name in obj) {
                buildParams(prefix + "." + name, obj[ name ], add);
            }
        } else {
            add(prefix, obj);
        }
    }

    $.extend({
        param:function (a) {
            var s = [], add = function (key, value) {
                value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };
            if (jQuery.isArray(a) || ( a.jquery && !jQuery.isPlainObject(a) )) {
                jQuery.each(a, function (i, v) {
                    buildParams('[' + i + ']', v, add);
                });
            } else {
                for (var prefix in a) {
                    buildParams(prefix, a[ prefix ], add);
                }
            }
            return s.join("&").replace(r20, "+");
        },
        ajaxQueue:[],
        resumeAjaxQueue:function () {
            while (jQuery.ajaxQueue.length > 0) {
                var args = jQuery.ajaxQueue.shift();
                jQuery.ajax.call(null, args.url, args.options);
            }
        }
    });

    var J = {};

    if (window.J) {
        return window.J;
    }

    module.exports = window.J = J;

    var config = J.config = require("config") || {};

    var _uid = 10;

    $(["Object", "String", "Date", "Array", "Function"]).each(function (i, v) {
        J["is" + v] = function (obj) {
            return Object.prototype.toString.call(obj) == "[object " + v + "]";
        }
    });

    /*flexigrid*/
    require("flexigrid");
    //set flexigrid loading fun
    $.fn.flexigrid.defaults.loadingShowFun = J.loadingShow;
    $.fn.flexigrid.defaults.loadingHideFun = J.loadingHide;

    /*validate*/
    require("jquery-validate");
    $.extend($.validator.messages, {
        required:"必填字段",
        remote:"请修正该字段",
        email:"请输入正确格式的电子邮件",
        url:"请输入合法的网址",
        date:"请输入合法的日期",
        dateISO:"请输入合法的日期 (ISO).",
        number:"请输入合法的数字",
        digits:"只能输入整数",
        creditcard:"请输入合法的信用卡号",
        equalTo:"请再次输入相同的值",
        accept:"请输入拥有合法后缀名的字符串",
        maxlength:jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
        minlength:jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
        rangelength:jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
        range:jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max:jQuery.validator.format("请输入一个最大为{0} 的值"),
        min:jQuery.validator.format("请输入一个最小为{0} 的值")
    });

    //身份证验证
    $.validator.addMethod("idcard",function(value, element, param){
        var result = false;
        var num = value.toUpperCase();

        //validate
        if ((/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            var regex,arrSplit,dtmBirth,dateCheck;
            if (num.length == 15) {
                regex = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                arrSplit = num.match(regex);
                dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                dateCheck = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
                    && (dtmBirth.getDate() == Number(arrSplit[4]));

                if (dateCheck) {
                    result = true;
                }
            }
            else if (num.length == 18) {
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2),
                    arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'),
                    valnum,
                    nTemp = 0, i;
                regex = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                arrSplit = num.match(regex);
                dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                dateCheck = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
                    && (dtmBirth.getDate() == Number(arrSplit[4]));

                //birth date check
                if (dateCheck) {
                    for (i = 0; i < 17; i++) {
                        nTemp += num.substr(i, 1) * arrInt[i];
                    }
                    valnum = arrCh[nTemp % 11];

                    if (valnum == num.substr(17, 1)) {
                        result = true;
                    }
                }
            }
        }
        return result;
    },"请输入合法的身份证号.");

    /*
     * loadPage : load tpl page to container
     *
     * */
    function loadPage(tpl, container, callBack, cacheData, options) {
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
    }

    /*
     * ajax request
     * */
    function request(option) {
        var result = null,
            async = (option.async === undefined ? true : option.async);
        if (option.loading != false) {
            J.loadingShow();
        }

        $.ajax({
            type:option.type || 'post',
            data:option.data || {},
            url:J.setNoCacheUrl(option.url) || '',
            async:async,
            dataType:option.dataType || 'json',
            beforeSend:function () {
                if (!J.ajaxCount) {
                    J.ajaxCount = 0;
                }
                if (option.loading != false) {
                    J.ajaxCount++;
                }
                if (typeof option.beforeSend == "function") {
                    option.beforeSend();
                }
            },
            success:function (data) {
                J.log("Request Success:" + option.url + " request success");
                result = data;
                if (typeof option.success == 'function') {
                    option.success(data);
                }
            },
            error:function (ex) {
                var msg = "";
                switch (ex.status) {
                    case 0:
                        msg = "服务器已经停止运行，请通知系统管理员检查并解决。";
                        if ($(".ePop-alert").last().text().indexOf(msg) < 0) {
                            J.alert(msg);
                        }
                        break;
                    case 401:
                        window.top.location.href = $$("");
                        break;
                    case 403:
                        break;
                    case 404:
                        break;
                    case 500:
                        msg = decodeURIComponent(ex.getResponseHeader("Error-Message"));
                        if ($(".dialog-alert", document).last().text() != msg) {
                            J.serverError(msg, ex.responseText);
                        }
                        break;
                }
                J.log("Request fail:" + option.url + " request fail，" + ex.message);
                if (typeof option.error == 'function') {
                    option.error(ex);
                }
            },
            complete:function () {
                if (!J.ajaxCount) J.ajaxCount = 0;
                J.ajaxCount > 0 && J.ajaxCount--;

                if (J.ajaxCount <= 0) {
                    J.loadingHide();
                }
                if (typeof option.complete == "function") {
                    option.complete();
                }
            }
        });
        return async == false ? result : null;
    }

    /*
     * btnAccess
     * */
    function btnAccess(data, container) {
        if (!data || !container) return;
        var btnC = container;
        btnC.empty();
        $(data).each(function (i, v) {
            if (v["access"] == undefined) {
                v["access"] = true;
            }
            if (typeof v.access == "function" ? v.access() : v.access) {
                var btn = $("<a class=\"controls-batch-btn\"></a>");
                btn.text(v["text"]).attr("title", v["text"]);
                if (v.icon) {
                    btn.addClass("icon " + v.icon);
                    btn.prepend("<i class=\"batch_" + v.icon + "\"></i>");
                }

                if (typeof v["click"] == "function") {
                    btn.click(function (e) {
                        v["click"].apply(this, arguments);
                    });
                }
                btnC.append(btn);
            }
        });
        $(".controls-batch-btn", btnC).first().addClass("first").end().last().addClass("last");
        $(".controls-batch-btn", btnC).filter(":not(.last)").after("<i class='controls-batch-line'></i>");
    }

    $.extend(J, {
        ajaxCount:0,
        use:seajs.use,
        uid:function () {
            return _uid++;
        },
        uuid:function () {
            var result = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                result += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    result += "-";
            }
            return result;
        },
        startTime:function (name) {
            if (!document.all) console.time(name);
        },
        endTime:function (name) {
            if (!document.all) console.timeEnd(name);
        },
        log:function (msg) {
            if (!document.all) {
                console.log("pageLog>>>>" + msg);
            }
        },
        clearLog:function () {
            if (!document.all) {
                try {
                    console.clear();
                }
                catch (ex) {
                }
            }
        },
        resetPage:function () {
            $("#detail_pop").hide();
        },
        loadingShow:function () {
            var loading = $(".page-loading");
            if (loading.size() > 0) {
                loading.eq(0).show();
            } else {
                $("body").append("<div class=\"page-loading\"><span class=\"text-hide\">加载中，请稍后...</span></div>");
            }
        },
        loadingHide:function () {
            $(".page-loading").fadeOut("fast");
        },
        params:function (page, params) {
            var paramsStr = "";
            for (var key in params) {
                if (params[key] != undefined) paramsStr += "&" + key + "=" + params[key];
            }
            if (page.indexOf("?") >= 0) {
                page += paramsStr;
            }
            else {
                page += "?" + paramsStr.substring(1, paramsStr.length);
            }
            return page;
        },
        queryString:function (key, attr) {
            var result = null;
            attr = attr ? attr : window.queryString;
            if ((!window.queryString) || (!key)) return null;
            if (typeof window.queryString == "string") return window.queryString;
            else {
                for (var i = 0; i < attr.length; i++) {
                    var temp = attr[i].split("=");
                    if (temp[0] == key) {
                        result = temp[1];
                        break;
                    }
                }
            }
            return result;
        },
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
        downLoad:function (api, params) {
            var form = $("<form target=\"_blank\" method=\"post\" action=\"" + api + "\" name=\"downLoad\"></form>");
            for (key in params) {
                form.append("<input type=\"hidden\" name=\"" + key + "\" value=\"" + params[key] + "\"/>");
            }
            $("body").append(form);
            form.submit();
            form.remove();
        },
        setNoCacheUrl:function (url) {
            var random = Math.random();
            if (!url) {
                return "";
            }
            if (url.indexOf("?") >= 0) {
                url += "&rd=" + random;
            } else {
                url += "?rd=" + random;
            }
            url = url.replace(/\/{2}/, '/');
            return url;
        },
        request:request,
        getJson:function (url, type, data) {
            return J.request({
                url:url,
                data:data || {},
                loading:false,
                async:false,
                type:type || "get",
                dataType:"json"
            });
        },
        loadPage:loadPage,
        btnAccess:btnAccess,
        serverError:function (msg, detail) {
            var btns = {};
            btns["确定"] = function () {
                $(this).dialog("close");
            };
            if (msg != detail) {
                btns["错误详细"] = function () {
                    J.form({
                        title:"错误详细",
                        page:"500.html",
                        fullScreen:true,
                        data:{"detail":detail},
                        btn:[
                            {
                                text:"确定",
                                click:function () {

                                }
                            }
                        ]
                    });
                };
            }
            $("<div class='dialog-alert'>" + msg + "</div>").dialog({
                title:"系统消息",
                width:300,
                dialogClass:"",
                minHeight:180,
                modal:true,
                resizable:false,
                buttons:btns,
                close:function () {
                    $(this).closest(".ui-dialog").remove();
                }
            });
        },
        buildFormValue:function (target, data, dataObjectName) {
            if (typeof data != "object") return;
            var obj,
                type,
                value;
            target.find("input,textarea,select").each(function () {
                if ($(this).attr("noreturn")) return;
                var name = $(this).attr("name");
                if (name && data[name.replace(dataObjectName, "")] != undefined) {
                    obj = $(this);
                    type = (obj[0].tagName).toLowerCase();
                    value = data[name.replace(dataObjectName, "")];
                    switch (type) {
                        case "select":
                            var selected = obj.find("option[value=\"" + value + "\"]"),
                                selectList = obj.next(".controls-select");
                            selected.attr("selected", true);
                            if (selectList.size() > 0) {
                                selectList.find(".value").text(selected.text());
                                $(window).resize();
                            }
                            break;
                        case "input":
                            if (obj.attr("type") == "text" || obj.attr("type") == "hidden") {
                                obj.val(value);
                            }
                            else if (obj.attr("type") == "radio") {
                                var temp = target.find("[name=\"" + name + "\"][value=\"" + value + "\"]");
                                if (temp.attr("init")) return;
                                if (temp.size() == 1) {
                                    if (temp.hasClass("read-only")) {
                                        target.find("[name=\"" + name + "\"]").removeAttr("checked").parent().removeClass("checked");
                                        temp.parent().addClass("checked");
                                        temp.attr("checked", true);
                                    }
                                    else {
                                        temp.parent().click();
                                    }
                                    temp.attr("init", true);
                                }
                            }
                            else if (obj.attr("type") == "checkbox") {
                                var tempAttr = value + "";
                                if (tempAttr) tempAttr = tempAttr.split(",");
                                else return;

                                if (target.find("[name=\"" + name + "\"]").eq(0).hasClass("checked")) {
                                    target.find("[name=\"" + name + "\"]").removeAttr("checked").parent().removeClass("checked");
                                }
                                for (var i = 0; i < tempAttr.length; i++) {
                                    var temp = target.find("[name=\"" + name + "\"][value=\"" + tempAttr[i] + "\"]");
                                    if (temp.attr("init")) return;
                                    if (temp.size() > 0) {
                                        if (temp.hasClass("read-only")) {
                                            temp.parent().addClass("checked");
                                            temp.attr("checked", true);
                                        }
                                        else temp.parent().click();
                                        temp.attr("init", true);
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
        }
    });


    $.extend($.fn, {
        /*not support tpl is object here*/
        loadPage:function (tpl, cacheData, callBack) {
            return this.each(function () {
                loadPage(tpl, $(this), callBack, cacheData);
            });
        },
        btnAccess:function (data) {
            return this.each(function () {
                btnAccess(data, $(this));
            });
        },
        /*no select by me ^_^*/
        noSelect:function (p) {
            if (p == null) {
                prevent = true;
            } else {
                prevent = p;
            }

            if (prevent) {
                return this.each(function () {
                    if ($.browser.msie || $.browser.safari) {
                        $(this).bind('selectstart', function () {
                            return false;
                        });
                    } else if ($.browser.mozilla) {
                        $(this).css('MozUserSelect', 'none');
                        $('body').trigger('focus');
                    } else if ($.browser.opera) {
                        $(this).bind('mousedown', function () {
                            return false;
                        });
                    } else {
                        $(this).attr('unselectable', 'on');
                    }
                });
            } else {
                return this.each(function () {
                    if ($.browser.msie || $.browser.safari) {
                        $(this).unbind('selectstart');
                    } else if ($.browser.mozilla) {
                        $(this).css('MozUserSelect', 'inherit');
                    } else if ($.browser.opera) {
                        $(this).unbind('mousedown');
                    } else {
                        $(this).removeAttr('unselectable', 'on');
                    }
                });
            }
        },
        /*get form data*/
        getFormData:function () {
            var result = {},
                $this = $(this),
                form = $(this).find("input,select,textarea");
            form.each(function () {

                var name = $(this).attr("name"),
                    type = $(this).attr("type"),
                    value = "",
                    size = 0;

                if (((type == "checkbox" || type == "radio") && result[name] != undefined) || $(this).attr("noreturn") != undefined) {
                    size = $this.find("[name=\"" + name + "\"]").size();
                }

                switch (($(this)[0].tagName).toLowerCase()) {
                    case "input":
                        if (type == "text" || type == "hidden" || type == "password" || type == undefined) {
                            value = $(this).val();
                        } else if (type == "radio") {
                            var temp = $this.find("input[type=radio][name=\"" + name + "\"]:checked");
                            if ($(this).attr("onlyvalue") == undefined || $(this).attr("onlyvalue") == "true")
                                value = temp.val();
                            else value = temp.val() + J.config.valueSeparated + $.trim(temp.parent().text());
                        } else if (type == "checkbox") {
                            if ($(this).attr("onlyvalue") == undefined || $(this).attr("onlyvalue") == "true") {
                                value = $this.find("input[type=checkbox][name=\"" + name + "\"]:checked").map(function () {
                                    return $(this).val();
                                }).get().join(",");
                            } else {
                                value = $this.find("input[type=checkbox][name=\"" + name + "\"]:checked").map(function () {
                                    return $(this).val() + J.config.valueSeparated + $.trim($(this).parent().text());
                                }).get().join(J.config.valueItemSeparated);
                            }

                        }
                        break;
                    case "select":
                        if ($(this).attr("onlyvalue") == undefined || $(this).attr("onlyvalue") == "true") {
                            value = $(this).val();
                        } else {
                            value = $(this).val() + J.config.valueSeparated + $(this).find("option:selected").text();
                        }
                        break;
                    case "textarea":
                        value = $(this).val();
                        break;
                }

                if (name) {
                    if (size > 1 && type != "checkbox" && type != "radio") {
                        if (typeof result[name] != "object") {
                            result[name] = [];
                        }
                        result[name][result[name].length] = $.trim(value);
                    } else {
                        result[name] = $.trim(value);
                    }
                }

            });
            return result;
        },
        selectInit:function (opts) {
            $.extend({
                data:[],
                valueKey:"flowId",
                textKey:"name"
            }, opts || {});
            return this.each(function () {
                var options = $(opts["data"]).map(function (i, v) {
                    return "<option value='" + v[opts["valueKey"]] + "'>" + v[opts["textKey"]] + "</option>";
                }).get().join("");
                $(this).append(options);
            });
        }
    });

    J.form = function (options) {
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
    };

    J.popResize = function (target) {
        var w = $(window).width(),
            h = $(window).height(),
            dialog = target.closest(".ui-dialog"),
            dialogH = dialog.height();
        if (dialogH > h) {
            var newH = h - $(">.ui-dialog-titlebar", dialog).outerHeight() - $(">.ui-dialog-buttonpane", dialog).outerHeight()-10;
            target.css("height", newH);
        }
    };

    /*
     * message, callback
     * */
    J.alert = function (message, callback) {
        J.resetPage();
        $("<div class='dialog-alert'>" + message + "</div>").dialog({
            title:"系统消息",
            width:300,
            dialogClass:"aa",
            minHeight:180,
            modal:true,
            resizable:false,
            buttons:{
                "确定":function () {
                    var rs;
                    if (typeof callback == "function") {
                        rs = callback.call(this);
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
    };

    /*
     * message, title, onConfirm, onCancel
     * */
    J.confirm = function (message, onConfirm, onCancel, title) {
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
    };

    J.events = function () {
        var detail_pop_div = $("#detail_pop");
        //document click event listener
        $(document).bind("click", function (el) {
            var eleTarget = $(el.target),
                attr = eleTarget.attr("data-flexi"),
                ipts, ipt_all, grid_table;

            if (attr === 'flex-checkbox') {
                grid_table = eleTarget.closest('table');
                ipts = grid_table.find('input:enabled');
                ipt_all = grid_table.parent().prev().prev().find(':checkbox:eq(0)');
                if (grid_table[0].p.single_check) {
                    if (el.target.checked) {
                        ipts.not(eleTarget).filter(':checked').attr('checked', false);
                    }
                } else {
                    if (el.target.checked) {
                        if (ipts.length == ipts.filter(':checked').length) {
                            ipt_all.attr('checked', true);
                        } else {
                            ipt_all.attr('checked', false);
                        }
                    } else {
                        ipt_all.attr('checked', false);
                    }
                }
                detail_pop_div.hide();
            } else if (attr === 'flex-checkbox-all') {
                ipt_all = eleTarget;
                grid_table = ipt_all.closest('.hDiv').next().next().find('table:eq(0)');
                ipts = grid_table.find('input:enabled');
                if (grid_table[0].p.single_check) {
                    el.preventDefault();
                } else {
                    if (el.target.checked) {
                        ipts.attr('checked', true);
                    } else {
                        ipts.attr('checked', false);
                    }
                }
                detail_pop_div.hide();
            }

            if (!(eleTarget.parents("table").size() > 0 && eleTarget.parents(".bDiv").size() > 0)) {
                detail_pop_div.hide();
            }
        });
    };

    //messenger
    var Messenger = require("messenger");
    var messenger = new Messenger(window.messengerName || "messengerName");
    var messengerFunList = {};

    //监听消息
    messenger.listen(function (msg) {
        try {
            var o = $.parseJSON(msg);

            if (o["MessageId"] && typeof messengerFunList[o["MessageId"]] == "function") {
                messengerFunList[o["MessageId"]].call(o, o["Content"]);
            }
        } catch (e) {

        }
    });

    $.extend(J,{
        listenMessage:function(MessageId, fun){
            if (messengerFunList[MessageId] && messengerFunList[MessageId] === fun) {
                return;
            }
            messengerFunList[MessageId] = fun;
        },
        sendMessage:function(opts){
            /*
             * MessageId-消息id
             * DoubleMark-单双向标识 1:单向标识,2双向标识
             * Content-消息内容 json
             * MessageUUID-消息UUID 双向通信返回时，将MessageUUID作为MessageId
             * */
            var sendObj = {
                MessageId:opts["MessageId"],
                DoubleMark:opts["DoubleMark"],
                Content:opts["Content"],
                MessageUUID:opts["MessageUUID"]
            };
            messenger.addTarget(opts["targetWindow"], opts["targetName"]);
            if (opts["DoubleMark"] == 2 && !opts["MessageUUID"]) {
                J.alert("错误：双向通信需要指定MessageUUID！<br/>messageId:" + opts["MessageId"]);
                return;
            }
            if (typeof opts["callBack"] == "function") {
                J.listenMessage(opts["MessageUUID"], opts["callBack"]);
            }
            messenger.targets[opts["targetName"]].send(JSON.stringify(sendObj));
        }
    });

    window.onload = function () {

        J.events();
    };
});