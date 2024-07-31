### 逐行代码解释

#### 许可证说明和Polyfill定义

```javascript
/*
    PinchZoom.js
    ...
*/

// polyfills
if (typeof Object.assign != 'function') {
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
```
这段代码首先检查 `Object.assign` 是否存在，如果不存在，则定义一个自定义的 `Object.assign` 方法。该方法用于合并多个对象的属性到目标对象中。

```javascript
if (typeof Array.from != 'function') {
  Array.from = function (object) {
    return [].slice.call(object);
  };
}
```
如果 `Array.from` 方法不存在，则定义一个自定义的 `Array.from` 方法，将类数组对象转换为数组。

#### 工具函数

```javascript
var buildElement = function(str) {
  var tmp = document.implementation.createHTMLDocument('');
  tmp.body.innerHTML = str;
  return Array.from(tmp.body.children)[0];
};
```
`buildElement` 函数用于创建一个 HTML 元素，接受一个 HTML 字符串并返回创建的第一个子元素。

```javascript
var triggerEvent = function(el, name) {
  var event = document.createEvent('HTMLEvents');
  event.initEvent(name, true, false);
  el.dispatchEvent(event);
};
```
`triggerEvent` 函数用于触发一个指定名称的事件。

#### 定义 PinchZoom 类

```javascript
var definePinchZoom = function () {
    var PinchZoom = function (el, options) {
        this.el = el;
        this.zoomFactor = 1;
        this.lastScale = 1;
        this.offset = { x: 0, y: 0 };
        this.initialOffset = { x: 0, y: 0 };
        this.options = Object.assign({}, this.defaults, options);
        this.setupMarkup();
        this.bindEvents();
        this.update();

        if (this.isImageLoaded(this.el)) {
          this.updateAspectRatio();
          this.setupOffsets();
        }

        this.enable();
    };
```
`PinchZoom` 构造函数初始化实例变量，设置初始缩放比例和偏移量，并调用 `setupMarkup`、`bindEvents` 和 `update` 方法。如果图像已经加载，则更新宽高比并设置偏移量。

```javascript
PinchZoom.prototype = {
    defaults: {
        tapZoomFactor: 2,
        zoomOutFactor: 1.3,
        animationDuration: 300,
        maxZoom: 4,
        minZoom: 0.5,
        draggableUnzoomed: true,
        lockDragAxis: false,
        setOffsetsOnce: false,
        use2d: true,
        useMouseWheel: false,
        useDoubleTap: true,
        zoomStartEventName: 'pz_zoomstart',
        zoomUpdateEventName: 'pz_zoomupdate',
        zoomEndEventName: 'pz_zoomend',
        dragStartEventName: 'pz_dragstart',
        dragUpdateEventName: 'pz_dragupdate',
        dragEndEventName: 'pz_dragend',
        doubleTapEventName: 'pz_doubletap',
        mouseWheelEventName: 'pz_mousewheel',
        verticalPadding: 0,
        horizontalPadding: 0,
        onZoomStart: null,
        onZoomEnd: null,
        onZoomUpdate: null,
        onDragStart: null,
        onDragEnd: null,
        onDragUpdate: null,
        onDoubleTap: null,
        onMouseWheel: null
    },
```
`PinchZoom.prototype.defaults` 定义了默认选项和事件名称。

```javascript
handleDragStart: function (event) {
    triggerEvent(this.el, this.options.dragStartEventName);
    if(typeof this.options.onDragStart == "function"){
        this.options.onDragStart(this, event)
    }
    this.stopAnimation();
    this.lastDragPosition = false;
    this.hasInteraction = true;
    this.handleDrag(event);
},
```
`handleDragStart` 处理拖动开始事件，触发自定义事件并调用相应的回调函数，停止当前动画，记录拖动状态并处理初始拖动事件。

```javascript
handleDrag: function (event) {
    var touch = event.type === "touchmove" ? this.getTouches(event)[0] : this.getPointer(event);
    this.drag(touch, this.lastDragPosition);
    this.offset = this.sanitizeOffset(this.offset);
    this.lastDragPosition = touch;
},
```
`handleDrag` 处理拖动事件，获取当前触点或指针位置，计算拖动偏移量并更新偏移。

