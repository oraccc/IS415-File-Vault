# fileVault

## Intall

### gui

Use [electron](https://www.electronjs.org/).

```bash
sudo apt-get install nodejs npm
cd gui
npm install --save-dev electron@^8.5.5
```

Init  database mysql.

```bash
sudo apt install mysql-server
sudo apt install libmysqlclient-dev

# check the status of mysql
sudo apt install net-tools
sudo netstat -tap | grep mysql

# set the password of the user “root”
sudo su
mysql
> update mysql.user set authentication_string=PASSWORD("123456"), plugin=‘mysql_native_password’ where user="root";
> flush privileges;
> exit;

# restart the mysql server
sudo /etc/init.d/mysql restart

# initialize the content related to this project
mysql -u root -p
> create database test;
> use test;
> create table (name varchar(100) not null, password varchar(100) not null);
> exit;
```

start gui.

```bash
npm start
```

### krnl

****************
