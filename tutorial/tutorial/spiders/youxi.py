import scrapy
from tutorial.items import TutorialItem

class YouxiSpider(scrapy.Spider):
    name = "youxi"
    allowed_domains = ["4399.com"]
    start_urls = ["https://4399.com"]

    def parse(self, response):
        # pass
        # response.text  # 页面源代码
        # response.xpath()  # 通过xpath方式提取
        # response.css()  # 通过css方式提取
        # response.json() # 提取json数据

        # 用我们最熟悉的方式: xpath提取游戏名称, 游戏类别, 发布时间等信息
        li_list = response.xpath("//ul[@class='n-game cf']/li")
        for li in li_list:
            name = li.xpath("./a/b/text()").extract_first()
            category = li.xpath("./em/a/text()").extract_first()
            date = li.xpath("./em/text()").extract_first()

            # dic = {
            #     "name": name,
            #     "category": category,
            #     "date": date
            # }
            # # 将提取到的数据提交到管道内.
            # # 注意, 这里只能返回 request对象, 字典, item数据, or None
            # yield dic

            item = TutorialItem()
            item["name"] = name
            item["category"] = category
            item["date"] = date
            yield item
