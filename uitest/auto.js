class AutoUITestListener {
  constructor(type) {
    this.type = type;
    this.ticking = false; // 保证捕获阶段和冒泡阶段同时存在时，只触发一次
    this.cbFn = (e) => this.cb(e);
    this.init();
  }
  cb(event) {
    const autoUiTestButtonIdList = [
      "auto_ui_test_record_button",
      "auto_ui_test_stop_button",
      "auto_ui_test_running_button",
    ];
    const isAutoUiTestButton =
      event.target && autoUiTestButtonIdList.includes(event.target.id);
    if (!this.ticking && !isAutoUiTestButton) {
      this.timestamp = new Date().getTime();
      requestAnimationFrame(async () => this.realFunc(event));
      this.ticking = true;
    }
  }

  async realFunc(event) {
    this.ticking = false;
    await this.readXPath(event, this.type);
  }

  elementsShareFamily(pre, sib) {
    return pre.tagName === sib.tagName;
  }

  getElementIndex(el) {
    let sib,
      index = 1; // 默认为1
    for (sib = el.previousSibling; sib; sib = sib.previousSibling) {
      // 前面有兄弟元素且 tagname 相同
      if (
        sib.nodeType === Node.ELEMENT_NODE &&
        this.elementsShareFamily(el, sib)
      ) {
        index++;
      }
    }

    if (index > 1) {
      return index;
    }

    for (sib = el.nextSibling; sib; sib = sib.nextSibling) {
      // 后面有兄弟元素且 tagname 相同

      if (
        sib.nodeType === Node.ELEMENT_NODE &&
        this.elementsShareFamily(el, sib)
      ) {
        return 1;
      }
    }

    return 0;
  }

  makeQueryForElement(el) {
    if (el.nodeType === 9) {
      return el.nodeName;
    }

    let query = "";

    let cssSelector = "";

    for (
      let tempEl = el;
      tempEl && tempEl.nodeType === Node.ELEMENT_NODE;
      tempEl = tempEl.parentNode
    ) {
      const component = tempEl.tagName.toLowerCase();

      const uid = tempEl.getAttribute("uid");

      const className = false;

      if (uid && className) {
        query =
          "/" + component + `[@uid='${uid}' and @class='${className}']` + query;
      } else if (uid) {
        query = "/" + component + `[@uid='${uid}']` + query;

        cssSelector = ">" + component + `[uid='${uid}']` + cssSelector;
      } else if (className) {
        query = "/" + component + `[@class='${className}']` + query;
      } else {
        const index = this.getElementIndex(tempEl);

        if (index >= 1) {
          query = "/" + component + "[" + index + "]" + query;

          cssSelector =
            ">" + component + `:nth-of-type(${index})` + cssSelector;
        } else {
          query = "/" + component + query;

          cssSelector = ">" + component + cssSelector;
        }
      }
    }

    if (!query.includes("html")) {
      query = "/" + query;
    }

    cssSelector = cssSelector.slice(1);

    if (el.tagName === "svg" || el.tagName === "path") {
      query = query.replace(/\/path*./, "");

      query = query.replace(/\/svg/, "//*[name()='svg']");
    }

    return [query, cssSelector];
  }

  readXPath(event, type) {
    const element = event.target;

    /**
    
    * 当触发一次 mousedown 时，clone 储存一次 document 快照
    
    * 对于输入类型的 Input 框，因为其 change 事件会在失焦，也就是下一次触发 mouseDown 时才会触发，所以需要使用上一次的快照来计算 xpath
    
    */

    const classSymbol = `auto-ui-test-private-class-symbol`;

    const canInputType = ["text", "number", "password"];

    let snapShotIndex = 0;

    if (type === "mousedown") {
      element.classList.add(classSymbol);

      __AutoUiTestMouseDownCount__++;

      __AutoUiTestsDocumentSnapshot__[__AutoUiTestMouseDownCount__] =
        document.cloneNode(true);

      // 这两个 api 拿到的为 document 的引用，会一直变化；cloneNode 获取的是 document 值的拷贝，不会因页面中 document 改变而改变

      // console.log('event.target.ownerDocument', event.target.ownerDocument)

      // console.log('event.view.document', event.view.document)

      snapShotIndex = __AutoUiTestMouseDownCount__;
    } else if (
      type === "change" &&
      element.tagName === "INPUT" &&
      canInputType.includes(element.type)
    ) {
      snapShotIndex = __AutoUiTestMouseDownCount__ - 1;
    } else {
      snapShotIndex = __AutoUiTestMouseDownCount__;
    }

    const tempEl = __AutoUiTestsDocumentSnapshot__[snapShotIndex].querySelector(
      `.${classSymbol}`
    );

    if (type === "mousedown") {
      element.classList.remove(classSymbol);

      const shouldDeletedSnapShotIndex = __AutoUiTestMouseDownCount__ - 10;

      delete __AutoUiTestsDocumentSnapshot__[shouldDeletedSnapShotIndex];
    }

    const [xpathValue, cssSelector] = this.makeQueryForElement(tempEl, type);

    if (xpathValue && this.type) {
      curUserTraceArr.push({
        type: this.type,

        tagName: element.tagName,

        xpathValue: xpathValue,

        cssSelector: cssSelector,

        scrollTop: this.scrollTop,

        value: element.value || "", // 给type为change用

        timestamp: this.timestamp, // 记录两个动作之间间隔

        inputType: element.tagName === "INPUT" ? element.type : "",

        stepUrl: window.location.href,
      });
    } else {
      console.error("cannot record");
    }
  }

  init() {
    window.addEventListener(this.type, this.cbFn, false);

    window.addEventListener(this.type, this.cbFn, true);
  }

  destroy() {
    window.removeEventListener(this.type, this.cbFn, false);

    window.removeEventListener(this.type, this.cbFn, true);
  }
}