```javascript
handleDragEnd: function () {
    triggerEvent(this.el, this.options.dragEndEventName);
    if(typeof this.options.onDragEnd == "function"){
        this.options.onDragEnd(this, event)
    }
    this.end();
},
```
`handleDragEnd` 处理拖动结束事件，触发自定义事件并调用相应的回调函数，然后结束拖动。

```javascript
handleZoomStart: function (event) {
    triggerEvent(this.el, this.options.zoomStartEventName);
    if(typeof this.options.onZoomStart == "function"){
        this.options.onZoomStart(this, event)
    }
    this.stopAnimation();
    this.lastScale = 1;
    this.nthZoom = 0;
    this.lastZoomCenter = false;
    this.hasInteraction = true;
},
```
`handleZoomStart` 处理缩放开始事件，触发自定义事件并调用相应的回调函数，停止当前动画，初始化缩放状态。

```javascript
handleZoom: function (event, newScale) {
    var touchCenter = this.getTouchCenter(this.getTouches(event)),
        scale = newScale / this.lastScale;
    this.lastScale = newScale;

    this.nthZoom += 1;
    if (this.nthZoom > 3) {
        this.scale(scale, touchCenter);
        this.drag(touchCenter, this.lastZoomCenter);
    }
    this.lastZoomCenter = touchCenter;
},
```
`handleZoom` 处理缩放事件，计算缩放比例并更新缩放中心，如果缩放次数大于3次，则进行缩放和拖动操作。

```javascript
handleZoomEnd: function () {
    triggerEvent(this.el, this.options.zoomEndEventName);
    if(typeof this.options.onZoomEnd == "function"){
        this.options.onZoomEnd(this, event)
    }
    this.end();
},
```
`handleZoomEnd` 处理缩放结束事件，触发自定义事件并调用相应的回调函数，然后结束缩放。

```javascript
handleDoubleTap: function (event) {
    var center = this.getTouches(event)[0],
        zoomFactor = this.zoomFactor > 1 ? 1 : this.options.tapZoomFactor,
        startZoomFactor = this.zoomFactor,
        updateProgress = (function (progress) {
            this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
        }).bind(this);

    if (this.hasInteraction) {
        return;
    }

    this.isDoubleTap = true;

    if (startZoomFactor > zoomFactor) {
        center = this.getCurrentZoomCenter();
    }

    this.animate(this.options.animationDuration, updateProgress, this.swing);
    triggerEvent(this.el, this.options.doubleTapEventName);
    if(typeof this.options.onDoubleTap == "function"){
        this.options.onDoubleTap(this, event)
    }
},
```
`handleDoubleTap` 处理双击事件，计算缩放中心和目标缩放比例，进行动画缩放，并触发自定义事件和相应回调函数。

```javascript
handleMouseWheel: function (event) {
    var center = this.getPointer(event),
        newScale = Math.min(
            Math.max(this.options.minZoom, this.lastScale + event.deltaY * -0.01),
            this.options.maxZoom
        ),
        scale = newScale / this.lastScale;

    this.scale(scale, center);

    this.lastScale = newScale;
    this.update()
    
    triggerEvent(this.el, this.options.mouseWheelEventName);
    if (typeof this.options.onMouseWheel == "function") {
    this.options.onMouseWheel(this, event);
    }
},
```
`handleMouseWheel` 处理鼠标滚轮事件，计算新的缩放比例并进行缩放操作，触发自定义事件和相应回调函数。

```javascript
computeInitialOffset: function () {
    this.initialOffset = {
        x: -Math.abs(this.el.offsetWidth * this.getInitialZoomFactor() - this.container.offsetWidth) / 2,
        y: -Math.abs(this.el.offsetHeight * this.getInitialZoomFactor() - this.container.offsetHeight) / 2,
    };
},
```
`computeInitialOffset` 计算元素初始偏移量，使其在容器中居中显示。

