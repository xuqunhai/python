#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
"""描述了这个脚本的用途：作为Django的命令行工具，用于执行管理任务。"""
import os
import sys
# os 模块用于操作操作系统功能，sys 模块用于处理与Python解释器和它的环境有关的功能，如命令行参数。

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learn.settings') # 设置了环境变量 DJANGO_SETTINGS_MODULE，这是告诉Django项目配置文件（settings file）的位置。如果这个环境变量未被设置，setdefault 方法将其设置为 'learn.settings'，这表示Django应该使用learn项目的settings.py文件。
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv) # 将命令行参数（通过 sys.argv 获取）传递


if __name__ == '__main__':
    main()

# python3 manage.py runserver