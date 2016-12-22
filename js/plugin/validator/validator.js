/*******************************************************************************
 * validator.js -  validator
 * Copyright (C) 2013
 *
 * @Author Skiny
 * @Email Skiny@iwebdever.com
 * @UpdateTime (2013-10-05)
 *******************************************************************************/

    (function (window, undefined) {
        var validator = function (option) {
            var o = this;
            o.version = "1.0";
            o.author = "skiny";
            o.contact = "qq:408889769";
            o.setting = {
                target:"",
                submitBtn:"",
                targetId:"",
                submitBtnId:"",
                msgDirection:"right",
                keyup:function () {
                },
                msgShow:true,
                always:false,
                fields:[]
            };
            o.rules = {};
            o.messages = {};
            o.tips = {};
            o.passed = {};
            o.validateElement = {};
            o.extend(option);
            o.init();
        };
        validator.prototype = {
            extend:function (option) {
                if (option == null || typeof option != "object") return;
                for (key in option) {
                    if (this.get(key) != undefined) this.set(key, option[key]);
                }
            },
            get:function (name) {
                return this.setting[name];
            },
            set:function (name, value) {
                this.setting[name] = value;
            },
            getDefaults:function () {
                if (!validator.defaults) {
                    validator.defaults = {"rules":{}, "messages":{}};
                }
                return validator.defaults;
            },
            addRules:function (rules) {
                if (typeof rules != "object") return;

                var name = "",
                    rule = "",
                    message = "";

                for (var i = 0; i < rules.length; i++) {
                    name = rules[i].name;
                    rule = rules[i].rule;
                    message = rules[i].message;

                    if (rule && this.getDefaults().rules[name] == undefined) this.getDefaults().rules[name] = rule;
                    if (message && this.getDefaults().messages[name] == undefined) this.getDefaults().messages[name] = message;
                }
            },
            updateRule:function (rule, value) {
                if (this.getDefaults().rules[rule] != undefined) this.getDefaults().rules[rule] = value;
            },
            updateMessage:function (rule, value) {
                if (this.getDefaults().messages[rule] != undefined) this.getDefaults().messages[rule] = value;
            },
            result:function () {
                var o = this,
                    result = true;

                o.validateElement.each(function () {
                    var label = ($(this)[0].tagName).toLowerCase();
                    if (((label == "input") && ($(this).attr("type") == "text" || $(this).attr("type") == "password" || $(this).attr("type") == "hidden" || $(this).attr("type") == "file")) || (label == "textarea")) {
                        $(this).blur();
                    }
                    else o.controlValidate($(this), label);
                });

                for (var key in o.passed) {
                    result = result && o.passed[key];
                }
                if (o.get("target").find(".validator-input-error").size() > 0) result = false;
                return result;
            },
            getRule:function (name) {
                /*var o=this,
                 result=null;
                 return result;*/
            },
            getMessage:function (name) {
                var o = this,
                    result = "";
                if (o.messages[name] != undefined) {
                    result = o.messages[name];
                }
                else if (this.getDefaults().messages[name] != undefined) {
                    result = this.getDefaults().messages[name];
                }
                return result;
            },
            guid:function () {
                var result = "";
                for (var i = 1; i <= 32; i++) {
                    var n = Math.floor(Math.random() * 16.0).toString(16);
                    result += n;
                    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                        result += "-";
                }
                return result;
            },
            hide:function (target) {
                var msg = $(".validator-msg[mark=" + target.attr("mark") + "]");
                if (msg.size() == 1) msg.hide();
            },
            show:function (target, type) {
                var minLength = target.attr("minlength"),
                    maxLength = target.attr("maxlength"),
                    inputLength = target.val().length,
                    message = target.attr("validator-msg");

                minLength = (minLength == undefined ? "" : minLength);
                maxLength = (maxLength == undefined ? "" : maxLength);
                inputLength = (inputLength == undefined ? "" : inputLength);

                message = message.replace(/{minlength}/gi, minLength);
                message = message.replace(/{maxlength}/gi, maxLength);
                message = message.replace(/{inputlength}/gi, inputLength);

                var o = this,
                    mark = target.attr("mark"),
                    obj = $(".validator-msg[mark=" + mark + "]"),
                    offset = target.offset(),
                    x = offset.left,
                    y = offset.top,
                    msgDirection = target.attr("msgDirection") ? target.attr("msgDirection") : o.get("msgDirection");

                if (obj.size() == 0) {
                    mark = o.guid();
                    target.attr("mark", mark);
                    obj = $("<div class=\"validator-msg" + ((msgDirection != "left") ? " msg-" + msgDirection : "") + "\" mark=\"" + mark + "\">" +
                        "<div class=\"msg-content\"></div>" +
                        "<div class=\"msg-arrow-outer\"></div>" +
                        "<div class=\"msg-arrow\"></div>" +
                        "</div>");
                    $("body").append(obj);
                }

                //msg
                obj.find(".msg-content").text(message);

                //msg direction
                switch (msgDirection) {
                    case "right":
                        x += target.outerWidth() + parseInt(target.css("margin-left").replace("px")) + parseInt(target.css("margin-right").replace("px")) + 4;
                        y -= (obj.outerHeight() - target.outerHeight()) / 2;
                        break;
                    case "left":
                        break;
                    case "top":
                        break;
                    case "bottom":
                        y += target.outerHeight() + 7;
                        break;

                }

                //position
                obj.css({"top":y + "px", "left":x + "px"});
                obj.addClass("validator-error");
                obj.css("visibility", "visible");

                //show
                $(".validator-msg[mark=" + mark + "]").show();
            },
            error:function (target, message) {
                target.attr("validator-msg", message).addClass("validator-input-error");
                if (this.get("msgShow") == true) this.show(target, "error");
                else target.attr("validator-msg", message);
            },
            success:function (target) {
                target.removeClass("validator-input-error");
                $(".validator-msg[mark=" + target.attr("mark") + "]").remove();
                target.removeAttr("mark").removeAttr("validator-msg");
            },
            setFields:function () {
                var o = this,
                    field = "";
                if (typeof o.get("fields") != "object") return;

                //label config
                o.get("target").find("[tips],[message]").each(function () {
                    var name = $(this).attr("name"),
                        tips = $(this).attr("tips"),
                        message = $(this).attr("message");

                    if (tips && o.tips[name] == undefined) o.tips[name] = $(this).attr("tips");
                    if (message && o.messages[name] == undefined) o.messages[name] = $(this).attr("message");

                    $(this).removeAttr("tips");
                    $(this).removeAttr("message");
                });

                //json config
                $(o.get("fields")).each(function (i, v) {
                    field = o.get("target").find("[name=" + v.field + "]");
                    if (field.size() > 0 && v.field != undefined) {
                        o.passed[v.field] = false;
                        if (v.required != undefined) field.attr("required", v.required);
                        if (v.rule != undefined) {
                            field.attr("rule", v.rule);
                            if (typeof v.rule == "object") o.rules[v.field] = v.rule;
                        }
                        if (v.message != undefined) o.messages[v.field] = v.message;
                        if (v.tips != undefined) o.tips[v.field] = v.tips;
                        if (v.minLength != undefined) field.attr("minlength", v.minLength);
                        if (v.maxLength != undefined) field.attr("maxlength", v.maxLength);
                        if (v.authFunc != undefined && typeof v.authFunc == "function") {
                            var auth = v.authFunc.toString(),
                                valueName = auth.substring(0, auth.indexOf("{")),
                                functionStr = $.trim(auth.substring(auth.indexOf("{") + 1, auth.lastIndexOf("}")));
                            valueName = $.trim(valueName.substring(valueName.indexOf("(") + 1, valueName.lastIndexOf(")")));
                            if (valueName != "") field.attr("valuename", valueName);
                            if (functionStr != "") field.attr("authfunc", functionStr);
                        }
                    }
                });
            },
            showControlMsg:function () {

            },
            controlValidate:function (target, label) {
                var o = this,
                    msg = target.attr("validator-msg"),
                    name = "";

                msg = (msg ? msg : "");

                if (label == "div") {
                    //checkbox
                    if (target.find(".controls-checkbox").size() > 0) {
                        name = target.find(".controls-checkbox").last().find("[type=checkbox]").attr("name");
                        if (target.is(":hidden"))
                            o.passed[name] = true;
                        else if (target.find("[name][type=checkbox]:checked").size() == 0) {
                            o.passed[name] = false;
                            J.alert(msg);
                        }
                        else o.passed[name] = true;
                        return;
                    }

                    //radio
                    if (target.find(".controls-radio").size() > 0) {
                        name = target.find(".controls-radio").last().find("[type=radio]").attr("name");
                        if (target.is(":hidden"))
                            o.passed[name] = true;
                        else if (target.find("[name][type=radio]:checked").size() == 0) {
                            o.passed[name] = false;
                            J.alert(msg);
                        }
                        else o.passed[name] = true;
                        return;
                    }
                }
                else if (label == "select") {
                    msg = (msg ? msg : o.getMessage("required"));
                    name = target.attr("name");
                    if (target.next(".controls-select").is("hidden")) {
                        o.passed[name] = true;
                    }
                    else if (target.val() == "") {
                        o.passed[name] = false;
                        target.next(".controls-select").addClass("validator-input-error");
                    }
                    else {
                        o.passed[name] = true;
                        target.next(".controls-select").removeClass("validator-input-error");
                    }
                }
            },
            validate:function (target) {
                var o = this,
                    name = target.attr("name"),
                    messageName = "",
                    message = "",
                    valueName = target.attr("valuename"),
                    value = ($.trim(target.val()) ? target.val() : ""),
                    required = target.attr("required"),
                    rule = target.attr("rule"),
                    minLength = target.attr("minlength"),
                    maxLength = target.attr("maxlength"),
                    authFunc = target.attr("authfunc"),
                    goOn = true,
                    requiredFlag = true,
                    ruleFlag = true,
                    minLengthFlag = true,
                    maxLengthFlag = true,
                    authFuncFlag = true;

                //remove the spaces
                target.val(value);

                if (target.is(":hidden") && o.get("always") == false) {
                    this.success(target);
                    this.passed[name] = true;
                    return;
                }

                //required
                if (required) {
                    if (value == "") {
                        requiredFlag = false;
                        messageName = "required";
                    }
                    else requiredFlag = true;
                }
                else if (value != "") goOn = true;
                else goOn = false;

                //rule
                if (goOn && rule && (requiredFlag)) {
                    var temp = name;
                    if (typeof rule == "string") {
                        if (o.messages[name] == undefined) temp = rule;
                        rule = o.getDefaults().rules[rule];
                    }

                    if (rule) {
                        if (!rule.test(value)) {
                            ruleFlag = false;
                            messageName = temp;
                        }
                        else ruleFlag = true;
                    }
                }

                //minLength
                if (goOn && minLength && (requiredFlag && ruleFlag)) {
                    if (value.length < parseInt(minLength)) {
                        minLengthFlag = false;
                        messageName = "minLength";
                    }
                    else minLengthFlag = true;
                }

                //maxLength
                if (goOn && maxLength && (requiredFlag && ruleFlag && minLengthFlag)) {
                    if (value.length > parseInt(maxLength)) {
                        maxLengthFlag = false;
                        messageName = "maxLength";
                    }
                    else maxLengthFlag = true;
                }

                //auth funciton exec
                function authFuncExec() {
                    valueName = valueName == "" ? "value" : valueName;
                    var authFunctionResult = "";
                    if (authFunc.indexOf("B.") >= 0) {
                        authFunctionResult = window["B"][authFunc.replace("B.", "")](value, target);
                    }
                    else {
                        try {
                            authFunctionResult = new Function(valueName, authFunc)(value);
                        }
                        catch (ex) {

                        }
                    }

                    if (typeof authFunctionResult == "object") {
                        if (authFunctionResult.result) {
                            authFuncFlag = true;
                            o.get("target").find("[authfunc=\"" + authFunc + "\"]").each(function () {
                                $(this).removeAttr("validator-msg").removeClass("validator-input-error");
                            });
                        }
                        else {
                            authFuncFlag = false;
                            message = ((authFunctionResult.message == undefined) ? "" : authFunctionResult.message);
                        }
                    }
                    else {
                        authFuncFlag = false;
                        messageName = "authFunc";
                    }
                }

                //authFunc
                if (goOn && authFunc && (requiredFlag && ruleFlag && minLengthFlag && maxLengthFlag)) {
                    if (target.attr("authfunc")) authFuncExec();
                }

                //message and result handle
                if (goOn == true && !(requiredFlag && ruleFlag && minLengthFlag && maxLengthFlag && authFuncFlag)) {
                    if (messageName != "" && message == "") message = o.getMessage(messageName);
                    o.error(target, message);
                    o.passed[name] = false;
                }
                else {
                    o.success(target);
                    o.passed[name] = true;
                }

            },
            bindEvent:function () {
                var o = this,
                    label = "";

                o.validateElement.each(function () {
                    label = ($(this)[0].tagName).toLowerCase();
                    if (((label == "input") &&
                        ($(this).attr("type") == "text" || $(this).attr("type") == "password" || $(this).attr("type") == "hidden" || $(this).attr("type") == "file")) ||
                        (label == "textarea")
                        ) {
                        //click event
                        $(this).unbind("click.validator").bind("click.validator", function () {
                            if ($(this).attr("validator-msg") != undefined) o.show($(this));
                        });

                        //keydown
                        $(this).unbind("keyup.validator").bind("keyup.validator", function () {
                            if ($(this).attr("maxlength") != undefined) {
                                var length = parseInt($(this).attr("maxlength"));
                                if ($(this).val().length >= length) {
                                    $(this).attr("validator-msg", o.getMessage("maxLength"));
                                    o.show($(this));
                                }
                                else {
                                    $(this).removeAttr("validator-msg");
                                    o.hide($(this));
                                }

                            }
                        });

                        //focus event
                        $(this).unbind("focus.validator").bind("focus.validator", function () {
                            if ($(this).attr("validator-msg") != undefined) o.show($(this));
                        });

                        //blur event
                        $(this).unbind("blur.validator").bind("blur.validator", function () {
                            o.validate($(this));
                            if (o.get("msgShow") == false && $(this).attr("validator-msg") != undefined) o.hide($(this));
                        });
                    }
                });
            },
            init:function () {
                var o = this;

                //get html object
                if (o.get("targetId") != "") o.set("target", $("#" + o.get("targetId") + ""));
                if (o.get("submitBtnId") != "") o.set("submitBtn", $("#" + o.get("submitBtnId") + ""));
                if (o.get("target") == "") o.set("target", $("body"));

                //form onsubmit
                if (typeof o.get("submitBtn") != "object") {
                    o.get("target").find("form").unbind("submit").bind("submit", function () {
                        return o.result();
                    });
                }
                else o.get("submitBtn").unbind("click").bind("click", function () {
                    return o.result();
                });

                //set element
                o.validateElement = o.get("target").find("[rule],[required],[minlength],[maxlength],[authfunc]");

                //set fileds
                o.setFields();

                //update element
                o.validateElement = o.get("target").find("[rule],[required],[minlength],[maxlength],[authfunc]");

                //bind event
                o.bindEvent();
            }
        };

        $.fn.validator = function (option) {
            if (option == undefined) option = {};
            option.target = $(this);
            $(this).data(new validator(option));
        };

        $.fn.validatorUpdate = function (option) {
            var obj = $(this).data();

            if (obj && typeof obj.result == "function") {
                obj.passed = {};
                return obj.init();
            }
        };

        $.fn.validatorResult = function () {
            var obj = $(this).data();

            if (obj && typeof obj.result == "function") {
                return obj.result();
            }
            else return true;
        };

        validator.defaults = {
            rules:{
                integer:/^[1-9]\d*$/,
                number:/^\d*$/,
                numberNO:/^[1-9]([0-9])*$/,
                decimal:/^[0-9]+([.]{1}[0-9]+){0,1}$/,
                decimal18:/^[0-9]{1,14}([.]{1}[0-9]{0,2}){0,1}$/, /*最大16位，18位保存有损失精度*/
                decimal16:/^[0-9]{1,14}([.]{1}[0-9]{0,2}){0,1}$/, /*最大16位，18位保存有损失精度*/
                money:/^(([1-9]+\d*)|([1-9]+\d*\.\d{1,2}))$/,
                hours:/^((\d{1,4}(\.\d){0,1}))$/,
                letters:/^[A-Za-z]+$/,
                chars:/^[A-Za-z0-9_]+$/,
                chinese:/^[\u4e00-\u9fa5]{0,}$/,
                email:/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
                telphone:/^(13|15|18|17)\d{9}$/,
                idcard:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                password:/^(?=.*[0-9].*)(?=.*[a-zA-Z].*).{6,20}$/,
                phone:/^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/,
                contactNumber:/(^(13|15|18|17)\d{9}$)|(^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
                url:new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$"),
                mon:/^((\d{1,8})|(\d{1,8}\.\d{1,2}))$/,
                chineseLetterNum:/^(?!\d)[\(\)（）a-zA-Z0-9_\u4e00-\u9fa5]*$/,
                unnormal:/^(?!.*?[\|\\\/:\*\?<>\|]).*$/,
                filePath:/(^[a-zA-Z]\:\\([a-zA-Z0-9_\u4E00-\u9FA5]+\\)+$)|(^[a-zA-Z]\:\\$)/,
                training:/(?!^0$)(?!^00$)(?!^000$)(?!^0000$)(?!^0\.0?0$)(?!^00\.0?0$)(?!^000\.0?0$)(?!^0000\.0?0$)^(([0-9]\d{0,3})|([0-9]\d{0,3}\.\d{1,2}))$/,
                monContract:/^(([1-9]\d{0,9})|([1-9]\d{0,9}\.\d{1,2}))$/,
                inputAwak:/^([1-9]\d{0,3}|10000)$/,
                //monCarmgt:/^(([0-9]\d{0,8})|([0-9]\d{0,8}\.\d{1,2}))$/,
                monCarmgt:/(?!^0$)(?!^00$)(?!^000$)(?!^0000$)(?!^00000$)(?!^000000$)(?!^0000000$)(?!^00000000$)(?!^000000000$)(?!^0\.0?0$)(?!^00\.0?0$)(?!^000\.0?0$)(?!^0000\.0?0$)(?!^00000\.0?0$)(?!^000000\.0?0$)(?!^0000000\.0?0$)(?!^00000000\.0?0$)(?!^000000000\.0?0$)^(([0-9]\d{0,8})|([0-9]\d{0,8}\.\d{1,2}))$/,
                phoneOrTelphone:/^(((13|15|18|17)\d{9})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/,
                //new RegExp('^((?![<>*:"\\\?/\*]).)*$',"g")
            },
            messages:{
                integer:"请输入正整数。",
                required:"此字段为必填项。",
                numberNO:"请输入非零整数",
                minLength:"至少需要输入【{minLength}】个字符，已输入【{inputlength}】个字符。",
                maxLength:"最多允许输入【{maxLength}】个字符，已输入【{inputlength}】个字符。",
                number:"请输入正整数。",
                decimal:"请输入整数或者小数。",
                decimal18:"请输入最多14位整数和2位小数",
                decimal16:"请输入最多14位整数和2位小数",
                money:"请输入金额，精确到小数点后两位。",
                hours:"请输入小于10000数字，精确到小数点后一位。",
                letters:"请输入由字母(不区分大小写)组成的字符串。",
                chars:"请输入由字母(不区分大小写)、数字、下划线组成的字符串。",
                chinese:"请输入中文。",
                email:"请输入有效的电子邮箱地址。",
                telphone:"请输入有效的手机号码。",
                idcard:"请输入有效的身份证号码。",
                phone:"请输入有效的电话号码。",
                url:"请输入有效的网址。",
                authFunc:"自定义验证函数有错误，请检查。",
                contactNumber:"请输入正确的联系电话。",
                password:"密码长度为6-20位，必须同时具备字母和数字。",
                mon:"请输入金额，整数位数最多8位，精确到小数点后两位。",
                chineseLetterNum:"只能输入汉字、字母、数字、下划线、括号，且不能以数字开头。",
                unnormal:"不能输入非法字符.",
                filePath:"请输入正确的文件路径",
                training:"课程学时范围:大于零且正整数最多4位，小数最多2位",
                monContract:"请输入金额，整数位数最多10位，精确到小数点后两位",
                inputAwak:"请输入0-10000的整数",
                monCarmgt:"请输入正确范围:大于零，整数位数最多9位，精确到小数点后两位",
                phoneOrTelphone:"请输入有效的电话号码。"
            }
        };

        //window
        window.validator = validator;
    })(window);