```javascript
resetOffset: function()

 {
    this.offset.x = this.initialOffset.x;
    this.offset.y = this.initialOffset.y;
},
```
`resetOffset` 将当前偏移量重置为初始偏移量。

```javascript
isImageLoaded: function (el) {
    if (el.nodeName === 'IMG') {
      return el.complete && el.naturalHeight !== 0;
    } else {
      return Array.from(el.querySelectorAll('img')).every(this.isImageLoaded);
    }
},
```
`isImageLoaded` 判断图像是否加载完成，如果是 `IMG` 元素，则检查其加载状态；否则检查子图像元素。

```javascript
setupOffsets: function() {
    if (this.options.setOffsetsOnce && this._isOffsetsSet) {
      return;
    }

    this._isOffsetsSet = true;

    this.computeInitialOffset();
    this.resetOffset();
},
```
`setupOffsets` 设置偏移量，如果选项 `setOffsetsOnce` 为 `true` 并且偏移量已经设置，则跳过；否则计算初始偏移量并重置偏移。

```javascript
sanitizeOffset: function (offset) {
    var elWidth = this.el.offsetWidth * this.getInitialZoomFactor() * this.zoomFactor;
    var elHeight = this.el.offsetHeight * this.getInitialZoomFactor() * this.zoomFactor;
    var maxX = elWidth - this.getContainerX() + this.options.horizontalPadding,
        maxY = elHeight -  this.getContainerY() + this.options.verticalPadding,
        maxOffsetX = Math.max(maxX, 0),
        maxOffsetY = Math.max(maxY, 0),
        minOffsetX = Math.min(maxX, 0) - this.options.horizontalPadding,
        minOffsetY = Math.min(maxY, 0) - this.options.verticalPadding;

    return {
        x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
        y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
    };
},
```
`sanitizeOffset` 确保偏移量在允许的范围内，计算最大和最小偏移量并返回修正后的偏移量。

```javascript
scaleTo: function (zoomFactor, center) {
    this.scale(zoomFactor / this.zoomFactor, center);
},
```
`scaleTo` 按特定缩放比例进行缩放。

```javascript
scale: function (scale, center) {
    scale = this.scaleZoomFactor(scale);
    this.addOffset({
        x: (scale - 1) * (center.x + this.offset.x),
        y: (scale - 1) * (center.y + this.offset.y)
    });
    triggerEvent(this.el, this.options.zoomUpdateEventName);
    if(typeof this.options.onZoomUpdate == "function"){
        this.options.onZoomUpdate(this, event)
    }
},
```
`scale` 从指定中心按比例缩放元素，并更新偏移量，触发缩放更新事件和相应回调函数。

```javascript
scaleZoomFactor: function (scale) {
    var originalZoomFactor = this.zoomFactor;
    this.zoomFactor *= scale;
    this.zoomFactor = Math.min(this.options.maxZoom, Math.max(this.zoomFactor, this.options.minZoom));
    return this.zoomFactor / originalZoomFactor;
},
```
`scaleZoomFactor` 相对于当前状态按比例缩放，并确保缩放比例在允许范围内，返回实际缩放比例。

```javascript
canDrag: function () {
    return this.options.draggableUnzoomed || !isCloseTo(this.zoomFactor, 1);
},
```
`canDrag` 判断元素是否可拖动，当缩放比例接近 1 时，依赖 `draggableUnzoomed` 选项。

```javascript
drag: function (center, lastCenter) {
    if (lastCenter) {
      if(this.options.lockDragAxis) {
        if(Math.abs(center.x - lastCenter.x) > Math.abs(center.y - lastCenter.y)) {
          this.addOffset({
            x: -(center.x - lastCenter.x),
            y: 0
          });
        } else {
          this.addOffset({
            y: -(center.y - lastCenter.y),
            x: 0
          });
        }
      } else {
        this.addOffset({
          y: -(center.y - lastCenter.y),
          x: -(center.x - lastCenter.x)
        });
      }
      triggerEvent(this.el, this.options.dragUpdateEventName);
      if(typeof this.options.onDragUpdate == "function"){
        this.options.onDragUpdate(this, event)
      }
    }
},
```
`drag` 拖动元素，如果启用 `lockDragAxis` 选项，则锁定拖动轴，否则计算偏移量并更新。

