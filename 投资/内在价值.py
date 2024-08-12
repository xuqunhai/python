import numpy as np

# 设定参数
free_cash_flows_pingan = [500, 550, 600, 650, 700]
free_cash_flows_gree = [300, 330, 360, 390, 420]
r = 0.10
g = 0.03

def calculate_dcf(free_cash_flows, r, g):
    # 计算每年的折现值
    years = len(free_cash_flows)
    discounted_cash_flows = [fcf / (1 + r) ** (i + 1) for i, fcf in enumerate(free_cash_flows)]
    # 计算终值并折现
    terminal_value = free_cash_flows[-1] * (1 + g) / (r - g)
    discounted_terminal_value = terminal_value / (1 + r) ** years
    # 总和
    intrinsic_value = sum(discounted_cash_flows) + discounted_terminal_value
    return intrinsic_value

# 计算内在价值
intrinsic_value_pingan = calculate_dcf(free_cash_flows_pingan, r, g)
intrinsic_value_gree = calculate_dcf(free_cash_flows_gree, r, g)

print(intrinsic_value_pingan)
print(intrinsic_value_gree)