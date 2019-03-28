## Простое приложение на Riot.js

![Riot](https://riot.js.org/img/logo/riot120x.png)

> Данное руководство распространяется совершенно бесплатно и без каких-либо ограничений. Авторство остаётся за сайтом [riot-js.ru](http://riot-js.ru).

<div id="toc">
  <p><a href="#preparatory-work">Подготовительные работы</a></p>
  <p><a href="#configuration-file">Создание файла конфигурации Webpack</a></p>
  <p><a href="#create-component-hello">Создание компонента Hello</a></p>
  <p><a href="#storage-module">Модуль хранения состояния</a></p>
  <p><a href="#create-component-userlist">Создание компонента UserList</a></p>
</div>


*Давайте разработаем простое приложение, которое охватывает некоторые основные аспекты одностраничных приложений. Мы пройдём вес цикл разработки и в конечном итоге, создадим небольшое приложение использующее [REST](https://ru.wikipedia.org/wiki/REST) API и реализующее все основные операции [CRUD](https://ru.wikipedia.org/wiki/CRUD) (Создание, Чтение, Обновление и Удаление). Для работы мы будем использовать [Riot](https://riot.js.org/) версии **3.13.2** (на момент написания руководства), [Webpack](https://webpack.js.org/) последней версии и [Node.js](https://nodejs.org/en/) должен быть у вас установлен.*

<h3 id="preparatory-work">Подготовительные работы</h3>

Интерактивный пример работы нашего будущего приложения, вы можете увидеть здесь: [Riot Application](http://272758.playcode.io/#!/list)


Вначале, давайте создадим рабочую директорию и точку входа для нашего приложения. Создайте папку с названием **app**, а в ней создайте файл **index.html**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Riot Application</title>
</head>
<body>
  <script src="dist/build.js"></script>
</body>
</html>
```

Мы могли бы создать всё приложение в одном файле Javascript, но в дальнейшем, это затруднило бы навигацию по нашему коду. Вместо этого, давайте разделим код на модули и соберём эти модули в файл **dist/build.js**.

Перейдите в наш рабочий каталог **app**, затем откройте терминал командной строки, перейдите в эту папку в терминале и введите команду:

```
npm init -y
```

> Не забывайте в терминале переходить в папку **app**!

Она создаст файл **package.json**, который содержит описание нашего проекта и управляет его зависимостями. Если вы всё сделали правильно, то вот так вот сейчас выглядит этот файл:

```js
{
  "name": "app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Давайте заменим в этом файле содержимое секции **scripts**, и вместо:
```js
"test": "echo \"Error: no test specified\" && exit 1"
```

пропишем:

```js
"dev": "webpack-dev-server -d --open",
"build": "webpack -p"
```

Теперь наш файл должен выглядеть так:

```js
{
  "name": "app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server -d --open",
    "build": "webpack -p"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Команда **dev** будет отвечать за запуск **Webpack** в режиме разработки, а команда **build** используется для продакшена. На этом, наши ручные манипуляции с файлом **package.json** можно считать законченными.

Для нашей задачи нам потребуется установить несколько пакетов. Сначала установим пакеты необходимые для разработки. Введите в терминале:

```
npm i -D webpack webpack-cli webpack-dev-server
```

Затем, установим пакеты для самого приложения:

```
npm i -S riot riot-route
```

Таким образом, наш файл **package.json** получит следующее содержимое:

```js
{
  "name": "app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server -d --open",
    "build": "webpack -p"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.29.6",
    "webpack-cli": "^3.3.0",
    "webpack-dev-server": "^3.2.1"
  },
  "dependencies": {
    "riot": "^3.13.2",
    "riot-route": "^3.1.4"
  }
}
```

Создадим в нашей папке **app** подпапку **src**, а в ней ещё три папки:

```js
assets, models и views 
```

Структура нашего проекта примет следующий вид:

```js
app/
    node_modules/
    src/
        assets/
        models/
        views/
    index.html
    package.json
```

> Мы не создавали папку **node_modules**, она была создана **npm** (менеджер пакетов Node.js) автоматически, во время установки пакетов.

На этом, подготовительные работы для нашего проекта закончены. Следующим этапом будет создание файла конфигурации для **Webpack** и пробный запуск приложения.
<h3 id="configuration-file">Создание файла конфигурации Webpack</h3>

В нашей папке **app** создайте файл **webpack.config.js** и введите в него следующий код:

```js
const path = require('path')

module.exports = {
  entry: './src/App.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  }
}
```

> Точкой входа **entry** будет файл **App.js**, расположенный в папке **src**, а выводить **output** наш код мы будем в файл **build.js**, расположеный в папке **dist**.

Создайте в папке **src** файл **App.js** и введите в него:

```js
console.log('Hello Riot!')
```

Структура нашего проекта к этому моменту имеет следующий вид:

```js
app/
    node_modules/
    src/
        assets/
        models/
        views/
        App.js
    index.html
    package.json
```

Сохраните файл и запустите терминал из папки **app**. В терминале введите:

```
npm run dev
```

После этого откроется страница в браузере, соответствующая файлу **index.html**. Перейдите в консоль браузера, там вы должны увидеть приветственное сообщение:

```js
> Hello Riot!
```

Мы ещё не раз вернёмся к файлу **webpack.config.js**, а пока, вы можете его закрыть и перейти в папку **views**, где мы создадим наш первый компонент **Hello**, который будет выводить приветственное сообщение на странице.
<h3 id="create-component-hello">Создание компонента Hello</h3>

> Постарайтесь найти для своего редактора расширение, поддерживающие синтаксис **riot** в файлах **.tag**. Это сильно облегчит вам работу в дальнешей. Для редактора [Visual Studio Code](https://code.visualstudio.com/), такое [дополнение](https://github.com/crisward/riot-tag) имеется.

В папке **views** создайте файл **Hello.tag**. В данном файле будет распологаться наш компонент, который мы назовем **r-hello**.

> Все компоненты мы будем хранить в этой папке, поскольку они являются **представлениями**, что исходит из самого её названия.

> Префикс **r-** не является обязательным в названии тега компонента. Этим действием, мы лишь показываем его принадлежность к пользовательским тегам **Riot** и, одновременно, избегаем пересечения в пространстве имён со стандартными **html-элементами**, наподобие **header**. Например, если бы нам потребовался компонент **header**, то мы назвали бы его **r-header**.

В файле **Hello.tag** введите:

```html
<r-hello>
  <h1>Hello Riot!</h1>
</r-hello>
```

Затем, откройте файл **App.js**, закомментируйте или удалите приветствие, и подключите наш тег к приложению:

```js
// подключаем тег в приложение
import './views/Hello.tag'
```

> Точка в начале названия пути **'./views/Hello.tag'**, указывает на его относительную принадлежность.

Нам **не требуется** импортировать наш тег в переменную, вида:

 ```js
import Hello from './views/Hello.tag'
```
поскольку файлы компонентов **не содержат** ни какого экспорта. Мы импортируем тег прямо в файл.

Если мы сейчас попытаемся запустить **Webpack** командой:

```
npm run dev
```

то неизбежно получим сообщение об ошибке синтаксического разбора:

```
ERROR in ./src/views/Hello.tag 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type.
> <r-hello>
|   <h1>Hello Riot!</h1>
| </r-hello>
 @ ./src/App.js 2:0-26
 @ multi (webpack)-dev-server/client?http://localhost:8080 ./src/App.js
```

Из которого можно сделать вывод, что нам потребуется установить соответствующий **загрузчик Webpack**.

> Несмотря на ошибку, **Webpack** не завершает своё выполнение в терминале. Остановить его работу можно командой **Ctrl+C**

Мы будем использовать загрузчик [riot-tag-new-loader](https://www.npmjs.com/package/riot-tag-new-loader).

Откройте терминал из папки **app** или переведите терминал в неё другим способом, и введите команду:

```
npm i -D riot-tag-new-loader
```

> Флаг **-D** указывает на зависимость **devDependencies**, которая используется для процесса разработки, а флаг **-S** на **dependencies**, в которой указываются пакеты, используемые для работы самого приложения.

Наш файл **package.json** теперь выглядит так:

```js
{
  "name": "app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server -d --open",
    "build": "webpack -p"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "riot-tag-new-loader": "^1.0.14",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.3.0",
    "webpack-dev-server": "^3.2.1"
  },
  "dependencies": {
    "riot": "^3.13.2",
    "riot-route": "^3.1.4"
  }
}
```

> Простая установка загрузчика, не избавит нас о вышеуказанной проблемы. Нам нужно будет добавить соответствующие **правила** в файле **webpack.config.js**.

Откроем файл **webpack.config.js** и добавим новое правило в свойство **rules**:

```js
const path = require('path')

module.exports = {
  entry: './src/App.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  },
  // добавляем новое правило для файлов тегов (.tag)
  module: {
    rules: [
      {
        test: /\.tag$/,
        exclude: /(node_modules|bower_components)/,
        use: 'riot-tag-new-loader'
      }
    ]
  }
}
```

Если мы сейчас снова попытаемся запустить **Webpack**:

```
npm run dev
```

то ошибка исчезнет, но ничего интересного, кроме пустой страницы в браузере, мы не увидим.

> Загрузчик лишь компилирует содержимое файлов тегов в обычный **JavaScript**, который **Webpack** подключает к нашему приложению.

Нам потребуется выполнить три завершающих действия:

+ подключить **riot.js** к нашему приложению
+ передать **riot.js** тег **Hello** для монтирования
+ подключить тег к странице **index.html**

Откроем файл **App.js** и в самом верху, **перед** подключением тега, добавим команду импорта:

```js
import riot from 'riot'
```

а в его конце, **после** команды подключения тега, добавим команду монтирования:

```js
riot.mount('r-hello')
```

Теперь наш файл **App.js** должен выглядеть вот так:

```js
// подключаем riot.js в приложение
import riot from 'riot'
// подключаем тег в приложение
import './views/Hello.tag'

// передаём тег для монтирования в riot.js
riot.mount('r-hello')
```

> Мы передаём **riot.js** название тега так, как мы указали его в файле **Hello.tag**, т.е. **r-hello**. Это же название мы будем использовать и при подключении тега на странице, а **Hello.tag** - это просто название файла, в котором хранится наш компонент.

Откроем файл **index.html** и подключим тег в **body**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Riot Application</title>
</head>
<body>

  <!-- подключаем тег -->
  <r-hello />
  
  <script src="build.js"></script>
</body>
</html>
```

И вот теперь, мы снова можем запустить **Webpack**:

```
npm run dev
```

после чего откроется страница в браузере с приветственным сообщением:

# Hello Riot!

Мы можем менять наше сообщение в компоненте **Hello**, и браузер автоматически будет обновлять страницу.

Это достигается благодаря тому, что мы в самом начале установили **webpack-dev-server**, а за само открытие страницы в браузере, отвечает его флаг **--open** команды **dev** в секции **scripts** файла **package.json**

```js
"scripts": {
  "dev": "webpack-dev-server -d --open",
  "build": "webpack -p"
}
```

На этом, мы заканчиваем с ознакомительной частью данного руководства и, уже в следующей части, перейдём непосредственно к написанию нашего приложения. И начнем мы с создания модуля для хранения нашего состояния.
<h3 id="storage-module">Модуль хранения состояния</h3>

В папке **models** создайте файл **User.js**. Наше состояние будет храниться в экземпляре класса **User**. Давайте создадим этот класс, который будет иметь два свойства для хранения данных:

```js
export default class User {

  constructor(riot) {
    this.list = []
    this.current = {}
  }
  
}
```

+ **list** - список пользователей
+ **current** -  текущий пользователь

> Заметьте, что мы используем **экспорт по умолчанию** для нашего класса. Это обычная практика при работе с модулями, содержащими один единственный класс для экспорта, что не отменяет одновременно и **именованный экспорт**, если в этом возникнет такая необходимость.

Теперь давайте добавим код для загрузки некоторых данных с сервера. Для связи с сервером мы будем использовать [Fetch](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch) API, который является [XMLHttpRequest](https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest) нового поколения. Далее мы создадим функцию **getUsers**, которая будет запускать вызов XHR и получать список пользователей с сервера:

```js
export default class User {

  constructor(riot) {
    this.list = []
    this.current = {}
  }

  getUsers() {
    
  }
  
}
```

> В этом руководстве мы будем делать вызовы XHR для [REM](http://rem-rest-api.herokuapp.com/) API, который является фиктивным [REST](https://ru.wikipedia.org/wiki/REST) API для быстрого создания прототипов. Этот API возвращает список пользователей из конечной точки.

Используя **fetch**, выполним XHR-запрос и заполним наш список **list** данными, из этой конечной точки.

```js
export default class User {

  constructor(riot) {
    this.list = []
    this.current = {}
  }

  getUsers() {
    fetch('https://rem-rest-api.herokuapp.com/api/users', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(result => {
        this.list = result.data
      })
  }
  
}
```

+ **method** - метод [HTTP](https://ru.wikipedia.org/wiki/HTTP)
+ **credentials** - отвечает за [Cookie](https://ru.wikipedia.org/wiki/Cookie)

В первом аргументе **fetch** передаётся url адрес для конечной точки API, второй аргумент представляет собой объект с параметрами запроса. В свойстве **method** этого объекта указываем **GET**, а для свойства **credentials** задаём значение **include**, которое указывает на то, что мы используем куки, поскольку это является обязательным требованием для **REM API**.

> Вызов **fetch** возвращает обещание (промис), который, когда ответ будет получен, выполняет функции обратного вызова с объектом [Response](https://developer.mozilla.org/ru/docs/Web/API/Response) или с ошибкой, если запрос не удался. Объект **response** предоставляет методы, позволяющие прочитать тело ответа в необходимом нам формате. В нашем случае, сервер возвращает нам ответ в формате **JSON**, который, с помощью метода **response.json()**, в первом вызове **.then**, преобразуется в объект **JavaScript** и возвращается промис. Следующий **.then** присваивает полученные данные, которые представляют собой массив объектов, свойству **list** нашего объекта класса **User**.

Теперь мы создадим компонет **UserList**, который является представлением для отображения данных из нашего модуля состояния.
<h3 id="create-component-userlist">Создание компонента UserList</h3>

Из папки **views**  удалите файл **Hello.tag**, поскольку компонент **Hello** нам больше не нужен. Удалите так же его подключение из файлов **App.js** и **index.html**. Вот так теперь они должны у вас выглядеть:

**App.js**

```js
// подключаем riot.js в приложение
import riot from 'riot'
```

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Riot Application</title>
</head>
<body>
  <script src="build.js"></script>
</body>
</html>
```

