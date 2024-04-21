import mysql.connector

# 连接到 MySQL 数据库
conn = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database="tt"
)
cursor = conn.cursor()

# 创建表
cursor.execute("CREATE TABLE IF NOT EXISTS customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))")

# 插入数据
sql = "INSERT INTO customers (name, address) VALUES (%s, %s)"
val = ("John", "Highway 21")
cursor.execute(sql, val)
conn.commit()

# 查询数据
cursor.execute("SELECT * FROM customers")
result = cursor.fetchall()
for x in result:
  print(x)

# 关闭连接
cursor.close()
conn.close()
