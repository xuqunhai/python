# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class TutorialItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    # pass

    # 定义数据结构
    name = scrapy.Field()
    category = scrapy.Field()
    date = scrapy.Field()

    print(name, category, date)