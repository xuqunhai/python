
// 步骤 1：在Android原生应用中设置WebView并注入JavaScript接口
// 应用中的每个屏幕都对应着一个 Activity 实例。有自己的生命周期，包含一个或多个用户界面组件（XML文件里定义）。通过 Intent 进行通信和数据传递。
public class MyActivity extends Activity {
    @Override // Java中的注解，表示下面的方法重写了父类的方法。
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my);
        // 声明变量myWebView，类型是WebView，
        // 在Activity的界面布局中找到一个具有ID webview 的视图，并将转换为WebView对象使用。
        WebView myWebView = (WebView) findViewById(R.id.webview);
        // 获取了WebView的设置对象
        WebSettings webSettings = myWebView.getSettings();
        // 默认情况下，为了安全考虑，WebView可能不允许执行JavaScript。将JavaScript设置为启用，可以让WebView加载的网页运行JavaScript代码。
        webSettings.setJavaScriptEnabled(true);
        // 创建了一个名为AndroidBridge的JavaScript接口
        // JS可以通过AndroidBridge这个全局对象来调用WebAppInterface实例的方法。
        // addJavascriptInterface(Object obj, String interfaceName)
        //   允许你将一个Java对象映射到你的WebView中的JavaScript代码。
        //   obj：这是你想要在JavaScript中使用的Java对象。
        //   interfaceName：这是一个字符串，表示你的Java对象在JavaScript中的名称。
        myWebView.addJavascriptInterface(new WebAppInterface(this), "AndroidBridge");
        // WebView加载一个网页
        myWebView.loadUrl("file:///android_asset/my_web_page.html");
    }

    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface // WebAppInterface公共方法必须包含用@JavascriptInterface注解的
        public void openGallery() { // 用于打开Android设备的相册。
            // Intent启动相册选择
            Intent intent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            ((Activity) mContext).startActivityForResult(intent, REQUEST_CODE);
        }
    }

    // 处理选择的图片 - 当用户在相册中选择了一张图片后，Android的onActivityResult方法会被触发
    @Override // Java中的注解，表示下面的方法重写了父类的方法。
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_CODE && resultCode == RESULT_OK && data != null) {
            Uri selectedImage = data.getData();
            // 将图片路径转换为绝对路径
            String imagePath = getPathFromURI(selectedImage);
            // 通过JSBridge将图片路径传回H5页面
            // 通过调用WebView的loadUrl方法，执行H5页面中的updateImageJavaScript函数，将选中的图片显示在网页上。
            myWebView.loadUrl("javascript:updateImage('" + imagePath + "')");
        }
    }
}



// 步骤 2：在H5页面中调用原生接口打开相册
<html>
<body>
    <img id="selectedImage" src="" />
    <button onclick="openGallery()">选择图片</button>

    <script type="text/javascript">
        function openGallery() {
            // 调用原生方法
            AndroidBridge.openGallery();
        }

        function updateImage(imagePath) {
            // 更新页面中的图片
            document.getElementById('selectedImage').src = imagePath;
        }
    </script>
</body>
</html>