```javascript
getTouchCenter: function (touches) {
    return this.getVectorAvg(touches);
},
```
`getTouchCenter` 计算多个触点的中心点。

```javascript
getVectorAvg: function (vectors) {
    return {
        x: vectors.map(function (v) { return v.x; }).reduce(sum) / vectors.length,
        y: vectors.map(function (v) { return v.y; }).reduce(sum) / vectors.length
    };
},
```
`getVectorAvg` 计算多个向量的平均值。

```javascript
addOffset: function (offset) {
    this.offset = {
        x: this.offset.x + offset.x,
        y: this.offset.y + offset.y
    };
},
```
`addOffset` 添加偏移量。

```javascript
sanitize: function () {
    if (this.zoomFactor < this.options.zoomOutFactor) {
        this.zoomOutAnimation();
    } else if (this.isInsaneOffset(this.offset)) {
        this.sanitizeOffsetAnimation();
    }
},
```
`sanitize` 确保缩放比例和偏移量在允许范围内，如果不合法则进行动画修正。

```javascript
isInsaneOffset: function (offset) {
    var sanitizedOffset = this.sanitizeOffset(offset);
    return sanitizedOffset.x !== offset.x || sanitizedOffset.y !== offset.y;
},
```
`isInsaneOffset` 判断偏移量是否超出允许范围。

```javascript
sanitizeOffsetAnimation: function () {
    var targetOffset = this.sanitizeOffset(this.offset),
        startOffset = {
            x: this.offset.x,
            y: this.offset.y
        },
        updateProgress = (function (progress) {
            this.offset.x = startOffset.x + progress * (targetOffset.x - startOffset.x);
            this.offset.y = startOffset.y + progress * (targetOffset.y - startOffset.y);
            this.update();
        }).bind(this);

    this.animate(
        this.options.animationDuration,
        updateProgress,
        this.swing
    );
},
```
`sanitizeOffsetAnimation` 创建一个动画将偏移量修正到允许范围内。

```javascript
zoomOutAnimation: function () {
    if (this.zoomFactor === 1) {
        return;
    }

    var startZoomFactor = this.zoomFactor,
        zoomFactor = 1,
        center = this.getCurrentZoomCenter(),
        updateProgress = (function (progress) {
            this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
        }).bind(this);

    this.animate(
        this.options.animationDuration,
        updateProgress,
        this.swing
    );
},
```
`zoomOutAnimation` 创建一个动画将缩放比例恢复到 1。

```javascript
updateAspectRatio: function () {
    this.unsetContainerY();
    this.setContainerY(this.container.parentElement.offsetHeight);
},
```
`updateAspectRatio` 更新容器的宽高比。

```javascript
getInitialZoomFactor: function () {
    var xZoomFactor = this.container.offsetWidth / this.el.offsetWidth;
    var yZoomFactor = this.container.offsetHeight / this.el.offsetHeight;

    return Math.min(xZoomFactor, yZoomFactor);
},
```
`getInitialZoomFactor` 计算元素初始缩放比例，使其适合容器大小。

```javascript
getAspectRatio: function () {
    return this.el.offsetWidth / this.el.offsetHeight;
},
```
`getAspectRatio` 计算元素的宽高比。

```javascript
getCurrentZoomCenter: function () {
    var offsetLeft = this.offset.x - this.initialOffset.x;
    var centerX = -1 * this.offset.x - offsetLeft / (1 / this.zoomFactor - 1);

    var offsetTop = this.offset.y - this.initialOffset.y;
    var centerY = -1 * this.offset.y - offsetTop / (1 / this.zoomFactor - 1);

    return {
        x: centerX,
        y: centerY
    };
},
```
`getCurrentZoomCenter` 计算当前偏移量和缩放比例下的虚拟缩放中心。

```javascript
getTouches: function (event) {
    var rect = this.container.getBoundingClientRect();
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    var posTop = rect.top + scrollTop;
    var posLeft = rect.left + scrollLeft;

    return Array.prototype.slice.call(event.touches).map(function (touch) {
        return {
            x: touch.pageX - posLeft,
            y: touch.pageY - posTop,
        };
    });
},
```
`getTouches` 获取事件中的触点相对于容器的偏移位置。

