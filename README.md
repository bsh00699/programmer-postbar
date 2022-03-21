# programmer-postbar
一个为程序员提供交流的平台(当然交流内容不仅仅是code,可以是身边好玩的事或物)，类似于StackOverflow
#### 技术栈
##### 服务端
* 采用nodejs作为服务端，因为它擅长处理I/O密集型任务，可以快速处理数据和响应
* 框架使用Express(完全个人喜好，如果你更加喜欢精简的koa也是OK的)，因为它可以帮助我们组织页面路由，可以添加中间件执行我们想要的任何处理
* ORM使用TypeORM，它可以与 TypeScript 和 JavaScript (ES5,ES6,ES7,ES8)一起使用。 它的目标是始终支持最新的 JavaScript 特性并提供额外的特性以帮助你开发任何使用数据库的应用程序。另外你不需要配置任何东西就可以轻松使用typescript
##### 前端
* 前端框架采用react,因为它使用广泛，拥有不用的套件库，来满足我们开发中的任何需求或者问题
* 服务端渲染采用Next.js,因为它支持静态生成 (SSG) 、服务器端渲染 (SSR)、TypeScript、智能化打包、 路由预取等功能 无需任何配置
* CSS方面使用tailwindcss,因为它集成了诸如 flex, pt-4, text-center 和 rotate-90 这样的的类，它们能直接在脚本标记语言中组合起来，构建出任何设计

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
#### use cli migration
```
npm run typeorm schema:drop
// user
npm run typeorm migration:generate -- --name create-users-table
npm run typeorm migration:run

// comments
npm run typeorm migration:generate -- --name create-comments-table
npm run typeorm migration:run

// 撤销上一次migration
npm run typeorm migration:revert
```
