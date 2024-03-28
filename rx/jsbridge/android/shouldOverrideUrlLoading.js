function callNativeFunction() {
  var iframe = document.createElement('iframe') // 创建一个iframe元素。这个iframe不一定要显示给用户，它的主要目的是发送请求。
  iframe.style.display = 'none' // iframe不需要显示
  iframe.src = 'myapp://doSomething?param=value' // 自定义协议和参数.这个URL包含了要传递给原生代码的信息，
  document.body.appendChild(iframe)
  // 删除iframe元素，不再需要
  setTimeout(function () {
    document.body.removeChild(iframe)
  }, 0)
}

webView.setWebViewClient(new WebViewClient() { // WebViewClient是一个处理各种通知和请求事件的助手类
    @Override // Java中的注解，表示下面的方法重写了父类的方法。
    // 原生代码可以检查这个URL，如果它匹配特定的模式或协议，原生代码可以拦截这个请求，并不让WebView继续加载这个URL。
    // 每当WebView即将加载一个URL时，都会调用这个方法。
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if (url.startsWith("myapp://")) {
            // 请求被拦截，原生代码可以解析URL，提取出命令和参数，执行相应的操作。
            // 原生代码可以通过调用WebView的loadUrl方法，运行JavaScript代码
            // 返回true表示已处理此URL，不再继续加载
            return true;
        }
        return false; // 不是自定义协议，继续正常加载
    }
});