```javascript
getPointer: function (event) {
    var rect =

 this.container.getBoundingClientRect();
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    var posTop = rect.top + scrollTop;
    var posLeft = rect.left + scrollLeft;

    return {
        x: event.pageX - posLeft,
        y: event.pageY - posTop,
    };
},
```
`getPointer` 获取事件中的指针相对于容器的偏移位置。

```javascript
animate: function (duration, framefn, timefn, callback) {
    var startTime = new Date().getTime(),
        renderFrame = (function () {
            if (!this.inAnimation) { return; }
            var frameTime = new Date().getTime() - startTime,
                progress = frameTime / duration;
            if (frameTime >= duration) {
                framefn(1);
                if (callback) {
                    callback();
                }
                this.update();
                this.stopAnimation();
                this.update();
            } else {
                if (timefn) {
                    progress = timefn(progress);
                }
                framefn(progress);
                this.update();
                requestAnimationFrame(renderFrame);
            }
        }).bind(this);
    this.inAnimation = true;
    requestAnimationFrame(renderFrame);
},
```
`animate` 实现动画循环，支持时间函数和回调函数。

```javascript
stopAnimation: function () {
    this.inAnimation = false;
},
```
`stopAnimation` 停止动画。

```javascript
swing: function (p) {
    return -Math.cos(p * Math.PI) / 2  + 0.5;
},
```
`swing` 动画缓动函数，实现平滑过渡效果。

```javascript
getContainerX: function () {
    return this.container.offsetWidth;
},

getContainerY: function () {
    return this.container.offsetHeight;
},

setContainerY: function (y) {
    return this.container.style.height = y + 'px';
},

unsetContainerY: function () {
    this.container.style.height = null;
},
```
`getContainerX` 和 `getContainerY` 获取容器的宽度和高度，`setContainerY` 设置容器高度，`unsetContainerY` 重置容器高度。

```javascript
setupMarkup: function () {
    this.container = buildElement('<div class="pinch-zoom-container"></div>');
    this.el.parentNode.insertBefore(this.container, this.el);
    this.container.appendChild(this.el);

    this.container.style.overflow = 'hidden';
    this.container.style.position = 'relative';

    this.el.style.webkitTransformOrigin = '0% 0%';
    this.el.style.mozTransformOrigin = '0% 0%';
    this.el.style.msTransformOrigin = '0% 0%';
    this.el.style.oTransformOrigin = '0% 0%';
    this.el.style.transformOrigin = '0% 0%';

    this.el.style.position = 'absolute';
    this.el.style.backfaceVisibility = 'hidden';
    this.el.style.willChange = 'transform';
},
```
`setupMarkup` 创建并设置 HTML 结构，定义容器和元素的样式。

```javascript
end: function () {
    this.hasInteraction = false;
    this.sanitize();
    this.update();
},
```
`end` 结束当前交互，修正偏移量并更新显示。

```javascript
bindEvents: function () {
    var self = this;
    detectGestures(this.container, this);

    this.resizeHandler = this.update.bind(this)
    window.addEventListener('resize', this.resizeHandler);
    Array.from(this.el.querySelectorAll('img')).forEach(function(imgEl) {
      imgEl.addEventListener('load', self.update.bind(self));
    });

    if (this.el.nodeName === 'IMG') {
      this.el.addEventListener('load', this.update.bind(this));
    }
},
```
`bindEvents` 绑定必要的事件监听器，如手势检测、窗口大小调整和图像加载事件。

