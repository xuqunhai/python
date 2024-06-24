import requests
import execjs

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Content-Type": "text/xml;charset=UTF-8",
    "Origin": "https://www.ccprec.com",
    "Referer": "https://www.ccprec.com/projectSecPage/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\""
}
url = "https://www.ccprec.com/honsanCloudAct"
data = '0063hmk53gjur5aq2a28xa5w6t485j5w69657q6f6g7u5j7i6e40687h6b6s4d616o5s7b7k4w6b9i6s92645o828j798x5p4c809e9g8v7o6h6i5h55475v6t65607u5a466g9f8g8h7m7o9a6k65617d5q796e5h4q5w7k6p817s4e6b5y5p8p6p767j8r8g736o7v857y93837m7r7o617w3s646p576a7g5s567n7k666s4a6v926k7x5y7s876v8l7d4z5i736i816q3v607g3s764a678f8r8w8g7o7g68837g7s5x7u8p5y93574e7e736g6l5w4m7q6r5n6e5b7a9b5v6z6b5o7w7a7d744r597c7m968f54587m61534z6b847x957y7x6l647h8m7j7x637b6h8h5i5r8i6h6b6l4i3v7b716p676d6p5j527x4g567x7k9685614a6s667d624c66795y795q5u725y5x695f526o7d916z4b6r7j4t6b674r876i5f675b5y967f7i7s7g968o7y8b4m6j655l8q6r4x4e7q6r606r625r6u6g5w664w7j7s8h7c6s5m7k7p7d7q62717a4o6j3u4g845z6u5v5s6y6z899s806g76827v7o41658u5c9f7a5o4l8p918w9a7a7t6o5q76756w726y96925n6c8v818k9f6r8z8g5e7a6z6b9l585z6p5l5w6z7h716j5k555y5p7n6z5x9j6i5v715v4u6h7r6g81595f67585e5p64827k94735o6m6n6d7d5m4d7i6f5c635f5q63'.encode('unicode_escape')
response = requests.post(url, headers=headers, data=data)

# print('response.text')
# print(response.text)
# print('response')
# print(response)

# 读取 JavaScript 文件
with open('pachong/aes.js', 'r') as file:
    js_code = file.read()

# 编译 JavaScript 代码
context = execjs.compile(js_code)

# 调用 JavaScript 文件中的方法并获取结果
result = context.call("get", response.text)
print(result)