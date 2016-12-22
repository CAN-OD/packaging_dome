/**
 * Created by 123 on 2016/8/5.
 */
// (function (window, undefined) {
define(['packaging'],function(J){
    var dacAlert = function (option) {
        var o = this;
        o.version = "1.0";
        o.setting = {
            title: "系统消息",
            type: "alert",
            content: "",
            url: "",
            width: "auto",
            height: "auto",
            btnAlign: "right",
            msgClass: "",
            id: "",
            cacheData: {},
            closeDelay: 0,
            move: false,
            btn: [{
                text: "确定", click: function (form) {
                }
            }],
      
            callBack: function () {
            },
            init: function () {
            },
            onMove: function () {
            },
            onClose: function () {
            }
        };
        o.extend(option);
        o.init();
    };
    dacAlert.prototype = {
        init: function () {
            this.build();
        },
        extend: function (option) {
            if (option == null || typeof option != "object") return;
            for (key in option) {
                if (this.get(key) != undefined) this.set(key, option[key]);
            }
        },
        get: function (name) {
            return this.setting[name];
        },
        set: function (name, value) {
            this.setting[name] = value;
        },
        setCenter: function (container) {
            var myPop = container.find(".alert-pop"),
                marginTop,
                marginLeft,
                w = $(window).width(),
                h = $(window).height();

            if (this.get("type") != "alert") {
                w = (myPop.width() > w) ? (w - 2) : myPop.width();
                h = (myPop.height() > h) ? (h - 2) : myPop.height();
                myPop.width(w + "px");
                myPop.height(h + "px");
                h = h - (this.get("btn").length > 0 ? 100 : 40);
                myPop.find(".alert-body").height(h + "px");
                if (dac.hasScroll(myPop.find(".alert-body")) || this.get("btnAlign") == "center") myPop.find(".alert-footer").addClass("footer-center");
            }
            marginTop = myPop.height() / 2;
            marginLeft = myPop.width() / 2;

            marginTop = (this.get("type") == "alert" ? (marginTop + 50) : marginTop);

            myPop.css({"margin-top": "-" + (marginTop + 2) + "px", "margin-left": "-" + marginLeft + "px"});
        },
        close: function () {
            this.container.remove();
        },
        setPosition:function(container,position){
            switch(position){
                case "bottom_right":
                    container.find(".ePop-pop").css({"right":"3px","bottom":"0px","top":"auto","left":"auto"});
                    break;
                case "bottom_left":
                    break;
            }
        },
        build: function () {
            var o = this,
                container = $("<div class=\"alert-container\">" +
                    "<div class=\"alert-mask\"></div>" +
                    "<div class=\"alert-pop\">" +
                    "<div class=\"alert-header\"><span class=\"alert-title\"></span><span class=\"alert-close\" title=\"关闭该窗口\"></span></div>" +
                    "<div class=\"alert-body\"></div>" +
                    "<div class=\"alert-footer\"></div>" +
                    "</div>" +
                    "</div>"),
                zIndex = 500 + $(".alert-container").size();
            this.container = container;
            if (o.get("id")) container.attr("id", o.get("id"));
            container.css("z-index", zIndex);
            //title
            container.find(".alert-title").text(o.get("title"));
            //close
            container.find(".alert-close").click(function () {
                if (typeof o.get("onClose") == "function") {
                    if (o.get("onClose")(container) != false) $(this).parents(".alert-container").remove();
                }
                else $(this).parents(".alert-container").remove();
            });
            container.find(".alert-close").mousedown(function () {
                return false;
            });
            //move
            if (o.get("move") == true) {
                var dragging = false,
                    iX = 0,
                    iY = 0,
                    mX = 0,
                    mY = 0,
                    header = container.find(".alert-header");

                header.css("cursor", "move").mousedown(function (e) {
                	$(".validator-msg").hide();
                    //container.find(".alert-pop").css({"opacity":"0.8"});
                    //container.find(".alert-body, .alert-footer").css("visibility","hidden");
                    if (typeof o.get("onMove") == "function") o.get("onMove")($(this).parent());
                    dragging = true;
                    var offset = $(this).offset();
                    iX = e.clientX - offset.left;
                    iY = e.clientY - offset.top;

                    mX = $(window).width() - $(this).parents(".alert-pop").width();
                    mY = $(window).height() - $(this).parents(".alert-pop").height();
                    this.setCapture && this.setCapture();
                    e.preventDefault();
                    return false;
                });

                $(document).off("mousemove." + zIndex).on("mousemove." + zIndex, function (e) {
                    if (dragging) {
                        var oX = e.clientX - iX,
                            oY = e.clientY - iY;

                        //min
                        oX = (oX < 0) ? 0 : oX;
                        oY = oY < -2 ? -2 : oY;

                        //max
                        oX = oX > mX ? mX : oX;
                        oY = oY > mY ? mY : oY;

                        container.find(".alert-pop").css({
                            "left": oX + "px",
                            "top": oY + "px",
                            "margin-left": "auto",
                            "margin-top": "auto"
                        });
                  
                        return false;
                    }
                });
                $(document).off("mouseup." + zIndex).on("mouseup." + zIndex, function (e) {
                    dragging = false;
                    header[0].releaseCapture && header[0].releaseCapture();
                    e.cancelBubble = true;
                    //container.find(".alert-pop").css({"opacity":"1"});
                    //container.find(".alert-body, .alert-footer").css("visibility","visible");
                });
            }

            //body
            container.find(".alert-body").addClass(" alert-" + o.get("type"));
            if (typeof o.get("init") == "function") {
                if (o.get("type") == "iframe")
                    o.get("init")(container.find("iframe"));
                else
                    o.get("init")(container.find(".alert-body"));
            }
            //build body by type
            switch (o.get("type")) {
                case "alert":
                    var msgClass = o.get("msgClass");
                    if (!msgClass) msgClass = "success";
                    container.find(".alert-body").html(o.get("content"));
                    break;
                case "url":
                    var href = J.locationHref()+o.get("content");
                    if (href && href.indexOf(".html") > 0 || href && href.indexOf(".jsp") > 0) {
                        $.ajax({
                            url: href,
                            type: "GET",
                            success: function (d) {
                            	/*window.$tagert=$('.tab-content').children(".tab-list.active");*/
                            	$.fn.getPageData=function(){
                                	return o.get("cacheData");
                                };
                            
                                o.setting.content = d;
                          
                                container.find(".alert-body").html(o.get("content"));
                               
                               
                                o.setCenter(container);
                            }, error: function (d) {
                                container.find(".alert-body").html(o.get("content"));
                            }
                        });
                    } else {
                        container.find(".alert-body").html(o.get("content"));
                    }
                    break;
                case "popup":
                    container.find(".ePop-body").html(o.get("content"));
                    break;
            }

            //btn build
            $(o.get("btn")).each(function (i, v) {
                var btn = $("<button class=\"btn " + (v.sureBtn ? "btn-primary" : "btn-default") + "\">" + v.text + "</button>");
                btn.bind("click", function () {
                
                    if (typeof v.click == "function") {
                        var obj = $(this).parents(".alert-container").find(".alert-body");
                        if (o.get("type") == "iframe")
                            obj = $(this).parents(".alert-container").find("iframe").contents();
                        if (v.click(obj) != false)
                            $(this).parents(".alert-container").remove();
                    }
                    else $(this).parents(".alert-container").remove();
                }).bind("mousedown", function () {
                    $(this).addClass("mousedown");
                }).bind("mouseup mouseleave", function () {
                    $(this).removeClass("mousedown");
                });
                container.find(".alert-footer").append(btn);
            });
            if (o.get("btn").length == 0) container.find(".alert-footer").remove();
            if (o.get("type") == "popup") {
                container.find(".alert-mask").remove();
                o.setPosition(container, "bottom_right");
                $("body").append(container);
                container.css({
                    "height": container.find(".alert-pop").height() + "px",
                    "width": container.find(".alert-pop").width() + "px",
                    "display": "none",
                    "position": "relative",
                    "right": "0",
                    "bottom": "0"
                });
                container.fadeIn("slow");
                var s = setTimeout(function () {
                    container.fadeOut("slow", function () {
                        $(this).remove();
                    });
                }, o.get("closeDelay"));
                container.find(".alert-pop").bind("mouseenter", function () {
                    clearTimeout(s);
                });
                container.find(".alert-pop").bind("mouseleave", function () {
                    s = setTimeout(function () {
                        container.fadeOut("slow", function () {
                            $(this).remove();
                        });
                    }, o.get("closeDelay"));
                });
            }
            else if (o.get("type") == "alert" || o.get("type") == "html") {
                $("body").append(container);
                // console.log(container)
                o.setCenter(container);
            }
            else $("body").append(container);
        },
    };
    window.dacAlert = dacAlert;

});
// })(window);