```javascript
update: function (event) {
    if (event && event.type === 'resize') {
        this.updateAspectRatio();
        this.setupOffsets();
    }

    if (event && event.type === 'load') {
      this.updateAspectRatio();
      this.setupOffsets();
    }

    if (this.updatePlanned) {
        return;
    }
    this.updatePlanned = true;

    window.setTimeout((function () {
        this.updatePlanned = false;

        var zoomFactor = this.getInitialZoomFactor() * this.zoomFactor,
            offsetX = -this.offset.x / zoomFactor,
            offsetY = -this.offset.y / zoomFactor,
            transform3d =   'scale3d('     + zoomFactor + ', '  + zoomFactor + ',1) ' +
                'translate3d(' + offsetX    + 'px,' + offsetY    + 'px,0px)',
            transform2d =   'scale('       + zoomFactor + ', '  + zoomFactor + ') ' +
                'translate('   + offsetX    + 'px,' + offsetY    + 'px)',
            removeClone = (function () {
                if (this.clone) {
                    this.clone.parentNode.removeChild(this.clone);
                    delete this.clone;
                }
            }).bind(this);

        if (!this.options.use2d || this.hasInteraction || this.inAnimation) {
            this.is3d = true;
            removeClone();

            this.el.style.webkitTransform = transform3d;
            this.el.style.mozTransform = transform2d;
            this.el.style.msTransform = transform2d;
            this.el.style.oTransform = transform2d;
            this.el.style.transform = transform3d;
        } else {
            if (this.is3d) {
                this.clone = this.el.cloneNode(true);
                this.clone.style.pointerEvents = 'none';
                this.container.appendChild(this.clone);
                window.setTimeout(removeClone, 200);
            }

            this.el.style.webkitTransform = transform2d;
            this.el.style.mozTransform = transform2d;
            this.el.style.msTransform = transform2d;
            this.el.style.oTransform = transform2d;
            this.el.style.transform = transform2d;

            this.is3d = false;
        }
    }).bind(this), 0);
},
```
`update` 更新元素的 CSS 样式，根据缩放比例和偏移量设置变换样式。

```javascript
enable: function() {
  this.enabled = true;
},

disable: function() {
  this.enabled = false;
},

destroy: function () {
  window.removeEventListener('resize', this.resizeHandler);

  if (this.container) {
    this.container.remove();
    this.container = null;
  }
}
```
`enable` 和 `disable` 分别启用和禁用手势处理，`destroy` 销毁实例，移除事件监听器并删除容器。

#### 手势检测

