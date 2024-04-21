from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
# 访问百度
driver.get("http://www.baidu.com/")
# print(driver.page_source)
print(driver.current_url)
print(driver.title)
print(driver.get_cookies())
# # 截图
# driver.save_screenshot("baidu-selenium.png")

# selenium的定位操作
# 搜索关键字 杜卡迪
driver.find_element(By.ID, "kw").send_keys("许群海")
# 点击id为su的搜索按钮
driver.find_element(By.ID, "su").click()
# 元素定位的八种方法:
# By.ID 使用id值定位
# By.XPATH 使用xpath定位
# By.TAG_NAME. 使用标签名定位
# By.LINK_TEXT使用超链接文本定位
# By.PARTIAL_LINK_TEXT 使用部分超链接文本定位
# By.NAME 使用name属性值定位
# By.CLASS_NAME 使用class属性值定位
# By.CSS_SELECTOR 使用css选择器定位

# driver.close()  # 退出当前页面
# driver.quit()   # 退出浏览器