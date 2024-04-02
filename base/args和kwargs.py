# *args和**kwargs
# 一种在函数中处理可变数量参数的方式
# *args看作是将所有传递给函数的额外参数收集到一个元组中。
def sum_numbers(*args):
    total = 0
    for number in args:
        total += number
    return total

# 这个函数可以接受任意数量的参数
print(sum_numbers(1, 2, 3))  # 输出 6
print(sum_numbers(1, 2, 3, 4, 5))  # 输出 15

# **kwargs用于在函数中传递一个可变数量的关键字参数（即命名参数）。
def employee_record(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# 调用函数，传入任意数量的命名参数
employee_record(name="John Doe", age=30, department="Finance")
# 输出：
# name: John Doe
# age: 30
# department: Finance

# 结合使用*args和**kwargs
def function_with_many_arguments(*args, **kwargs):
    print("Positional arguments:", args)
    print("Keyword arguments:", kwargs)

function_with_many_arguments(1, 2, 'three', name='John', age=25)
# 输出：
# Positional arguments: (1, 2, 'three')
# Keyword arguments: {'name': 'John', 'age': 25}


# 非关键字参数（也称为位置参数）必须放在关键字参数前面的要求主要基于两个方面：清晰性和解析逻辑。
# 如果允许关键字参数出现在位置参数之前，那么在函数调用时就会产生歧义，解释器将无法确定哪些参数是为哪些位置分配的。