```javascript
var detectGestures = function (el, target) {
    var interaction = null,
        fingers = 0,
        lastTouchStart = null,
        startTouches = null,

        setInteraction = function (newInteraction, event) {
            if (interaction !== newInteraction) {

                if (interaction && !newInteraction) {
                    switch (interaction) {
                        case "zoom":
                            target.handleZoomEnd(event);
                            break;
                        case 'drag':
                            target.handleDragEnd(event);
                            break;
                    }
                }

                switch (newInteraction) {
                    case 'zoom':
                        target.handleZoomStart(event);
                        break;
                    case 'drag':
                        target.handleDragStart(event);
                        break;
                }
            }
            interaction = newInteraction;
        },

        updateInteraction = function (event) {
            if (fingers === 2) {
                setInteraction('zoom');
            } else if (fingers === 1 && target.canDrag()) {
                setInteraction('drag', event);
            } else {
                setInteraction(null, event);
            }
        },

        targetTouches = function (touches) {
            return Array.from(touches).map(function (touch) {
                return {
                    x: touch.pageX,
                    y: touch.pageY
                };
            });
        },

        getDistance = function (a, b) {
            var x, y;
            x = a.x - b.x;
            y = a.y - b.y;
            return Math.sqrt(x * x + y * y);
        },

        calculateScale = function (startTouches, endTouches) {
            var startDistance = getDistance(startTouches[0], startTouches[1]),
                endDistance = getDistance(endTouches[0], endTouches[1]);
            return endDistance / startDistance;
        },

        cancelEvent = function (event) {
            event.stopPropagation();
            event.preventDefault();
        },

        detectDoubleTap = function (event) {
            var time = (new Date()).getTime();

            if (fingers > 1) {
                lastTouchStart = null;
            }

            if (time - lastTouchStart < 300) {
                cancelEvent(event);

                target.handleDoubleTap(event);
                switch (interaction) {
                    case "zoom":
                        target.handleZoomEnd(event);
                        break;
                    case 'drag':
                        target.handleDragEnd(event);
                        break;
                }
            } else {
                target.isDoubleTap = false;
            }

            if (fingers === 1) {
                lastTouchStart = time;
            }
        },
        firstMove = true;

    el.addEventListener('touchstart', function (event) {
        if(target.enabled) {
            firstMove = true;
            fingers

 = event.touches.length;

            if (target.options.useDoubleTap) {
                detectDoubleTap(event);
            }
        }
    }, { passive: false });

    el.addEventListener('touchmove', function (event) {
        if(target.enabled && !target.isDoubleTap) {
            if (firstMove) {
                updateInteraction(event);
                if (interaction) {
                    cancelEvent(event);
                }
                startTouches = targetTouches(event.touches);
            } else {
                switch (interaction) {
                    case 'zoom':
                        if (startTouches.length == 2 && event.touches.length == 2) {
                            target.handleZoom(event, calculateScale(startTouches, targetTouches(event.touches)));
                        }
                        break;
                    case 'drag':
                        target.handleDrag(event);
                        break;
                }
                if (interaction) {
                    cancelEvent(event);
                    target.update();
                }
            }

            firstMove = false;
        }
    }, { passive: false });

    el.addEventListener('touchend', function (event) {
        if(target.enabled) {
            fingers = event.touches.length;
            updateInteraction(event);
        }
    });

    if(target.options.useMouseWheel) {

        el.addEventListener("mousewheel", function (event) {
            if (target.enabled) {
                cancelEvent(event);
                target.handleMouseWheel(event);
            }
        });
        
        el.addEventListener("mousedown", function (event) {
            if(target.enabled) {
                firstMove = true;
                fingers = 1;
            }
        }, { passive: true });
        
        el.addEventListener('mousemove', function (event) {
            if(target.enabled) {
                if (firstMove) {
                    updateInteraction(event);
                    if (interaction) {
                        cancelEvent(event);
                    }
                } else {
                    if (interaction === "drag") {
                        target.handleDrag(event);
                    }
                    if (interaction) {
                        cancelEvent(event);
                        target.update();
                    }
                }
                firstMove = false;
            }
        }, { passive: false });

        el.addEventListener("mouseup", function (event) {
            if(target.enabled) {
                fingers = 0;
                updateInteraction(event);
            }
        }, { passive: true });
    }
};
```
`detectGestures` 负责检测手势事件并调用相应的处理函数。根据触摸点和手指数量来判断是缩放还是拖动操作，并触发相应的事件和动画。

```javascript
var PinchZoom = definePinchZoom();

export default PinchZoom;
```
导出 `PinchZoom` 类。

### 实现原理和功能亮点

**实现原理**：

1. **事件处理**：通过监听触摸、拖动、缩放、双击和滚轮等事件，实现对元素的缩放和拖动。
2. **动画和缓动**：实现了平滑的缩放和拖动动画，使用户交互更加流畅。
3. **偏移量和缩放因子计算**：确保元素在缩放和拖动过程中始终保持在容器范围内，通过计算偏移量和缩放因子实现精准的操作。
4. **手势检测**：能够识别多指操作和双击事件，灵活处理不同类型的手势。

**功能亮点**：

1. **跨平台兼容性**：支持现代浏览器，并通过 polyfill 兼容旧版本浏览器。
2. **灵活的配置选项**：用户可以通过传递选项自定义缩放和拖动行为。
3. **自定义事件回调**：允许用户在不同的交互事件中插入自定义逻辑。
4. **自动处理图像加载**：能够检测图像加载状态，确保在图像加载完成后进行正确的偏移和缩放设置。
5. **平滑动画**：实现了缩放和拖动的平滑动画，提供了良好的用户体验。






### 实现思路

为了实现图像文字识别后校验功能，我们需要对 `PinchZoom.js` 进行改造，使其支持两种模式：缩放模式和标注模式。在缩放模式下，用户可以自由地缩放和拖动图片；在标注模式下，用户可以在图像上进行标注，而不是拖动图片。以下是详细的实现思路：

