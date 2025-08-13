@echo off
chcp 65001
echo 正在验证数据库设置...
echo.
echo 请输入MySQL root用户的密码：
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p --default-character-set=utf8mb4 greenhouse_db < src/main/resources/sql/verify-setup.sql
echo.
echo 数据库验证完成！
pause