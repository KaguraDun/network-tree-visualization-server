# Network tree visualization server
Node.js, Express, PostgreSQL, TypeScript

Сервер с базой данных расположен на heroku и доступен через api. Для локального тестирования требуется создать базу данных с такими параметрами:

```bash
{
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    host: 'localhost',
}
```
И изменить параметр в файле 'src/db/connectDB.ts' на Mode.deveolpment.

```javascript
const db = new pg.Pool(pgConnect[Mode.development]);
```

## Структура базы данных
| id: primary-key | parent_id: foreign-key | name      | ip    | port |  
|-----------------|------------------------|-----------|-------|------|
|0                |null                    |root       |0.0.0.0|8081  |
|1                |0                       |root-node  |0.0.0.0|8081  |   

## Апи:
URL: https://network-tree-visualization.herokuapp.com/api/
Для тестирования я использовал postman

## Маршруты:
```bash
GET: / : Получить доступные пути;
GET: /node : Получить корневой узел;
GET: /node/:id/children : Получить дочерние элементы для конкретного узла;

POST: /node : Добавить новый узел;

DELETE: /node/:id : Удалить конкретный узел;

PUT: /node/:id : Изменить данные конкретного узла;
```

## Развёртывание
Для установки зависимостей
```bash
npm install
```
### Запуск
Для запуска в режиме разработки
```bash
npm run start:dev
```

Для запуска сервера
```bash
npm run build
npm run start
```
### Production Билд
```bash
npm run build
```
### Запуск линтера
```bash
npm run lint
```
### Запуск автоматического исправления ошибок линтера
```bash
npm run lint:fix
```

## Зависимости
*  npm : 8.3.1
*  node : 16.14.0
*  @babel/runtime  :   ^7.15.4  ,
*  cors  :   ^2.8.5  ,
*  express  :   ^4.17.1  ,
*  express-list-endpoints  :   ^6.0.0  ,
*  morgan  :   ^1.10.0  ,
*  pg  :   ^8.7.3  ,
*  rimraf  :   ^3.0.2  