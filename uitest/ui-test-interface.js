/* eslint-disable  */
// ui自动化测试需要引入的js库

(async function (win) {
  /*
          录制：autoUITest
          执行：autoUITestRun
          固化：autoTestInterface
      */
  const uaautoUITestRun = /autoUITestRun/.test(navigator.userAgent);
  const uaautoUITest =
    !uaautoUITestRun && /autoUITest/.test(navigator.userAgent);
  const uaautoTestInterface = /autoTestInterface/.test(navigator.userAgent);

  console.log(
    "ui-test-interface.js加载成功",
    uaautoTestInterface,
    uaautoUITest,
    uaautoUITestRun
  );
  if (uaautoTestInterface) {
    if (location.hostname === "localhost") {
      window.cordova = {
        exec: function (suc, err, pn, fn, dataArr) {
          if (fn === "autotest_switch") {
            suc({
              autoTestSwitchValue: 2,
              autoTestInterface: "Y",
            });
          } else if (fn === "recordWebNetData") {
            suc(dataArr);
          } else if (fn === "getWebNetData") {
            suc({
              host: "https://ela-padis-dmzstg2.pa18.com",
              isUsed: true,
              method: "POST",
              path: "/pss-ela-product/product/queryList.shtml",
              requestBody:
                '{"agentNo":"1120103025","shareId":"I%2BlDJf8avmlMkZNIp21ESPi%2BFRRvlrUXPWqxkvevQMQ%3D","appVersion":"8.30","productType":"ZT","showCustomerBusiness":"Y","page":1}',
              requestQuery: "",
              responseBody:
                '{"code":"success","result":{"productJumpUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productdetailZeb.html?isNewWebView=Y","pageBean":{"totalResults":5,"pageSize":10,"currentPage":1,"startIndex":0,"totalPage":1},"productList":[{"productNo":"ZT23080301","detailsUrl":"","productType":"G","insureAge":"10周岁-30周岁","insurancePeriod":"10年","unit":"","productPrice":"0","productItem":"老年,防癌","productName":"0803综拓回归养老险好福利计划书","sellingPoints":"NHP25","imgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20230907/PC-1631168857447-_-_-1694071434184.png","isMashup":"Y","mashupUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-zebApp-vue/module/productExpand.html#/index","isPlanBook":"Y","planBookUrl":"https://ela-padis-dmzstg2.pa18.com/pss-ela-product/getProductProposalUrl.dhtml?pCode=PR110729&agentNo=empno&Y","isCourse":"N","isShare":"Y","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=ZT23080301&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y","originalPrice":"0","productAllSales":"0","detailList":[{"detailsUrl":"","shareTitle":"NHP25","shareData":{"type":"P","shareMethod":"wechat_friend|wechat_friend_circle|esales_social_circle|qrcode|message|cut_picture|cover|share_bitmap","informationNo":"ZT23080301","shareThumbailImg":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221201/226x150-_-_-1669864576680.jpg","shareTitle":"NHP25","shareSummary":"NHP25","isSupportApplets":"Y","weappUserName":"gh_19031b59ab68","weappUrlNew":"/omodule/webview/trd?forceGetUserInfo=N&url=$$jgjWeappShareUrl$$","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=ZT23080301&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y&1&requestId=$$requestId$$&parentCode=$$parentCode$$&shareSource=$$shareSource$$&shareChannel=$$shareChannel$$&shareId=$$shareId$$","shareCopy":[],"msgShareTitle":"中国平安的【0803综拓回归养老险好福利计划书】产品，NHP25，我觉得很适合您，抽空看看呗？","coverPicShareMethod":"","coverPicUrl":"","productSelectedShow":"N","productPrice":"0","shareLocalLink":"","weappImageUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221201/415x335-_-_-1669864592930.jpg"},"cdPointData":{"type":"P","typeNo":"ZT23080301","detailNo":"1"},"detailsImgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221201/226x150-_-_-1669864576680.jpg","rsPointData":{"type":"P","typeNo":"ZT23080301","typeName":"0803综拓回归养老险好福利计划书","detailNo":"1"},"orderNum":"1","detailsName":"NHP25","shareSummary":"NHP25"}],"publishDate":1697074199487,"hits7date":"0","productSortType":1,"isAward":"N","productTypeName":"养老险","productCombineType":"single","commissionRate":"推广费约1%"},{"productNo":"202302070923","detailsUrl":"","productType":"G","insureAge":"1周岁-80周岁","insurancePeriod":"终身","unit":"","productPrice":"","productItem":"老年,重疾","productName":"浙江机构","sellingPoints":"产品","imgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20230207/160160-_-_-1675733006505.jpg","isMashup":"Y","mashupUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-zebApp-vue/module/productExpand.html#/index","isPlanBook":"Y","planBookUrl":"https://m.lifeapp.pingan.com.cn/m/shopevo/web/index.html#/peh/egis/202302070923?isProposal=Y","isCourse":"N","isShare":"Y","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=202302070923&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y","originalPrice":"","productAllSales":"0","detailList":[{"detailsUrl":"","shareTitle":"啊手动阀","shareData":{"type":"P","shareMethod":"wechat_friend|wechat_friend_circle|esales_social_circle|qrcode|message|cut_picture|cover|share_bitmap","informationNo":"202302070923","shareThumbailImg":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20230207/226150-_-_-1675733039056.jpg","shareTitle":"啊手动阀","shareSummary":"打赏","isSupportApplets":"N","weappUserName":"","weappUrlNew":"","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=202302070923&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y&1&requestId=$$requestId$$&parentCode=$$parentCode$$&shareSource=$$shareSource$$&shareChannel=$$shareChannel$$&shareId=$$shareId$$","shareCopy":[],"msgShareTitle":"中国平安的【浙江机构】产品，打赏，我觉得很适合您，抽空看看呗？","coverPicShareMethod":"","coverPicUrl":"","productSelectedShow":"N","productPrice":"","shareLocalLink":"","weappImageUrl":""},"cdPointData":{"type":"P","typeNo":"202302070923","detailNo":"1"},"detailsImgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20230207/226150-_-_-1675733039056.jpg","rsPointData":{"type":"P","typeNo":"202302070923","typeName":"浙江机构","detailNo":"1"},"orderNum":"1","detailsName":"阿斯蒂","shareSummary":"打赏"}],"publishDate":1678170027319,"hits7date":"0","productSortType":1,"isAward":"N","productTypeName":"养老险","productCombineType":"single","commissionRate":"推广费约6%"},{"productNo":"ZT113005","detailsUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/100x100-_-_-1669796179760.jpg,https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/112x112-_-_-1669796182298.png,https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/145x145-_-_-1669796184681.jpg,https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/1-_-_-1669796186672.jpg,https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/1x1-_-_-1669796188666.jpg,https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/200x120uuuu-_-_-1669796191232.jpg,https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/100x100-_-_-1669796193965.jpg","productType":"H","insureAge":"10周岁-50周岁","insurancePeriod":"30年","unit":"元起","productPrice":"50","productItem":"个人,防癌","productName":"个险-健康险-所有数据填写","sellingPoints":"个险-产品-所有数据填写","imgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/PC-1669172940247-_-_-1669795975642.png","isMashup":"Y","mashupUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-zebApp-vue/module/productExpand.html#/index","isPlanBook":"Y","planBookUrl":"https://m.lifeapp.pingan.com.cn/m/shopevo/web/index.html#/peh/health/ZT113005?isProposal=Y","isCourse":"N","isShare":"Y","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=ZT113005&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y","originalPrice":"100","productAllSales":"0","detailList":[{"detailsUrl":"","shareTitle":"图文类1-图片版分享标题","shareData":{"type":"P","shareMethod":"wechat_friend|wechat_friend_circle|esales_social_circle|qrcode|message|cut_picture|cover|share_bitmap","informationNo":"ZT113005","shareThumbailImg":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/226x150ttt-_-_-1669796267826.jpg","shareTitle":"图文类1-图片版分享标题","shareSummary":"图文类1-图片版分享简介","isSupportApplets":"Y","weappUserName":"gh_19031b59ab68","weappUrlNew":"/omodule/webview/trd?forceGetUserInfo=N&url=$$jgjWeappShareUrl$$","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=ZT113005&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y&1&requestId=$$requestId$$&parentCode=$$parentCode$$&shareSource=$$shareSource$$&shareChannel=$$shareChannel$$&shareId=$$shareId$$","shareCopy":["图文类1-图片版转发文案111111","图文类1-图片版转发文案222222","图文类1-图片版转发文案333333"],"msgShareTitle":"中国平安的【个险-健康险-所有数据填写】产品，图文类1-图片版分享简介，我觉得很适合您，抽空看看呗？","coverPicShareMethod":"","coverPicUrl":"","productSelectedShow":"N","productPrice":"50","shareLocalLink":"","weappImageUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/415x335rrrr-_-_-1669796377203.jpg"},"cdPointData":{"type":"P","typeNo":"ZT113005","detailNo":"1"},"detailsImgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/226x150ttt-_-_-1669796267826.jpg","rsPointData":{"type":"P","typeNo":"ZT113005","typeName":"个险-健康险-所有数据填写","detailNo":"1"},"orderNum":"1","detailsName":"图文类1-图片版","shareSummary":"图文类1-图片版分享简介"},{"detailsUrl":"https://www.baidu.com","shareTitle":"图文类1-链接版分享标题","shareData":{"type":"P","shareMethod":"wechat_friend|wechat_friend_circle|esales_social_circle|qrcode|message|cut_picture|cover|share_bitmap","informationNo":"ZT113005","shareThumbailImg":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/226x150-_-_-1669796438064.jpg","shareTitle":"图文类1-链接版分享标题","shareSummary":"图文类1-链接版分享简介","isSupportApplets":"Y","weappUserName":"gh_19031b59ab68","weappUrlNew":"/omodule/webview/trd?forceGetUserInfo=N&url=$$jgjWeappShareUrl$$","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=ZT113005&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y&1669796382368&requestId=$$requestId$$&parentCode=$$parentCode$$&shareSource=$$shareSource$$&shareChannel=$$shareChannel$$&shareId=$$shareId$$","shareCopy":["图文类1-链接版转发文案"],"msgShareTitle":"中国平安的【个险-健康险-所有数据填写】产品，图文类1-链接版分享简介，我觉得很适合您，抽空看看呗？","coverPicShareMethod":"","coverPicUrl":"","productSelectedShow":"N","productPrice":"50","shareLocalLink":"","weappImageUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/415x335-_-_-1669796477440.jpg"},"cdPointData":{"type":"P","typeNo":"ZT113005","detailNo":"1669796382368"},"detailsImgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/226x150-_-_-1669796438064.jpg","rsPointData":{"type":"P","typeNo":"ZT113005","typeName":"个险-健康险-所有数据填写","detailNo":"1669796382368"},"orderNum":"1669796382368","detailsName":"图文类1-链接版","shareSummary":"图文类1-链接版分享简介"},{"detailsUrl":"","shareTitle":"小视频类分享标题","shareData":{"type":"P","shareMethod":"wechat_friend|wechat_friend_circle|esales_social_circle|qrcode|message|cut_picture|cover|share_bitmap","informationNo":"ZT113005","shareThumbailImg":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/226x150-_-_-1669796510193.png","shareTitle":"小视频类分享标题","shareSummary":"小视频类分享简介","isSupportApplets":"Y","weappUserName":"gh_19031b59ab68","weappUrlNew":"/omodule/webview/trd?forceGetUserInfo=N&url=$$jgjWeappShareUrl$$","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=ZT113005&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y&1669796483153&requestId=$$requestId$$&parentCode=$$parentCode$$&shareSource=$$shareSource$$&shareChannel=$$shareChannel$$&shareId=$$shareId$$","shareCopy":["小视频类转发文案"],"msgShareTitle":"中国平安的【个险-健康险-所有数据填写】产品，小视频类分享简介，我觉得很适合您，抽空看看呗？","coverPicShareMethod":"","coverPicUrl":"","productSelectedShow":"N","productPrice":"50","shareLocalLink":"","weappImageUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/415x335rrrr-_-_-1669796569863.jpg"},"cdPointData":{"type":"P","typeNo":"ZT113005","detailNo":"1669796483153"},"detailsImgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221130/226x150-_-_-1669796510193.png","rsPointData":{"type":"P","typeNo":"ZT113005","typeName":"个险-健康险-所有数据填写","detailNo":"1669796483153"},"orderNum":"1669796483153","detailsName":"产品贴-小视频类","shareSummary":"小视频类分享简介"}],"publishDate":1669798436505,"hits7date":"0","productSortType":1,"isAward":"N","productTypeName":"健康险","productCombineType":"single","commissionRate":"推广费约8%"},{"productNo":"C01C51","detailsUrl":"","productType":"P","insureAge":"18周岁-66周岁","insurancePeriod":"55周岁","unit":"元/年 起","productPrice":"0","productItem":"个人,赠险","productName":"平安车险_勿动1","sellingPoints":"买车险就是买平安,车险相伴 保障相随222","imgUrl":"https://salescmscdn.pa18.com/shareStatic/eLifeAssist/201711/eLifeAssist_a5es-_-_-1510551799482.png","isMashup":"Y","mashupUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-zebApp-vue/module/productExpand.html#/index","isPlanBook":"Y","planBookUrl":"https://test-stg2-salescms-paids.pa18.com/as/autoInsurancevue/module/citySelect.html#/index?campaignSource=ELA_PLAN_OPEN","isCourse":"N","isShare":"Y","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=C01C51&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y","originalPrice":"0","productAllSales":"261","detailList":[{"detailsUrl":"","shareTitle":"平安车险-买车险就是买平安","shareData":{"type":"P","shareMethod":"wechat_friend|wechat_friend_circle|esales_social_circle|qrcode|message|cover|cut_picture|share_bitmap","informationNo":"C01C51","shareThumbailImg":"https://salescmscdn.pa18.com/shareStatic/eLifeAssist/201711/eLifeAssist_a5es-_-_-1510551799482.png","shareTitle":"平安车险-买车险就是买平安","shareSummary":"买车险就是买平安,车险相伴 保障相随","isSupportApplets":"N","weappUserName":"","weappUrlNew":"","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=C01C51&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y&1&requestId=$$requestId$$&parentCode=$$parentCode$$&shareSource=$$shareSource$$&shareChannel=$$shareChannel$$&shareId=$$shareId$$","shareCopy":["24小时咨询,快速精准报价,买车险不花冤枉钱!私家车商业险多省15%!买汽车保险当然首选平安!\\n大品牌,有保障!买车险，就是买平安","低价车险，为爱车量身定制；7*24小时极速服务，全国通赔，免费服务&hellip;&hellip;买车险就要买平安！","车险快到期了？还在担心出险后理赔困难，过程繁琐？平安车险先赔付再修车！为您提供行业领先的车险服务，快捷投保、闪电出单、更有每天24小时免费道路援助，全年不打烊。"],"msgShareTitle":"中国平安的【平安车险_勿动1】产品，买车险就是买平安,车险相伴 保障相随，我觉得很适合您，抽空看看呗？","coverPicShareMethod":"","coverPicUrl":"","productSelectedShow":"N","productPrice":"0","shareLocalLink":"","weappImageUrl":""},"cdPointData":{"type":"P","typeNo":"C01C51","detailNo":"1"},"detailsImgUrl":"https://salescmscdn.pa18.com/shareStatic/eLifeAssist/201711/eLifeAssist_a5es-_-_-1510551799482.png","rsPointData":{"type":"P","typeNo":"C01C51","typeName":"平安车险_勿动1","detailNo":"1"},"orderNum":"1","detailsName":"平安车险","shareSummary":"买车险就是买平安,车险相伴 保障相随"},{"detailsUrl":"","shareTitle":"高保额三责险，给自己和他人最贴心的爱护","shareData":{"type":"P","shareMethod":"wechat_friend|wechat_friend_circle|esales_social_circle|qrcode|message|cover|cut_picture","informationNo":"C01C51","shareThumbailImg":"https://salescmscdn.pa18.com/shareStatic/eLifeAssist/201711/eLifeAssist_a5es-_-_-1510551799482.png","shareTitle":"高保额三责险，给自己和他人最贴心的爱护","shareSummary":"高保额三责险，给自己和他人最贴心的爱护","isSupportApplets":"N","weappUserName":"","weappUrlNew":"","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=C01C51&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y&1505957447652&requestId=$$requestId$$&parentCode=$$parentCode$$&shareSource=$$shareSource$$&shareChannel=$$shareChannel$$&shareId=$$shareId$$","shareCopy":["保险其实就是一种风险转移，商业三责险是为了弥补交强险赔付不足而设置的险种。\\n豪车遍地，生命无价。投保高保额三责险，为自己和他人的家庭负责。\\n"],"msgShareTitle":"中国平安的【平安车险_勿动1】产品，高保额三责险，给自己和他人最贴心的爱护，我觉得很适合您，抽空看看呗？","coverPicShareMethod":"","coverPicUrl":"","productSelectedShow":"N","productPrice":"0","shareLocalLink":"","weappImageUrl":""},"cdPointData":{"type":"P","typeNo":"C01C51","detailNo":"1505957447652"},"detailsImgUrl":"https://salescmscdn.pa18.com/shareStatic/eLifeAssist/201711/eLifeAssist_a5es-_-_-1510551799482.png","rsPointData":{"type":"P","typeNo":"C01C51","typeName":"平安车险_勿动1","detailNo":"1505957447652"},"orderNum":"1505957447652","detailsName":"高保额三责","shareSummary":"高保额三责险，给自己和他人最贴心的爱护"},{"detailsUrl":"","shareTitle":"车险理赔快捷服务","shareData":{"type":"P","shareMethod":"wechat_friend|wechat_friend_circle|esales_social_circle|qrcode|message|cover|cut_picture|share_bitmap","informationNo":"C01C51","shareThumbailImg":"https://salescmscdn.pa18.com/shareStatic/eLifeAssist/201812/eLifeAssist_aeqb-_-_-1545014972689.png","shareTitle":"车险理赔快捷服务","shareSummary":"车险理赔快捷服务","isSupportApplets":"N","weappUserName":"","weappUrlNew":"","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=C01C51&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y&1545014855979&requestId=$$requestId$$&parentCode=$$parentCode$$&shareSource=$$shareSource$$&shareChannel=$$shareChannel$$&shareId=$$shareId$$","shareCopy":[],"msgShareTitle":"中国平安的【平安车险_勿动1】产品，车险理赔快捷服务，我觉得很适合您，抽空看看呗？","coverPicShareMethod":"","coverPicUrl":"","productSelectedShow":"N","productPrice":"0","shareLocalLink":"","weappImageUrl":""},"cdPointData":{"type":"P","typeNo":"C01C51","detailNo":"1545014855979"},"detailsImgUrl":"https://salescmscdn.pa18.com/shareStatic/eLifeAssist/201812/eLifeAssist_aeqb-_-_-1545014972689.png","rsPointData":{"type":"P","typeNo":"C01C51","typeName":"平安车险_勿动1","detailNo":"1545014855979"},"orderNum":"1545014855979","detailsName":"理赔服务","shareSummary":"车险理赔快捷服务"}],"publishDate":1691978931563,"hits7date":"999","productSortType":2,"isAward":"N","productTypeName":"产险","productCombineType":"single","commissionRate":"推广费约1%"},{"productNo":"ZT110359","detailsUrl":"","productType":"G","insureAge":"25周岁-35周岁","insurancePeriod":"10周岁","unit":"","productPrice":"0","productItem":"老年,意外","productName":"综拓高频工具关联测试1103","sellingPoints":"转寿险操作","imgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/shortVideoNas/nas/20221103/186699-_-_-1667456437741.jpg","isMashup":"Y","mashupUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-zebApp-vue/module/productExpand.html#/index","isPlanBook":"Y","planBookUrl":"https://m.lifeapp.pingan.com.cn/m/shopevo/web/index.html#/peh/egis/ZT110359?isProposal=Y","isCourse":"N","isShare":"Y","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=ZT110359&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y","originalPrice":"0","productAllSales":"0","detailList":[{"detailsUrl":"","shareTitle":"转寿险操作","shareData":{"type":"P","shareMethod":"wechat_friend|wechat_friend_circle|esales_social_circle|qrcode|message|cut_picture|cover|share_bitmap","informationNo":"ZT110359","shareThumbailImg":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221103/400-_-_-1667465150658.jpg","shareTitle":"转寿险操作","shareSummary":"转寿险操作","isSupportApplets":"N","weappUserName":"","weappUrlNew":"","shareUrl":"https://pssdevopsbd.pa18.com/stg2/as/kde-elaDetail-vue/module/productDetail.html?agentNo=1120103025&productNo=ZT110359&isWechatAuth=Y&prdSource=zeb&isNewWebView=Y&1&requestId=$$requestId$$&parentCode=$$parentCode$$&shareSource=$$shareSource$$&shareChannel=$$shareChannel$$&shareId=$$shareId$$","shareCopy":[],"msgShareTitle":"中国平安的【综拓高频工具关联测试1103】产品，转寿险操作，我觉得很适合您，抽空看看呗？","coverPicShareMethod":"","coverPicUrl":"","productSelectedShow":"N","productPrice":"0","shareLocalLink":"","weappImageUrl":""},"cdPointData":{"type":"P","typeNo":"ZT110359","detailNo":"1"},"detailsImgUrl":"https://test-stg2-salescms-paids.pa18.com/shareStatic/pssAmsZeb/pssAmsZebNasByNscf/nas/20221103/400-_-_-1667465150658.jpg","rsPointData":{"type":"P","typeNo":"ZT110359","typeName":"综拓高频工具关联测试1103","detailNo":"1"},"orderNum":"1","detailsName":"转寿险操作","shareSummary":"转寿险操作"}],"publishDate":1678170129539,"hits7date":"0","productSortType":2,"isAward":"N","productTypeName":"养老险","productCombineType":"single","commissionRate":"推广费约10%"}]}}',
              responseCode: "200",
            });
          }
        },
      };
    }

    !(function (t, e) {
      for (const r in e) t[r] = e[r];
    })(
      window,
      (function (t) {
        function e(n) {
          if (r[n]) return r[n].exports;
          const o = (r[n] = { i: n, l: !1, exports: {} });
          return t[n].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
        }
        var r = {};
        return (
          (e.m = t),
          (e.c = r),
          (e.i = function (t) {
            return t;
          }),
          (e.d = function (t, r, n) {
            e.o(t, r) ||
              Object.defineProperty(t, r, {
                configurable: !1,
                enumerable: !0,
                get: n,
              });
          }),
          (e.n = function (t) {
            const r =
              t && t.__esModule
                ? function () {
                    return t.default;
                  }
                : function () {
                    return t;
                  };
            return e.d(r, "a", r), r;
          }),
          (e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
          }),
          (e.p = ""),
          e((e.s = 3))
        );
      })([
        function (t, e, r) {
          function n(t, e) {
            const r = {};
            for (const n in t) r[n] = t[n];
            return (r.target = r.currentTarget = e), r;
          }
          function o(t) {
            function e(e) {
              return function () {
                const r = this.hasOwnProperty(`${e}_`)
                  ? this[`${e}_`]
                  : this.xhr[e];
                const n = (t[e] || {}).getter;
                return (n && n(r, this)) || r;
              };
            }
            function r(e) {
              return function (r) {
                const o = this.xhr;
                const i = this;
                const u = t[e];
                if (e.substring(0, 2) === "on")
                  (i[`${e}_`] = r),
                    (o[e] = function (u) {
                      (u = n(u, i)),
                        (t[e] && t[e].call(i, o, u)) || r.call(i, u);
                    });
                else {
                  const s = (u || {}).setter;
                  (r = (s && s(r, i)) || r), (this[`${e}_`] = r);
                  try {
                    o[e] = r;
                  } catch (t) {}
                }
              };
            }
            function o(e) {
              return function () {
                const r = [].slice.call(arguments);
                if (t[e]) {
                  const n = t[e].call(this, r, this.xhr);
                  if (n) return n;
                }
                return this.xhr[e].apply(this.xhr, r);
              };
            }
            return (
              (window[s] = window[s] || XMLHttpRequest),
              (XMLHttpRequest = function () {
                const t = new window[s]();
                for (const n in t) {
                  let i = "";
                  try {
                    i = u(t[n]);
                  } catch (t) {}
                  i === "function"
                    ? (this[n] = o(n))
                    : Object.defineProperty(this, n, {
                        get: e(n),
                        set: r(n),
                        enumerable: !0,
                      });
                }
                const a = this;
                (t.getProxy = function () {
                  return a;
                }),
                  (this.xhr = t);
              }),
              window[s]
            );
          }
          function i() {
            window[s] && (XMLHttpRequest = window[s]), (window[s] = void 0);
          }
          Object.defineProperty(e, "__esModule", { value: !0 });
          var u =
            typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    typeof Symbol === "function" &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                };
          (e.configEvent = n), (e.hook = o), (e.unHook = i);
          var s = "_rxhr";
        },
        function (t, e, r) {
          function n(t) {
            if (h) return h;
            //                            throw 'Proxy already exists'
            return (h = new f(t));
          }
          function o() {
            (h = null), (0, d.unHook)();
          }
          function i(t) {
            return t.replace(/^\s+|\s+$/g, "");
          }
          function u(t) {
            return t.watcher || (t.watcher = document.createElement("a"));
          }
          function s(t, e) {
            const r = t.getProxy();
            const n = `on${e}_`;
            const o = (0, d.configEvent)({ type: e }, r);
            r[n] && r[n](o), u(t).dispatchEvent(new Event(e, { bubbles: !1 }));
          }
          function a(t) {
            (this.xhr = t), (this.xhrProxy = t.getProxy());
          }
          function c(t) {
            function e(t) {
              a.call(this, t);
            }
            return (e[b] = Object.create(a[b])), (e[b].next = t), e;
          }
          function f(t) {
            function e(t, e) {
              const r = new P(t);
              if (!f) return r.resolve();
              const n = {
                response: e.response,
                status: e.status,
                statusText: e.statusText,
                config: t.config,
                headers:
                  t.resHeader ||
                  t
                    .getAllResponseHeaders()
                    .split("\r\n")
                    .reduce(function (t, e) {
                      if (e === "") return t;
                      const r = e.split(":");
                      return (t[r.shift()] = i(r.join(":"))), t;
                    }, {}),
              };
              f(n, r);
            }
            function r(t, e, r) {
              const n = new H(t);
              const o = { config: t.config, error: r };
              h ? h(o, n) : n.next(o);
            }
            function n() {
              return !0;
            }
            function o(t, e) {
              return r(t, this, e), !0;
            }
            function a(t, r) {
              return (
                t.readyState === 4 && t.status !== 0
                  ? e(t, r)
                  : t.readyState !== 4 && s(t, w),
                !0
              );
            }
            const c = t.onRequest;
            var f = t.onResponse;
            var h = t.onError;
            return (0, d.hook)({
              onload: n,
              onloadend: n,
              onerror: o,
              ontimeout: o,
              onabort: o,
              onreadystatechange(t) {
                return a(t, this);
              },
              open(t, e) {
                const n = this;
                const o = (e.config = { headers: {} });
                (o.method = t[0]),
                  (o.url = t[1]),
                  (o.async = t[2]),
                  (o.user = t[3]),
                  (o.password = t[4]),
                  (o.xhr = e);
                const i = `on${w}`;
                e[i] ||
                  (e[i] = function () {
                    return a(e, n);
                  });
                const u = function (t) {
                  r(e, n, (0, d.configEvent)(t, n));
                };
                if (
                  ([x, y, g].forEach(function (t) {
                    const r = `on${t}`;
                    e[r] || (e[r] = u);
                  }),
                  c)
                )
                  return !0;
              },
              send(t, e) {
                const r = e.config;
                if (
                  ((r.withCredentials = e.withCredentials), (r.body = t[0]), c)
                )
                  return (
                    setTimeout(function () {
                      c(r, new m(e));
                    }),
                    !0
                  );
              },
              setRequestHeader(t, e) {
                return (e.config.headers[t[0].toLowerCase()] = t[1]), !0;
              },
              addEventListener(t, e) {
                const r = this;
                if (l.indexOf(t[0]) !== -1) {
                  const n = t[1];
                  return (
                    u(e).addEventListener(t[0], function (e) {
                      const o = (0, d.configEvent)(e, r);
                      (o.type = t[0]), (o.isTrusted = !0), n.call(r, o);
                    }),
                    !0
                  );
                }
              },
              getAllResponseHeaders(t, e) {
                const r = e.resHeader;
                if (r) {
                  let n = "";
                  for (const o in r) n += `${o}: ${r[o]}\r\n`;
                  return n;
                }
              },
              getResponseHeader(t, e) {
                const r = e.resHeader;
                if (r) return r[(t[0] || "").toLowerCase()];
              },
            });
          }
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.proxy = n),
            (e.unProxy = o);
          let h;
          var d = r(0);
          var l = [
            "load",
            "loadend",
            "timeout",
            "error",
            "readystatechange",
            "abort",
          ];
          const v = l[0];
          const p = l[1];
          var y = l[2];
          var x = l[3];
          var w = l[4];
          var g = l[5];
          var b = "prototype";
          a[b] = Object.create({
            resolve(t) {
              const e = this.xhrProxy;
              const r = this.xhr;
              (e.readyState = 4),
                (r.resHeader = t.headers),
                (e.response = e.responseText = t.response),
                (e.statusText = t.statusText),
                (e.status = t.status),
                s(r, w),
                s(r, v),
                s(r, p);
            },
            reject(t) {
              (this.xhrProxy.status = 0), s(this.xhr, t.type), s(this.xhr, p);
            },
          });
          var m = c(function (t) {
            const e = this.xhr;
            (t = t || e.config),
              e.open(t.method, t.url, !1 !== t.async, t.user, t.password);
            for (const r in t.headers) e.setRequestHeader(r, t.headers[r]);
            e.send(t.body);
          });
          var P = c(function (t) {
            this.resolve(t);
          });
          var H = c(function (t) {
            this.reject(t);
          });
        },
        ,
        function (t, e, r) {
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.ah = void 0);
          const n = r(0);
          const o = r(1);
          e.ah = {
            proxy: o.proxy,
            unProxy: o.unProxy,
            hook: n.hook,
            unHook: n.unHook,
          };
        },
      ])
    );

    function autoUiTestSleep(time = 500) {
      return new Promise((res, rej) => {
        const timer = setTimeout(function () {
          clearTimeout(timer);
          res();
        }, time);
      });
    }

    async function uitestWait(time) {
      await autoUiTestSleep(time);
    }

    const nativeFns = {
      retryTimes: 0,
      // UI自动化测试开关查询：autoTestSwitchValue 3 常规测试包；1 录制状态； 2 执行状态;  autoTestSwitch N 录制，Y 不能录制  兼容老包
      autotestSwitch: async function () {
        return new Promise(async (resolve, reject) => {
          if (window.cordova && window.cordova.exec) {
            window.cordova.exec(
              (res) => resolve(res),
              (err) => resolve(err),
              "KdePlugin",
              "autotest_switch",
              []
            );
          } else {
            await uitestWait();
            if (window.cordova && window.cordova.exec) {
              window.cordova.exec(
                (res) => resolve(res),
                (err) => resolve(err),
                "KdePlugin",
                "autotest_switch",
                []
              );
            } else {
              reject("jsbridge初始化未完成");
            }
          }
        });
      },
      // 在录制状态时，H5调用接口获取数据后，通过JSAPI把接口的信息给到native，native缓存下来，包含接口的url、入参、出参等信息
      recordWebNetData: (options) => {
        return new Promise((resolve, reject) => {
          options = options || {};
          if (window.cordova && window.cordova.exec) {
            window.cordova.exec(
              (res) => {
                resolve(res);
              },
              (err) => resolve(err),
              "KdePlugin",
              "recordWebNetData",
              [options]
            );
          } else {
            reject("jsbridge初始化未完成");
          }
        });
      },
      // 在执行状态时，H5调用JSAPI获取native刚刚缓存的数据，native需要把刚刚缓存的数据返回给H5，H5不走后端接口，用native返回的数据展示
      getWebNetData: (options) => {
        return new Promise((resolve, reject) => {
          options = options || {};
          if (window.cordova && window.cordova.exec) {
            window.cordova.exec(
              (res) => {
                resolve(res);
              },
              (err) => resolve(err),
              "KdePlugin",
              "getWebNetData",
              [options]
            );
          } else {
            reject("jsbridge初始化未完成");
          }
        });
      },
    };

    async function getAppStatus() {
      const { autoTestSwitchValue, autoTestInterface } =
        await nativeFns.autotestSwitch();
      // autoTestSwitchValue 3 常规测试包；1 录制状态； 2 执行状态
      // autoTestInterface N 走网络请求，Y 走本地数据
      return {
        isUiTestRecording: autoTestSwitchValue == 1,
        isUiTestRunning: autoTestSwitchValue == 2,
        isUiTestInterface: autoTestInterface === "Y",
      };
    }

    let isUiTestRecording = false, // 录制状态
      isUiTestRunning = false, // 执行状态
      isUiTestInterface = false; // 是否需要数据固化

    if (uaautoUITestRun || uaautoUITest) {
      isUiTestRecording = uaautoUITest;
      isUiTestRunning = uaautoUITestRun;
      isUiTestInterface = uaautoTestInterface;
    } else {
      if (!window.cordova || !window.cordova.exec) {
        await uitestWait();
      }
      const appStatus = await getAppStatus();
      isUiTestRecording = appStatus.isUiTestRecording; // 录制状态
      isUiTestRunning = appStatus.isUiTestRunning; // 执行状态
      isUiTestInterface = appStatus.isUiTestInterface; // 是否需要数据固化
    }

    function jsonStringify(obj) {
      var cache = [];
      var json_str = JSON.stringify(obj, function (key, value) {
        if (typeof value === "object" && value !== null) {
          if (cache.indexOf(value) !== -1) {
            return;
          }
          cache.push(value);
        }
        return value;
      });
      cache = null;
      return json_str;
    }

    function getOptions(config) {
      const { url, method, body, status } = config;
      let host = "";
      let path = "";
      if (url) {
        const urlArr = url.split("//");
        const urlArr2 = urlArr[1].split("/");
        host = `${urlArr[0]}//${urlArr2[0]}`;
        path = `/${urlArr2.slice(1).join("/")}`;
        const stampInUrl = /[1-9][0-9]{12}/.exec(path);
        console.log("stampInUrl", stampInUrl);
        if (stampInUrl) {
          path = path.replace(stampInUrl[0], "");
          console.log("url存在时间戳，修改后为", path);
        }
      }
      return {
        host,
        path,
        method,
        requestBody: method !== "GET" ? (body ? body : "") : "",
        requestQuery: method === "GET" ? (body ? body : "") : "",
        responseCode: status,
        responseBody: jsonStringify(config),
      };
    }

    async function getResponseFromNative(config) {
      const options = getOptions(config);
      const nativeRes = await nativeFns.getWebNetData(options);
      return nativeRes;
    }
    async function storeResponseToNative(config) {
      const options = getOptions(config);
      await nativeFns.recordWebNetData(options);
    }

    console.log(
      "window.ah.proxy",
      isUiTestInterface,
      isUiTestRunning,
      isUiTestRecording
    );
    window.ah.proxy({
      // 请求发起前进入
      onRequest: async (config, handler) => {
        const isRequest =
          !/\.json|\.html|pssdevopsbd|salescdn|salescms|ELA_/.test(config.url);
        if (isUiTestInterface && isRequest) {
          config.headers["x-version-tag"] = "Y";
        }
        if (isUiTestRunning && isUiTestInterface && isRequest) {
          const resFromNative = await getResponseFromNative(config);
          if (resFromNative) {
            const responseObj =
              typeof resFromNative === "object"
                ? resFromNative
                : JSON.parse(resFromNative);
            // console.log("!!responseObj.responseBody", !!responseObj.responseBody);
            if (responseObj.responseBody) {
              const responseBody =
                typeof responseObj.responseBody === "object"
                  ? responseObj.responseBody
                  : JSON.parse(responseObj.responseBody);
              handler.resolve({
                response: responseBody.response
                  ? responseBody.response
                  : responseBody,
              });
              return true; // 返回true阻止xhr.open调用。
            }
          }
        }
        handler.next(config);
      },
      // 请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
      onError: (err, handler) => {
        if (isUiTestRecording && isUiTestInterface) {
          storeResponseToNative(err);
        }

        handler.next(err);
      },
      // 请求成功后进入
      onResponse: (response, handler) => {
        const res = { ...response, ...response.config };
        if (isUiTestRecording && isUiTestInterface) {
          storeResponseToNative(res);
        }

        handler.next(response);
      },
    });
  }
})(window);