async function realFunc(event) {
  await readXPath(event);
}

function readXPath(event) {
  const element = event.target;
  const type = event.type;

  const classSymbol = `auto-ui-test-private-class-symbol`;

  const canInputType = ["text", "number", "password"];

  let snapShotIndex = 0;

  if (type === "mousedown") {
    element.classList.add(classSymbol);

    __AutoUiTestMouseDownCount__++;

    __AutoUiTestsDocumentSnapshot__[__AutoUiTestMouseDownCount__] =
      document.cloneNode(true);
    snapShotIndex = __AutoUiTestMouseDownCount__;
  } else if (
    type === "change" &&
    element.tagName === "INPUT" &&
    canInputType.includes(element.type)
  ) {
    snapShotIndex = __AutoUiTestMouseDownCount__ - 1;
  } else {
    snapShotIndex = __AutoUiTestMouseDownCount__;
  }

  const tempEl = __AutoUiTestsDocumentSnapshot__[snapShotIndex].querySelector(
    `.${classSymbol}`
  );

  if (type === "mousedown") {
    element.classList.remove(classSymbol);

    const shouldDeletedSnapShotIndex = __AutoUiTestMouseDownCount__ - 10;

    delete __AutoUiTestsDocumentSnapshot__[shouldDeletedSnapShotIndex];
  }

  const [xpathValue, cssSelector] = makeQueryForElement(tempEl, type);

  if (xpathValue && this.type) {
    curUserTraceArr.push({
      type: type,

      tagName: element.tagName,

      xpathValue: xpathValue,

      cssSelector: cssSelector,

      scrollTop: scrollTop,

      value: element.value || "", // 给type为change用

      timestamp: timestamp, // 记录两个动作之间间隔

      inputType: element.tagName === "INPUT" ? element.type : "",

      stepUrl: window.location.href,
    });
  } else {
    console.error("cannot record");
  }
}

let scrollTop, timestamp;
let curUserTraceArr = [];

function getEventFromVue(e) {
  realFunc(e);
}
