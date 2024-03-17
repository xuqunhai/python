import socket

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# 绑定端口:服务器绑定UDP端口和TCP端口互不冲突，也就是说，UDP的9999端口与TCP的9999端口可以各自绑定。
s.bind(('127.0.0.1', 9999))
# 绑定端口和TCP一样，但是不需要调用listen()方法，而是直接接收来自任何客户端的数据：

print('Bind UDP on 9999...')
while True:
    # 接收数据:
    data, addr = s.recvfrom(1024)
    print('Received from %s:%s.' % addr)
    s.sendto(b'Hello, %s!' % data, addr)