/* eslint-disable  */
// ui自动化测试需要引入的js库

(async function (win) {
  var ua = window.navigator.userAgent.toLocaleLowerCase(); // 当前浏览器
  var isKdeNative =
    (/from:esalesapp/.test(ua) && !/_platform:openharmonyos_/.test(ua)) ||
    /from:ehomeapp/.test(ua) ||
    /from:lncs-cgo/.test(ua);
  var scripts = document.getElementsByTagName("script");
  var isOtherNative = [...scripts].some((script) => {
    var currentScriptUrl = script.getAttribute("src");
    return (
      /ui\-test\.js/.test(currentScriptUrl) &&
      /platform=app/.test(currentScriptUrl)
    );
  });
  var isNative = isKdeNative || isOtherNative;
  var isKdeNativeUitest = isNative && ua.includes("autouitest");
  var uaautoUITestRun = /autoUITestRun/.test(navigator.userAgent);
  var uaautoUITest = !uaautoUITestRun && /autoUITest/.test(navigator.userAgent);
  console.log(
    "执行ui-test.js中",
    isKdeNativeUitest,
    window.self !== window.top,
    uaautoUITestRun,
    uaautoUITest
  );

  function uiTestDOMContentLoaded() {
    var longClick = 0;

    var origin = "*"; // iframe的父级window的域名
    // finalTag;   // 拼接类名选择器的终点标签
    // fix: document获取失败，导致js报错
    // var finalTag = document.querySelectorAll('body>div').length === 1 ? finalTag = 'BODY' : finalTag = 'HTML';

    var isInIframe = window.name === "edit-wrapper-iframe"; // 是否在iframe里面

    // mit 旧jsp单独处理
    var isMit = (location.host || "").indexOf("ics-core") > -1;

    function getUidXpathByTarget(e, isNative, uitestId) {
      var pUidArr = [];
      var pUidUnique = "";
      var maxPLevel = 10;
      var curTE = e.target;
      while (!pUidUnique && maxPLevel--) {
        var curTEP = curTE && curTE.parentElement;
        if (curTEP) {
          var curTEPUid = curTEP.getAttribute("uid") || "";
          if (curTEPUid) {
            pUidArr.unshift(curTEPUid);
            var elesByUid = document.querySelectorAll(`[uid="${curTEPUid}"]`);
            var elesLen = elesByUid.length;
            if (elesLen === 1) {
              pUidUnique = curTEPUid;
            } else if (maxPLevel === 0) {
              console.log("五级以内父元素都没有唯一uid，不采用uid定位");
              pUidArr = [];
            }
          }
        }
        curTE = curTEP;
      }
      if (pUidArr.length) {
        pUidArr.push(uitestId);
        var uidXpath = pUidArr.reduce((pre, cur, i) => {
          return pre ? pre + ` [uid="${cur}"]` : `[uid="${cur}"]`;
        }, "");
        var uidXpathN =
          isNative &&
          pUidArr.reduce((pre, cur, i) => {
            // $x('//*[@uid=\"918aa30\"]/descendant::*[@uid="4dda1e"]')
            var prev = !i ? "//*" : "/descendant::*";
            var uid = `[@uid="${cur}"]`;
            return pre + prev + uid;
          }, "");
        var result = document.querySelectorAll(`${uidXpath}`);
        if (!result || result.length > 1) {
          console.log("虽然祖先元素有唯一uid，但是自身有多个uid相同兄弟元素");
          return;
        }
        return isNative ? uidXpathN : uidXpath;
      }
    }

    function addLoadFlagToUrl() {
      const url = win.location.href;
      // 如果已经有了 load=true 参数，则直接返回原始的 URL
      if (url.includes("load=true")) return;
      // 记录最后一个 ? 和 # 的索引
      var lastQuestionMarkIndex = url.lastIndexOf("?");
      var lastHashMarkIndex = url.lastIndexOf("#");

      if (lastHashMarkIndex > lastQuestionMarkIndex) {
        // 如果#比?的位置靠后时，在url结尾拼接上?load=true
        window.history.replaceState({}, "", url + "?load=true");
      } else if (lastQuestionMarkIndex > lastHashMarkIndex) {
        // 如果?比#的位置靠后时，在url结尾拼接上&load=true
        window.history.replaceState({}, "", url + "&load=true");
      }
    }
    console.log("rx document.readyState", document.readyState);

    function addLoadFlag() {
      if (document.readyState === "loading") {
        window.addEventListener("load", function () {
          console.log("rx load document.readyState", document.readyState);
          console.log("rx win.location.href", win.location.href);
          addLoadFlagToUrl();
        });
      } else if (document.readyState === "interactive") {
        var count = 0;
        var timer = setInterval(function () {
          count++;
          console.log(
            "rx document.readyState count",
            document.readyState,
            count
          );
          if (document.readyState === "complete") {
            clearInterval(timer);
            addLoadFlagToUrl();
          }
          if (count > 6) {
            clearInterval(timer);
            console.log(
              "rx document.readyState",
              document.readyState,
              "count",
              count
            );
          }
        }, 500);
      } else {
        addLoadFlagToUrl();
      }
    }

    // 全局临时缓存
    var tempData = {
      dragObject: {},
    };

    win.autoUITest = {
      timeOutEvent: null,
      init: function () {
        console.log("autoUITest init");
        var self = this;
        this.setCommonStyle();
        this.removeLocalStorageTrackPoint();

        // H5 调试前置
        // 移动端绑定长按事件
        // self.addLongPressEvent()
        // return

        // PC端录制案例
        if (!isNative) {
          this.addEventListener();
          this.pageEventListener();
        } else {
          console.log("移动端录制案例", uaautoUITestRun, uaautoUITest);
          // 移动端录制案例
          if (uaautoUITestRun || uaautoUITest) {
            self.addLongPressEvent(uaautoUITestRun ? 2 : 1);
          } else {
            var retryTimes = 0; // 最多5次
            var nativeExecStatus = "unknown";
            var timer = setInterval(function () {
              console.log(
                "====ui-test===第" + (retryTimes + 1) + "次调用native方法"
              );
              window.cordova &&
                window.cordova.exec(
                  function (data) {
                    nativeExecStatus = "success";
                    console.log("--autoTest--autotest_switch--data--", data);
                    console.log(
                      "--autoTest--autotest_switch--",
                      data.autoTestSwitch,
                      data.autoTestSwitchValue
                    );
                    // 移动端绑定长按事件

                    data &&
                      self.addLongPressEvent(
                        data.autoTestSwitchValue || "old",
                        data.autoTestSwitch
                      );
                  },
                  function () {
                    nativeExecStatus = "failed";
                  },
                  "KdePlugin",
                  "autotest_switch",
                  []
                );

              retryTimes++;
              if (retryTimes >= 5 || nativeExecStatus === "success")
                clearInterval(timer);
            }, 1000);
          }
        }
      },
      // 初始化移除 localStorage 里的埋点信息，防止localStorage大小容易溢出
      removeLocalStorageTrackPoint: function () {
        if (!isKdeNativeUitest) return;
        try {
          var len = localStorage.length;
          var keys = [];
          for (var i = 0; i < len; i++) {
            keys[i] = localStorage.key(i);
          }
          var trackPointKeys = keys.filter((key) =>
            /\-(batch|pagehide|beforeunload|hashchange|pageChange|unloadPage|click|routeChange|)\-\d{13}$/.test(
              key
            )
          );
          trackPointKeys.push("CD_NO_PAGENO");
          trackPointKeys.push("temp_trackPageData");
          trackPointKeys.forEach((key) => localStorage.removeItem(key));
        } catch (error) {
          console.log("removeLocalStorageTrackPoint error", error);
        }
      },
      postCurrentRoute: function () {
        var params = {
          type: "CHANGE_URL",
          data: {
            eventName: "routeChange",
            path: window.location.href,
          },
        };
        this.postMessage(params);
      },
      postCurrentRoute: function () {
        var params = {
          type: "CHANGE_URL",
          data: {
            eventName: "routeChange",
            path: window.location.href,
          },
        };
        this.postMessage(params);
      },
      watchRouterChange: function () {
        (() => {
          let oldPushState = history.pushState;
          history.pushState = function pushState() {
            let ret = oldPushState.apply(this, arguments);
            window.dispatchEvent(new Event("locationchange"));
            return ret;
          };
          let oldReplaceState = history.replaceState;
          history.replaceState = function replaceState() {
            let ret = oldReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event("locationchange"));
            return ret;
          };
          window.addEventListener("popstate", () => {
            window.dispatchEvent(new Event("locationchange"));
          });
        })();
        let currentHref = "";
        window.addEventListener("locationchange", () => {
          if (window.location.href !== currentHref) {
            this.postCurrentRoute();
            currentHref = window.location.href;
          }
        });
      },
      // 埋点SDK在单页面进入时调用，用于通知页面路由发生变化
      noticeRouterChange: function (to, from) {
        var params = {
          type: "CHANGE_URL",
          data: {
            // path: to.path,
            eventName: "routerChange",
            path: location.href.split("#")[0] + "#" + to.path,
          },
        };
        this.postMessage(params);
      },
      // 通过postMessage给父级窗口发送数据
      postMessage: function (data) {
        if (typeof data !== "string") {
          data = JSON.stringify(data);
        }
        window.top.postMessage(data, origin);
      },
      // 获取元素完整的路径Xpath
      getDom: function (target, type) {
        if (!target) {
          return "";
        }

        return this.getEleXpath(target, type);
      },
      // 获取元素完整的类名或ID组成路径,class会重复，出现多个元素
      getDomPath: function (target) {
        if (!target) {
          return "";
        }

        var _path = this.getIdOrClassOrTagNmae(target);
        var _tagName = target.tagName.toLowerCase();

        // 遇到id就结束
        if (_path.indexOf("#") == 0) {
          return _path;
        }
        if (target.parentNode && target.parentNode.tagName == "BODY") {
          _path = "body>" + _path;
        } else {
          _path = this.getDomPath(target.parentNode) + ">" + _path;
        }

        return _path;
      },
      // 获取native所需的元素完整路径
      getEleXpath: function (target, type, deep = 0) {
        if (!target) {
          return;
        }
        var tagName = target.tagName.toLowerCase();
        var serialNo = this.getEleSerial(target);
        var targetCls =
          "." + Array.prototype.slice.call(target.classList).join(".");
        var _path = "";

        // fullXpath /html/body/div[2]/div[2]/div[3]/div[4]/form/a[1]/img
        if (type == "fullXpath") {
          _path =
            serialNo == -2 ? tagName : tagName + "[" + (serialNo + 1) + "]";
          if (target.parentNode) {
            if (target.parentNode.tagName.toLowerCase() == "html") {
              _path = "/html/" + _path;
            } else {
              _path = this.getEleXpath(target.parentNode, type) + "/" + _path;
            }
          }

          return _path;
        }

        if (type == "fullXpathId") {
          _path =
            serialNo == -2 ? tagName : tagName + "[" + (serialNo + 1) + "]";
          if (target.parentNode) {
            if (target.parentNode.tagName.toLowerCase() == "html") {
              _path = "/html/" + _path;
            } else {
              if (target.id) {
                _path = '//*[@id="' + target.id + '"]';
              } else {
                _path = this.getEleXpath(target.parentNode, type) + "/" + _path;
              }
            }
          }
          return _path;
        }
        if (type == "text") {
          // deep < 3: 最后3层子节点忽略serialNo
          _path =
            serialNo == -2 || deep < 6
              ? tagName
              : tagName + "[" + (serialNo + 1) + "]";
          // _path = tagName
          if (target.parentNode) {
            if (
              target.children.length === 0 &&
              target.firstChild &&
              target.firstChild.nodeName === "#text" &&
              /\S+/.test(target.firstChild.nodeValue)
            ) {
              _path = `*[text()=\'${target.firstChild.nodeValue}\']`;
            }
            if (target.parentNode.tagName.toLowerCase() == "html") {
              _path = "/html/" + _path;
            } else {
              deep++;
              _path =
                this.getEleXpath(target.parentNode, type, deep) + "/" + _path;
            }
          }

          return _path;
        }

        // selecter html>body>div:nth-of-type(3)>div:nth-of-type(1)>div:nth-of-type(1)>ul>li:nth-of-type(5)>span
        _path =
          serialNo == -2
            ? tagName
            : tagName + ":nth-of-type(" + (serialNo + 1) + ")";
        if (target.parentNode) {
          // 动态弹层使用class选择器
          if (
            target.parentNode.tagName.toLowerCase() == "body" &&
            targetCls.includes(".el-popper")
          ) {
            _path = tagName + targetCls;
          } else if (target.parentNode.tagName.toLowerCase() == "html") {
            _path = "html>" + _path;
          } else {
            let isRandomId = false;
            // element-ui动态id的值是3位数
            let targetIdNum = parseInt(
              (target.id || "").replace(/[^0-9]/gi, "") || 0
            );
            if (!isMit && targetIdNum > 99) {
              isRandomId = true;
            }
            if (type == "byId" && target.id && !isRandomId) {
              _path = "#" + target.id;
            } else {
              _path = this.getEleXpath(target.parentNode, type) + ">" + _path;
            }
          }

          //  body下面可能会动态添加div，影响元素位置
          // if (target.parentNode.tagName.toLowerCase() == 'body') {
          //   if (target.classList && target.classList[0]) {
          //     _path = '.' + target.classList[0];
          //   } else if (target.id) {
          //     _path = '#' + target.id;
          //   }
          //   _path = 'body>' + _path
          // } else {
          //   _path = this.getEleXpath(target.parentNode, type) + '>' + _path
          // }
        }
        return _path;
      },
      // 获取子元素在父元素的位置
      getEleSerial: function (target) {
        var parent = target.parentNode;
        if (!parent) {
          return;
        }
        var _tagName = target.tagName.toLowerCase();
        var _children =
          Array.prototype.slice.call(
            parent.querySelectorAll(":scope>" + _tagName)
          ) || [];
        if (_children.length == 1) {
          return -2;
        }
        return _children.indexOf(target);
      },
      // 获取元素的类名, 如果元素没有类名时返回标签名
      getIdOrClassOrTagNmae: function (target) {
        if (target.id) {
          return "#" + target.id;
        } else if (target.classList && target.classList[0]) {
          return "." + target.classList[0];
        } else if (target.tagName) {
          return target.tagName.toLowerCase();
        }
      },
      // 获取当前元素在父级元素中的序号
      getSerial: function (target) {
        var parent = target.parentNode;
        if (!parent) {
          return;
        }
        var classOrTag = this.getIdOrClassOrTagNmae(target);
        var doms = parent.querySelectorAll(classOrTag);
        var list = Array.prototype.slice.call(doms);
        var children = Array.prototype.slice.call(parent.children);
        if (list.length > 1 && list.indexOf(target) > 0) {
          return children.indexOf(target) + 1;
        } else {
          return 0;
        }
      },
      // 获取当前元素的祖先元素指导匹配选择器
      getParentsUntil: function (node, selector) {
        if (!node || !selector) {
          return null;
        }
        var _queryElement = function (node, selectScope) {
          var d = !selectScope ? document : selectScope;
          if (/\./.test(node)) {
            node = node.replace(".", "");
            //HTMLcollection 伪数组
            node = d.getElementsByClassName(node);
          } else if (/\#/.test(node)) {
            node = node.replace("#", "");
            //HTML元素
            node = d.getElementById(node);
          } else {
            //HTMLcollection 伪数组
            node = d.getElementsByTagName(node);
          }
          return node;
        };

        var parent = _queryElement(selector);
        while (node.nodeType !== 9) {
          // class tagName时判断伪数组中是否存在该node元素
          // id时判断是否相等
          var nowIsParent =
            [].indexOf.call(parent, node) >= 0 || node === parent;
          if (nowIsParent) {
            return node;
            //                         break;
          }
          node = node.parentNode;
        }
        return null;
      },
      // 给已设置步骤的元素做标记
      markSelectDom: function (data) {
        if (!data.dom) {
          return;
        }
        // 已设置的动作
        if (data.type == "UI-SELECTED") {
          var stepDomList = data.stepDomList;
          // 删除选中状态
          var selectDomEles = document.querySelectorAll(".ui-test-selected");
          for (var i = 0; i < selectDomEles.length; i++) {
            selectDomEles[i] &&
              selectDomEles[i].classList.remove("ui-test-selected");
          }
          // 重新设置选中状态
          // stepDomList的结构：[{_id: '12313', dom: {dom: '.layout', width: 200},}];
          // _id为测试步骤唯一ID，dom为当前元素的位置
          var domChangedArr = [];
          for (var i = 0; i < stepDomList.length; i++) {
            var _stepDomEle = document.querySelector(stepDomList[i].dom.dom);
            // 若未找到该元素，表明UI位置发生了变化
            if (!_stepDomEle) {
              domChangedArr.push(stepDomList[i]);
              continue;
            }
            _stepDomEle && _stepDomEle.classList.add("ui-test-selected");
            //
            if (domChangedArr.length !== 0) {
              this.postMessage({
                type: "UI_HAS_CHANGED",
                data: domChangedArr,
              });
            }
          }
          // alert(stepDomList);
        }

        // 添加一个步骤
        if (data.type == "UI-SELECTED-ADD") {
          var _selectAddEle = document.querySelector(data.dom);
          _selectAddEle && _selectAddEle.classList.remove("ui-test-selecting");
          _selectAddEle && _selectAddEle.classList.add("ui-test-selected");

          // vue项目无法通过dom修改值，模拟触发input事件
          if (_selectAddEle.tagName == "INPUT") {
            let _stepVal = JSON.parse(data.stepData.stepValue);
            var event = document.createEvent("HTMLEvents");
            event.initEvent("input", false, true);

            _selectAddEle.value = _stepVal.text || "";
            _selectAddEle.dispatchEvent(event);
          }
        }
        // 删除一个步骤
        if (data.type == "UI-SELECTED-DEL") {
          document.querySelector(data.dom) &&
            document
              .querySelector(data.dom)
              .classList.remove("ui-test-selected");
        }

        // 点击添加准备添加的原色
        if (data.type == "UI-SELECTED-EDIT") {
          // 删除选中状态
          // var selectDomEles = document.querySelectorAll('.ui-test-selected-edit')
          // for (var i = 0; i < selectDomEles.length; i++) {
          //   selectDomEles[i] && selectDomEles[i].classList.remove("ui-test-selected-edit");
          // }
          var _selectedEditEle = document.querySelector(data.dom);
          if (!_selectedEditEle) {
            return;
          }
          _selectedEditEle.classList.add("ui-test-selected-edit");
          setTimeout(function () {
            _selectedEditEle.classList.remove("ui-test-selected-edit");
          }, 1500);
        }

        // 选择待添加的dom
        if (data.type == "UI-SELECTING") {
          // 删除选中状态
          var selectDomEles = document.querySelectorAll(".ui-test-selecting");
          for (var i = 0; i < selectDomEles.length; i++) {
            selectDomEles[i] &&
              selectDomEles[i].classList.remove("ui-test-selecting");
          }

          document.querySelector(data.dom) &&
            document.querySelector(data.dom).classList.add("ui-test-selecting");
        }
      },
      // 页面滑动距离统计
      getDragDistance: function (data) {
        var that = this;
        var type = data.type;

        // var startX, startY, endX, endY, distancX, distanceY
        // var touchStartFn = function (e) {
        //   startX = e.touches[0].pageX;
        //   startY = e.touches[0].pageY;
        // }
        // var touchEndFn = function (e) {
        //   endX = e.changedTouches[0].pageX;
        //   endY = e.changedTouches[0].pageY;
        //   distancX = Math.abs(endX - startX);
        //   distanceY = Math.abs(endY - startY);

        //   that.postMessage({
        //     type: 'UI_SELECTED_DRAG',
        //     data: {
        //       distancX: distancX,
        //       distanceY: distanceY
        //     },
        //   });
        // }

        // // 开始在拖动层拖动
        // if (type == 'start') {
        //   //获取点击开始的坐标
        //   el.addEventListener("touchstart", touchStartFn, false);
        //   //获取点击结束后的坐标
        //   el.addEventListener("touchend", touchEndFn, false)
        // }

        // if (type == 'end') {
        //   // 移除拖动事件
        //   el.removeEventListener("click", touchStartFn, false);
        //   el.removeEventListener("click", touchEndFn, false);
        // }

        // 编辑器是拖拽事件

        // 开始在拖动层拖动
        if (type == "start") {
          var startX, startY, endX, endY, distanceX, distanceY;
          tempData.dragObject.mouseDownFn = function (e) {
            startX = e.clientX;
            startY = e.clientY;
          };

          tempData.dragObject.mouseUpFn = function (e) {
            //获取x和y
            var endX = e.clientX;
            var endY = e.clientY;

            distanceX = endX - startX;
            distanceY = endY - startY;

            that.postMessage({
              type: "UI_SELECTED_DRAG",
              data: {
                distanceX: distanceX,
                distanceY: distanceY,
              },
            });
          };

          //获取点击开始的坐标
          document.addEventListener(
            "mousedown",
            tempData.dragObject.mouseDownFn,
            false
          );
          //获取点击结束后的坐标
          document.addEventListener(
            "mouseup",
            tempData.dragObject.mouseUpFn,
            false
          );
        }

        if (type == "end") {
          // 移除拖动事件
          document.removeEventListener(
            "mousedown",
            tempData.dragObject.mouseDownFn,
            false
          );
          document.removeEventListener(
            "mouseup",
            tempData.dragObject.mouseUpFn,
            false
          );
        }
      },
      // 获取iframe内元素的位置和dom路径
      getIframeDom: function (ele, params) {
        var frameDom = window.frameElement;
        var rect = ele.getBoundingClientRect();
        var parentRect = {};
        var thisWin = window;
        var frameData = [];

        params.left = rect.left;
        params.top = rect.top;
        if (frameDom && frameDom.name != "edit-wrapper-iframe") {
          params.frameData = {
            url: window.location.href,
            frameName: frameDom.name,
          };
          params.scrollTop = 0;
          params.scrollLeft = 0;
        }

        while (frameDom && frameDom.name != "edit-wrapper-iframe") {
          parentRect = frameDom.getBoundingClientRect();

          params.left += parentRect.left;
          params.top += parentRect.top;
          // frameData.push(thisWin.location.href)

          thisWin = thisWin.parent;
          frameDom = thisWin.frameElement;
        }

        // if (frameData.length > 0) {
        //   params.frameData = frameData.join('>')
        // }

        return params;
      },
      handleTouchStart: function (e) {
        var that = this;
        longClick = 0; //设置初始为0
        window.autoUITest.timeOutEvent = setTimeout(function () {
          var _target = e.target;

          var targetUidNode = (_target && _target.attributes.uid) || {};
          var uitestId = targetUidNode.value || "";

          // 长按选中样式
          _target.classList.add("ui-test-selecting");

          longClick = 1; //假如长按，则设置为1

          var _otherMsg = {};
          // 当前对象包含以下样式时是滑动组件，返回滑动组件的滑动层
          // var _slideParent = this.getParentsUntil(_target, '.scroller-component') || this.getParentsUntil(_target, '.matrix-picker-wheel-scroll')
          //   || this.getParentsUntil(_target, '.nui-picker__wheel--scroll') || this.getParentsUntil(_target, '.vux-range-input-box')
          // if (_slideParent) {
          //   _otherMsg.slideDom = this.getEleXpath(_slideParent, 'fullXpath')
          // }

          // 弹出测试案例编辑页面

          var _xpathLine = window.autoUITest.getEleXpath(e.target, "fullXpath");
          var _xpathLineId =
            window.autoUITest.getEleXpath(e.target, "fullXpathId") || "";
          var _xpathText =
            window.autoUITest.getEleXpath(e.target, "text", 0) || "";
          if (_xpathLine == _xpathLineId) {
            _xpathLineId = "";
          }
          if (_xpathLine == _xpathText || !/\*\[text\(/.test(_xpathText)) {
            _xpathText = "";
          }

          // element-ui动态id的值后面几位是数字，动态id不上报
          var _id = (_xpathLineId.match('id=".*"') || "")[0] || "";
          if (!isMit && (_id.replace(/[^0-9]/gi, "") || 0) > 99) {
            _xpathLineId = "";
          }

          var uitestIdUnique = "";
          if (uitestId) {
            var elesByUid = document.querySelectorAll(`[uid="${uitestId}"]`);
            var elesLen = elesByUid.length;
            // console.log('uitestId elesLen', elesLen)
            if (elesLen === 1) {
              uitestIdUnique = `//*[@uid="${uitestId}"]`;
            } else {
              console.log(
                `handleTouchStart uid为 ${uitestId} 的元素当前页面多于一个`,
                typeof that.getUidXpathByTarget
              );
              uitestIdUnique = that.getUidXpathByTarget
                ? that.getUidXpathByTarget(e, true, uitestId)
                : getUidXpathByTarget(e, true, uitestId);
            }
          } else {
            console.log("当前元素不存在uitestId");
          }

          var opts = {
            xpathLine: uitestIdUnique ? uitestIdUnique : _xpathLine,
            xpathLineId: _xpathLineId,
            viewName: _xpathText,
            stepUrl: location.href,
            otherMsg: JSON.stringify(_otherMsg),
          };

          console.log(
            "\n\n\n\n\n\ndocument.title",
            document.title,
            uitestIdUnique
          );
          // 判断是否为时间选择器
          var _placeholder = e.target.getAttribute("placeholder");
          var _isTimePicker = _placeholder
            ? ["时间", "日期"].some((word) => _placeholder.includes(word))
            : false;
          // 是时间选择器就给对应的webArgs
          if (_isTimePicker) {
            opts.webArgs = {
              type: "input", // input、click、longPress、scroll、Assert
              jsFunction:
                "window.autoUITest.setInputText($xpath$, $inputText$)",
              pageTitle: document.title,
            };
            // else还得有个if，入参要先维护
          } else {
            if (["确定", "确认"].includes(e.target.innerText)) {
              var dateOrBool = window.autoUITest.confirmDate();
              if (dateOrBool) {
                var jsFunctionString = `return window.autoUITest.triggerWhileExcuting(${dateOrBool})`;

                opts.webArgs = {
                  type: "click",
                  jsFunction: jsFunctionString,
                  pageTitle: document.title,
                };
              } else {
                opts.webArgs = {
                  pageTitle: document.title,
                };
              }
            } else {
              opts.webArgs = {
                pageTitle: document.title,
              };
            }
          }
          // 打印xpath
          console.log("--autotest addLongPressEvent getEleXpath----", opts);
          window.cordova.exec &&
            window.cordova.exec(
              function (data) {
                // 已添加测试用例样式
                _target.classList.add("ui-test-selected");
                // data: actionType:click/longPress/input/scroll/assert inputInfo: 输入内容  otherMsg:
                // console.log('--autotest_viewTouch--success--', data)

                // 为输入框赋值
                if (
                  /input|textarea/i.test(_target.tagName) &&
                  data.actionType == "input" &&
                  data.inputInfo
                ) {
                  _target.value = data.inputInfo;

                  // vue项目无法通过dom修改值，模拟触发input事件
                  _target.dispatchEvent(event);
                }
              },
              function (data) {
                // 删除测试用例样式
                _target.classList.remove("ui-test-selecting");
                // data: otherMsg
                // console.log('--autotest_viewTouch--cancel--', data)
              },
              "KdePlugin",
              "autotest_viewTouch",
              [opts]
            );
        }, 800);

        console.log("handleTouchEnd1", window.autoUITest.timeOutEvent);
      },
      handleTouchEnd: function (e) {
        console.log(
          "handleTouchEnd2",
          window.autoUITest.timeOutEvent,
          longClick
        );
        if (window.autoUITest.timeOutEvent) {
          clearTimeout(window.autoUITest.timeOutEvent);
          window.autoUITest.timeOutEvent = null;
        }
        if (window.autoUITest.timeOutEvent != 0 && longClick == 0) {
          //此处为点击事件----在此处添加跳转详情页
        }
        return false;
      },
      // 移动端页面长按弹出自动化测试录入窗口
      // autoTestSwitchValue 3 常规测试包；1 录制状态； 2 执行状态
      // autoTestSwitch N 录制，Y 不能录制  兼容老包
      addLongPressEvent: function (autoTestSwitchValue, autoTestSwitch) {
        console.log(
          "--autoTest--addLongPressEvent--",
          autoTestSwitchValue,
          autoTestSwitch
        );

        // 旧包autoTestSwitch Y的时候不能录制
        if (autoTestSwitchValue == "old" && autoTestSwitch == "Y") {
          window.eruda && window.eruda._$el.css({ display: "block" });
          return;
        }

        // 正常测试包
        if (autoTestSwitchValue == 3 || !autoTestSwitchValue) {
          window.eruda && window.eruda._$el.css({ display: "block" });
          return;
        }

        // 走到这里才是自动化包状态
        isKdeNativeUitest = 1;
        addLoadFlag();
        console.log(
          "走到这里才是自动化包状态",
          autoTestSwitchValue,
          location.href
        );

        // 录制状态和执行状态 隐藏移动端调试工具，规避对自动化测试的影响，延时隐藏以免调试工具还未初始化完成，调试工具是异步加载
        if (autoTestSwitchValue == 2) {
          // if (autoTestSwitchValue == 2 || autoTestSwitchValue == 1) {
          document.documentElement.removeEventListener(
            "touchstart",
            this.handleTouchStart,
            true
          );
          document.documentElement.removeEventListener(
            "touchend",
            this.handleTouchEnd
          );
          setTimeout(() => {
            // window.eruda && window.eruda.destroy()
            // 1. 修改betterscroll点击事件私有属性
            document.addEventListener(
              "click",
              function (e) {
                e._constructed = true; // better-scroll点击事件的私有属性，为true时不会阻止默认行为
                e.forwardedTouchEvent = true; // fastclick点击事件的私有属性，为true时不会阻止默认行为
                e._uitestEvent = true; // ui自动化事件私有属性，方便业务代码有需要时判断是否UI自动化执行案例触发的事件
                // console.log('got it', e);
              },
              true
            );
            // 2. 隐藏调试工具小齿轮
            window.eruda && window.eruda._$el.css({ display: "none" });

            // 3. 清除localStorage中的埋点记录
            Object.keys(localStorage).forEach((it) => {
              if (
                it.indexOf("-click-") !== -1 ||
                it.indexOf("-pagechange-") !== -1 ||
                it.indexOf("-hashchange-") !== -1 ||
                it.indexOf("-pagehide-") !== -1 ||
                it.indexOf("-pageChange-") !== -1
              ) {
                localStorage.removeItem(it);
              }
            });
          }, 1000);
        }

        // 执行状态 不能录制
        if (autoTestSwitchValue == 2) {
          document.documentElement.removeEventListener(
            "touchstart",
            this.handleTouchStart,
            true
          );
          document.documentElement.removeEventListener(
            "touchend",
            this.handleTouchEnd
          );
          return;
        }

        // js 模拟手动触发事件
        var event = document.createEvent("HTMLEvents");
        event.initEvent("input", false, true);

        document.documentElement.removeEventListener(
          "touchstart",
          this.handleTouchStart,
          true
        );
        document.documentElement.removeEventListener(
          "touchend",
          this.handleTouchEnd
        );

        document.documentElement.addEventListener(
          "touchstart",
          this.handleTouchStart,
          true
        );
        // 离开清除事件
        document.documentElement.addEventListener(
          "touchend",
          this.handleTouchEnd
        );

        // 移动清除长按事件
        document.documentElement.addEventListener(
          "touchmove",
          function (e) {
            if (window.autoUITest.timeOutEvent)
              clearTimeout(window.autoUITest.timeOutEvent);
            window.autoUITest.timeOutEvent = 0;
          },
          false
        );
      },
      getUidXpathByTarget: function (e, isNative) {
        var pUidArr = [];
        var pUidUnique = "";
        var maxPLevel = 10;
        var curTE = e.target;
        while (!pUidUnique && maxPLevel--) {
          var curTEP = curTE && curTE.parentElement;
          if (curTEP) {
            var curTEPUid = curTEP.getAttribute("uid") || "";
            if (curTEPUid) {
              pUidArr.unshift(curTEPUid);
              var elesByUid = document.querySelectorAll(`[uid="${curTEPUid}"]`);
              var elesLen = elesByUid.length;
              if (elesLen === 1) {
                console.log(`父元素存在唯一uid`, maxPLevel);
                pUidUnique = curTEPUid;
              } else if (maxPLevel === 0) {
                console.log("五级以内父元素都没有唯一uid，不采用uid定位");
                pUidArr = [];
              }
            }
          }
          curTE = curTEP;
        }
        // console.log('pUidArr', pUidArr)
        if (pUidArr.length) {
          if (e.target.getAttribute("uid")) {
            pUidArr.push(e.target.getAttribute("uid"));
          }
          var uidXpath = pUidArr.reduce((pre, cur, i) => {
            return pre ? pre + ` [uid="${cur}"]` : `[uid="${cur}"]`;
          }, "");
          var uidXpathN =
            isNative &&
            pUidArr.reduce((pre, cur, i) => {
              // $x('//*[@uid=\"918aa30\"]/descendant::*[@uid="4dda1e"]')
              var prev = !i ? "//*" : "/descendant::*";
              var uid = `[@uid="${cur}"]`;
              return pre + prev + uid;
            }, "");
          // console.log('uidXpath', uidXpath)
          var result = document.querySelectorAll(`${uidXpath}`);
          if (!result || result.length > 1) {
            console.log("虽然祖先元素有唯一uid，但是自身有多个uid相同兄弟元素");
            return;
          }
          return isNative ? uidXpathN : uidXpath;
        }
      },
      // 监听鼠标的悬浮事件, 然后通过post方法将悬浮的dom的属性发送给父级window
      addEventListener: function () {
        var that = this;
        document.documentElement.addEventListener("mouseover", function (e) {
          var target = e.target;
          if (that.target === target) {
            // 当悬浮在同一个元素上时, 不做操作
            return;
          }
          if (
            target.tagName === "HTML" ||
            target.tagName === "BODY" ||
            target.parentNode.tagName === "BODY"
          ) {
            return;
          }
          that.target = target;
          var rect = target.getClientRects()[0];

          // domPaths去重
          var domPath1 = that.getDom(target, "byId");
          var domPath2 = that.getDom(target);
          var domPaths =
            domPath1 == domPath2 ? [domPath1] : [domPath1, domPath2];

          var targetUidNode = (target && target.attributes.uid) || {};
          var uitestId = targetUidNode.value || "";

          var params = {
            dom: that.getDom(target, "byId"),
            domPaths: domPaths,
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            type: target.tagName.toLowerCase(),
            scrollTop: document.documentElement.scrollTop,
            scrollLeft: document.documentElement.scrollLeft,
          };

          if (uitestId) {
            var elesByUid = document.querySelectorAll(`[uid="${uitestId}"]`);
            var elesLen = elesByUid.length;
            if (elesLen === 1) {
              params.uid = uitestId;
              params.dom = `[uid="${uitestId}"]`;
              if (domPaths && domPaths.length) {
                domPaths.unshift(`[uid="${uitestId}"]`);
              } else {
                domPaths = [`[uid="${uitestId}"]`];
              }
            } else {
              console.log(
                `uid为 ${uitestId} 的元素当前页面多于一个`,
                typeof that.getUidXpathByTarget
              );

              var uidXpath = that.getUidXpathByTarget
                ? that.getUidXpathByTarget(e, false, uitestId)
                : getUidXpathByTarget(e, false, uitestId);
              if (uidXpath) {
                params.uid = uidXpath;
                params.dom = uidXpath;
                if (domPaths && domPaths.length) {
                  domPaths.unshift(uidXpath);
                } else {
                  domPaths = [uidXpath];
                }
              }
            }
          } else {
            console.log("当前元素不存在uitestId");
          }

          // input readOnly属性
          // if (target.readOnly) {
          //   params.readOnly = true
          // }

          // 当前对象包含以下样式时是滑动组件，返回滑动组件的滑动层
          var _slideParent =
            that.getParentsUntil(target, ".scroller-component") ||
            that.getParentsUntil(target, ".matrix-picker-wheel") ||
            that.getParentsUntil(target, ".nui-picker__wheel") ||
            that.getParentsUntil(target, ".el-scrollbar");
          if (that.getParentsUntil(target, ".scroller-component")) {
            _slideParent = _slideParent.querySelector(".scroller-content");
          }
          if (_slideParent) {
            params.slideDom = that.getDom(_slideParent);
          }

          // 当前对象包含文件上传组件，返回上传组件路径，正常一个步骤只能有一个，两个是为了页面提示用
          var fileList = target.querySelectorAll("input[type=file]");
          if (fileList.length == 1) {
            params.domFile = [that.getDom(fileList[0])];
          }
          if (fileList.length > 1) {
            params.domFile = [
              that.getDom(fileList[0]),
              that.getDom(fileList[1]),
            ];
          }

          // 增加iframe判断，添加iframe信息
          params = that.getIframeDom(target, params);

          // console.log(rect.left, rect.top, document.documentElement.scrollTop, document.documentElement.scrollLeft);

          that.postMessage(params);
        });

        // 接受外部容器消息
        window.addEventListener(
          "message",
          function (event) {
            // console.log('ui-test onmessage', event.data)
            var data = event.data;
            if (data.type && data.type.indexOf("UI-SELECT") != -1) {
              that.markSelectDom(data);
            } else if (
              data.type &&
              data.type.indexOf("UI-SELECTED_DRAG") != -1
            ) {
              that.getDragDistance(data.data);
            } else if (data.type && data.type.indexOf("AUTO-CLICK") != -1) {
              const domHtml = document.querySelector(data.dom);
              domHtml
                ? !!domHtml.click
                  ? domHtml.click()
                  : domHtml.parentNode.click()
                : that.postMessage({ stop: true, hasDom: !!domHtml });
            } else if (data.type && data.type.indexOf("AUTO-INPUT") != -1) {
              const domHtml = document.querySelector(data.dom);
              domHtml
                ? (domHtml.value = data.value)
                : that.postMessage({ stop: true, hasDom: !!domHtml });
            }
          },
          false
        );
      },
      // 页面切换事件监听
      pageEventListener: function () {
        var that = this;

        // window.addEventListener('hashchange', function(e) {
        //   // console.log('The hash has changed!');
        //   // console.log(e);
        // });

        // window.addEventListener('pagehide', function(e) {
        //   // console.log('page...hide');
        //   // console.log(e);
        // });

        window.addEventListener("pageshow", function (e) {
          console.log("page...show", e);
          // console.log(e);

          var params = {
            type: "CHANGE_URL",
            data: {
              eventName: "pageshow",
              path: window.location.href,
            },
          };
          that.postMessage(params);
        });
      },
      // 设置页面已设置案例的样式
      setCommonStyle: function () {
        var styles = document.createElement("style");
        styles.id = "uiTestSelected";
        styles.type = "text/css";
        var cssText =
          ".ui-test-selected{transition: all 0.3s;background-color: #e2f2ee80 !important;}.ui-test-selecting{background-color:#ade2b380 !important;}.ui-test-selected.ui-test-selected-edit{background-color: #03f4924f !important;}";
        styles.appendChild(document.createTextNode(cssText)); //for FF
        document.getElementsByTagName("head")[0].appendChild(styles);
      },
      excuteJsFunction: function (type, xpath, funcOrText, args) {
        if (type === "input") {
          this.setInputText(xpath, funcOrText);
          return;
        }
        window.eval(`(${funcOrText}).apply(null, ${args})`);
      },
      setInputText: function (xpath, inputText) {
        var event = document.createEvent("HTMLEvents");

        // vue项目无法通过dom修改值，模拟触发input事件
        event.initEvent("input", false, true);
        // var _target = document.querySelector(xpath);
        var _target = document.evaluate(xpath, document).iterateNext();

        // 为输入框赋值
        _target.value = inputText;
        // js 模拟手动触发事件
        _target.dispatchEvent(event);
      },
      /* 日期框的方法们-START，顺序一定得是年月日 */
      startDateInfo: [],
      // 日期框点击确认是取到终点值，供录制完毕执行录制案例时使用
      confirmDate: function (className = ".nui-picker__panel--header--title") {
        var titleDom = document.querySelector(className);
        if (!titleDom) return false;

        var titleText = titleDom.innerText;
        var timerFlagArr = ["年", "月", "日期", "时间"];
        var isTimer = timerFlagArr.some((flag) => titleText.includes(flag));
        if (!isTimer) return false;

        // 获取当前日期信息
        var endDateInfo = window.autoUITest.getDate();
        // 获取当前日期值
        var [endYear, endMonth, endDay] = endDateInfo.map(function (item) {
          return item.value;
        });

        return JSON.stringify([endYear, endMonth, endDay]);
      },
      // 获取当下日期
      getDate: function (
        className = ".nui-picker-basic__wheel--item--selected",
        init = false
      ) {
        // 获取有对应类名的DOM们
        var nodeList = document.querySelectorAll(className);
        // 转为真数组
        var nodeArr = [...nodeList];
        // 获取真正在显示的元素们
        var showingSelected = nodeArr.filter((node) => node.offsetHeight !== 0);

        // 获取node的xpath
        var xPathArr = showingSelected.map((item) =>
          window.autoUITest.getEleXpath(item, "fullXpath")
        );
        // 获取值
        var dateArr = showingSelected.map((item) => item.innerText);

        // 去除文字，转为数字
        dateArr = dateArr.map(function (item) {
          return parseInt(item);
        });

        // 组装对象
        var dateInfo = xPathArr.map(function (item, index) {
          var info = {
            height: showingSelected[index].offsetHeight,
            value: dateArr[index],
            xpath: item,
          };
          return info;
        });
        // init标记位为true就维护一下对象内的startDate
        if (init) window.autoUITest.startDateInfo = dateInfo;
        return dateInfo;
      },
      maintainStartDay: function (start, end) {
        // 一个月恰有三十天的月份
        var smallMonthArr = [4, 6, 9, 11];

        var isLeapYear = (year) => new Date(year, 2, 0).getDate() === 29;
        var getRange = (leftBound, rightBound) => {
          var res = [];
          var isRightBoundBigger = rightBound - leftBound > 0;

          if (isRightBoundBigger) {
            while (leftBound < rightBound) {
              res.push(leftBound++);
            }
            res.push(leftBound);
          } else {
            while (rightBound < leftBound) {
              res.push(rightBound++);
            }
            res.push(rightBound);
          }
          return res;
        };

        var [startYear, startMonth, startDay] = start;
        var [endYear, endMonth] = end;

        // 其实月小于等于28的不用处理，直接返回
        if (startDay <= 28) return startDay;

        var isEndMonthBigger = endMonth - startMonth >= 0;

        if (isEndMonthBigger) {
          // 不经过二月
          if (startMonth > 2 || endMonth < 2) {
            if (startDay > 30) {
              var monthRange = getRange(startMonth, endMonth);
              var haveSmallMonth = monthRange.some((month) =>
                smallMonthArr.includes(month)
              );
              haveSmallMonth ? (startDay = 30) : null;
            }
            /* 经过二月，年月日顺序滑，分为两种：
                  1、起始年为闰年2月29，经过平年
                  3、结果经过二月
              */
          } else {
            if (isLeapYear(startYear) && startMonth === 2 && startDay === 29) {
              var yearRange = getRange(startYear, endYear);
              // 经过平年，startDay变成28
              if (yearRange.some((year) => !isLeapYear(year))) startDay = 28;
            } else {
              var isLeapYearBool = isLeapYear(endYear);
              // 平年，startDay变成28
              isLeapYearBool ? (startDay = 29) : (startDay = 28);
            }
          }
        } else {
          // 不经过二月（反过来）
          if (endMonth > 2 || startMonth < 2) {
            if (startDay > 30) {
              var monthRange = getRange(startMonth, endMonth);
              var haveSmallMonth = monthRange.some((month) =>
                smallMonthArr.includes(month)
              );
              haveSmallMonth ? (startDay = 30) : null;
            }
            // 经过二月
          } else {
            if (isLeapYear(startYear) && startMonth === 2 && startDay === 29) {
              var yearRange = getRange(startYear, endYear);
              // 经过平年，startDay变成28
              if (yearRange.some((year) => !isLeapYear(year))) startDay = 28;
            } else {
              var isLeapYearBool = isLeapYear(endYear);
              // 平年，startDay变成28
              isLeapYearBool ? (startDay = 29) : (startDay = 28);
            }
          }
        }

        return startDay;
      },
      // 终点值由native传入，起始值从唤起框中获取
      triggerWhileExcuting: function (endDateArr) {
        // 获取初始日期值
        var startDateInfo = window.autoUITest.getDate();
        var [startYear, startMonth, startDay] = startDateInfo.map(function (
          item
        ) {
          return item.value;
        });
        // 获取当前日期值
        var [endYear, endMonth, endDay] = endDateArr;

        var yearDifference = endYear - startYear;

        var resultArr = [
          {
            xpath: startDateInfo[0].xpath,
            height: startDateInfo[0].height,
            count: yearDifference,
          },
        ];

        console.log("20220718----startMonth", startMonth);
        if (startMonth) {
          var monthDifference = endMonth - startMonth;
          resultArr.push({
            xpath: startDateInfo[1].xpath,
            height: startDateInfo[1].height,
            count: monthDifference,
          });
        }

        // 没有日期，好计算
        if (!startDay) return JSON.stringify(resultArr);

        // 日期的维护逻辑相当复杂，拆为单独的方法
        var maintainedStartDay = window.autoUITest.maintainStartDay(
          [startYear, startMonth, startDay],
          [endYear, endMonth, endDay]
        );
        var dayDifference = endDay - maintainedStartDay;
        resultArr.push({
          xpath: startDateInfo[2].xpath,
          height: startDateInfo[2].height,
          count: dayDifference,
        });

        return JSON.stringify(resultArr);
      },
      /* 日期框的方法们-END */
    };

    autoUITest.init();
    if (!isNative && isInIframe) autoUITest.watchRouterChange();
  }

  if (document && document.body) {
    uiTestDOMContentLoaded();
  } else {
    document.addEventListener("DOMContentLoaded", uiTestDOMContentLoaded);
  }
})(window);
