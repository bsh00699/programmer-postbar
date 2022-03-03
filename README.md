# programmer-postbar

#### 安装PostgreSQL
* [Mac OS 上安装 PostgreSQL](https://www.runoob.com/postgresql/mac-install-postgresql.html)
#### 需要的依赖
```
npm install typeorm -g
npm init --database postgres

npm install express
npm install -D @types/express morgan @types/morgan
npm install -D nodemon
npm install class-validator
npm install bcrypt
npm install -D @types/bcrypt
npm install class-transformer
npm install jsonwebtoken cookie cookie-parser
npm install -D @types/jsonwebtoken @types/cookie @types/cookie-parser
npm i dotenv

```
#### use cli
```
npm run typeorm schema:drop
npm run typeorm migration:generate -- --name create-users-table // migration
npm run typeorm migration:run
```
