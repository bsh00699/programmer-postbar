# programmer-postbar
Crazy Bar(娱乐、社交、新闻网站)
#### 技术栈
##### 服务端
* 采用nodejs作为服务端，因为它擅长处理I/O密集型任务，可以快速处理数据和响应
* 框架使用Express(完全个人喜好，如果你更加喜欢精简的koa也是OK的)，因为它可以帮助我们组织页面路由，可以添加中间件执行我们想要的任何处理
* ORM使用TypeORM，它可以与 TypeScript 和 JavaScript (ES5,ES6,ES7,ES8)一起使用。 它的目标是始终支持最新的 JavaScript 特性并提供额外的特性以帮助你开发任何使用数据库的应用程序。另外你不需要配置任何东西就可以轻松使用typescript
##### 前端
* 前端框架采用react,因为它使用广泛，拥有不用的套件库，来满足我们开发中的任何需求或者问题
* 服务端渲染采用Next.js,因为它支持静态生成 (SSG) 、服务器端渲染 (SSR)、TypeScript、智能化打包、 路由预取等功能 无需任何配置
* CSS方面使用tailwindcss,因为它集成了诸如 flex, pt-4, text-center 和 rotate-90 这样的的类，它们能直接在脚本标记语言中组合起来，构建出任何设计
* 搭配SWR减轻服务器压力

#### 安装PostgreSQL
* [Mac OS 上安装 PostgreSQL](https://www.runoob.com/postgresql/mac-install-postgresql.html)
#### seed
```
npm run typeorm schema:drop
npm run seed
```
#### start
```
npm run dev
```
#### use cli migration
```
npm run typeorm schema:drop
npm run typeorm migration:generate -- --name create-users-table
npm run typeorm migration:run
npm run typeorm migration:generate -- --name create-comments-table
npm run typeorm migration:run
npm run typeorm migration:revert
```
