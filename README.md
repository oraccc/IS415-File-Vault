# fileVault

## Intall

Make sure your [node.js](https://nodejs.org/en/) version is **v16.13.1**, and you can update your node version through this [tutorial](https://www.html.cn/qa/node-js/10667.html).

```bash
$ node -v  
v16.13.1
```

### GUI

We use [electron](https://www.electronjs.org/) to build the user-side program.

```bash
$ cd gui
$ npm install
```

> If you have encountered some installation problems caused by network connections, try following steps to complete the installation progress :)

```bash
$ cd node_modules/electron
$ node install.js
```

Next, you need to initialize the db.

```bash
$ sudo apt install mysql-server
$ sudo apt install libmysqlclient-dev

# check the status of mysql
$ sudo apt install net-tools
$ sudo netstat -tap | grep mysql

# set the password of the user “root”
$ sudo mysql
> update mysql.user set authentication_string=PASSWORD("123456"), plugin="mysql_native_password" where user="root";
> flush privileges;
> exit;

# restart the mysql server
$ sudo /etc/init.d/mysql restart

# initialize the content related to this project
$ mysql -u root -p
> create database test;
> use test;
> create table user (name varchar(100) not null, password varchar(100) not null);
> exit;
```

Next, compile the netlink into a dynamic link library.

```bash
$ cd netlink
$ gcc -c -fPIC -o netlink.o netlink.c
$ gcc -shared -o libnetlink.so netlink.o
```

The last step, run the project!

```bash
$ cd ..
$ npm start
```

### Kernel