1. **模式切换**：添加一个状态变量来记录当前的模式（缩放模式或标注模式），并提供方法在两种模式之间进行切换。
2. **标注功能**：在标注模式下，允许用户点击图像来添加标注点，并记录这些点的位置。
3. **事件处理**：在不同模式下处理不同的事件。例如，在缩放模式下处理触摸和拖动事件，在标注模式下处理点击事件。

### 修改PinchZoom.js的关键步骤

1. **添加模式变量和切换方法**：
   - 在 `PinchZoom` 类中添加 `mode` 变量和 `toggleMode` 方法。
2. **更新事件处理逻辑**：
   - 根据当前模式处理不同的事件。
3. **添加标注功能**：
   - 在标注模式下记录用户点击的位置，并在图像上显示标注点。

### 示例代码

以下是对 `PinchZoom.js` 的修改示例：

```javascript
var definePinchZoom = function () {
    var PinchZoom = function (el, options) {
        this.el = el;
        this.zoomFactor = 1;
        this.lastScale = 1;
        this.offset = { x: 0, y: 0 };
        this.initialOffset = { x: 0, y: 0 };
        this.mode = 'zoom'; // 默认模式为缩放模式
        this.annotations = []; // 存储标注点
        this.options = Object.assign({}, this.defaults, options);
        this.setupMarkup();
        this.bindEvents();
        this.update();

        if (this.isImageLoaded(this.el)) {
          this.updateAspectRatio();
          this.setupOffsets();
        }

        this.enable();
    };

    PinchZoom.prototype = {
        // ... 现有代码 ...

        toggleMode: function() {
            this.mode = this.mode === 'zoom' ? 'annotate' : 'zoom';
        },

        handleAnnotate: function(event) {
            var pos = this.getPointer(event);
            this.annotations.push(pos);
            this.drawAnnotation(pos);
        },

        drawAnnotation: function(pos) {
            var annotation = document.createElement('div');
            annotation.style.position = 'absolute';
            annotation.style.width = '10px';
            annotation.style.height = '10px';
            annotation.style.backgroundColor = 'red';
            annotation.style.borderRadius = '50%';
            annotation.style.left = (pos.x - 5) + 'px';
            annotation.style.top = (pos.y - 5) + 'px';
            this.container.appendChild(annotation);
        },

        bindEvents: function () {
            var self = this;
            detectGestures(this.container, this);

            this.resizeHandler = this.update.bind(this)
            window.addEventListener('resize', this.resizeHandler);
            Array.from(this.el.querySelectorAll('img')).forEach(function(imgEl) {
              imgEl.addEventListener('load', self.update.bind(self));
            });

            if (this.el.nodeName === 'IMG') {
              this.el.addEventListener('load', this.update.bind(this));
            }

            // 处理点击事件
            this.container.addEventListener('click', function(event) {
                if (self.mode === 'annotate') {
                    self.handleAnnotate(event);
                }
            }, { passive: true });
        },

        // ... 现有代码 ...
    };

    // ... 现有代码 ...

    return PinchZoom;
};

var PinchZoom = definePinchZoom();

export default PinchZoom;
```

### 实现步骤解析

1. **模式切换**：
   - 添加了 `mode` 变量来记录当前模式，默认值为 `'zoom'`。
   - 添加了 `toggleMode` 方法来在缩放模式和标注模式之间切换。

2. **标注功能**：
   - 添加了 `annotations` 数组来存储标注点的位置。
   - 添加了 `handleAnnotate` 方法来处理标注事件，根据点击位置创建标注点，并调用 `drawAnnotation` 方法将标注点显示在图像上。
   - `drawAnnotation` 方法在图像上绘制标注点。

3. **事件处理**：
   - 在 `bindEvents` 方法中，添加了对点击事件的监听。在标注模式下，点击事件会触发 `handleAnnotate` 方法。

### 总结

通过以上修改，我们实现了图像缩放和标注功能的切换。用户可以在缩放模式下自由地缩放和拖动图像，在标注模式下点击图像进行标注。这一功能可以用于OCR文字校验场景，用户可以在识别文字与图像文字进行对比时，标注出不符合的地方。