import pandas as pd
import numpy as np

# 假设我们有一只基金的历史数据
# 日期和基金净值
data = {
    'Date': pd.date_range(start='2023-01-01', periods=200, freq='D'),
    'NAV': np.random.normal(loc=1.0, scale=0.02, size=200).cumprod()  # 模拟的净值数据
}
df = pd.DataFrame(data)

# 定期定额投资策略
daily_investment = 100  # 每天投资100元
df['Regular_Investment'] = daily_investment
df['Regular_Shares'] = df['Regular_Investment'] / df['NAV']
df['Regular_Total_Shares'] = df['Regular_Shares'].cumsum()

# 下跌定投策略
df['Price_Change'] = df['NAV'].pct_change()
df['Downward_Investment'] = np.where(df['Price_Change'] < 0, daily_investment, 0)
df['Downward_Shares'] = df['Downward_Investment'] / df['NAV']
df['Downward_Total_Shares'] = df['Downward_Shares'].cumsum()

# 计算总投资金额
regular_total_investment = df['Regular_Investment'].sum()
downward_total_investment = df['Downward_Investment'].sum()

# 计算最终收益
regular_final_value = df['Regular_Total_Shares'].iloc[-1] * df['NAV'].iloc[-1]
downward_final_value = df['Downward_Total_Shares'].iloc[-1] * df['NAV'].iloc[-1]

print(f"定期定额策略最终投资金额: {regular_total_investment:.2f} 元，最终价值: {regular_final_value:.2f} 元")
print(f"下跌定投策略最终投资金额: {downward_total_investment:.2f} 元，最终价值: {downward_final_value:.2f} 元")
