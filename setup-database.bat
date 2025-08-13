@echo off
chcp 65001
echo 正在设置温室数字化监控系统数据库...
echo.
echo 请输入MySQL root用户的密码：
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p --default-character-set=utf8mb4 < database-setup-complete.sql
echo.
echo 数据库设置完成！
pause