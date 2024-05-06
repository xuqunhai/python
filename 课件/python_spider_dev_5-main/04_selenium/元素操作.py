from selenium import webdriver
from selenium.webdriver.common.by import By

driver =webdriver.Chrome()

driver.get("https://www.douban.com/")
# 打印页面内容 （获取到以后可以进行后续的xpath,bs4 或者存储等）
print(driver.page_source)

ret4 = driver.find_elements(By.TAG_NAME, "h1")
print(ret4[0].text)
#输出：豆瓣

ret5 = driver.find_elements(By.LINK_TEXT, "下载豆瓣 App")
print(ret5[0].get_attribute("href"))
#输出：https://www.douban.com/doubanapp/app?channel=nimingye

driver.close()