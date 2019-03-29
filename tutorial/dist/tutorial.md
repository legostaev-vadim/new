## Простое приложение на Riot.js

![Riot](https://riot.js.org/img/logo/riot120x.png)

> Данное руководство распространяется совершенно бесплатно и без каких-либо ограничений. Авторство остаётся за сайтом **[riot-js.ru](http://riot-js.ru/)**.

<div id="toc">
  <p><a href="#preparatory-work">Подготовительные работы</a></p>
  <p><a href="#configuration-file">Создание файла конфигурации Webpack</a></p>
  <p><a href="#create-component-hello">Создание компонента Hello</a></p>
  <p><a href="#storage-module">Модуль хранения состояния</a></p>
  <p><a href="#create-component-userlist">Создание компонента UserList</a></p>
</div>

*Давайте разработаем простое приложение, которое охватывает некоторые основные аспекты одностраничных приложений. Мы пройдём вес цикл разработки и в конечном итоге, создадим небольшое приложение использующее **[REST](https://ru.wikipedia.org/wiki/REST) API** и реализующее все основные операции **[CRUD](https://ru.wikipedia.org/wiki/CRUD)** (Создание, Чтение, Обновление и Удаление). Для работы мы будем использовать **[Riot.js](https://riot.js.org/)** версии **3.13.2** (на момент написания руководства), **[Webpack](https://webpack.js.org/)** последней версии и **[Node.js](https://nodejs.org/en/)** должен быть у вас установлен. Кроме этого, вы должны иметь базовые знания по **Riot.js**, поэтому, если их у вас нет, прочитайте **[Учебник](http://riot-js.ru/guide)** и изучите **[API](http://riot-js.ru/api)**.*

<h3 id="preparatory-work">Подготовительные работы</h3>

Интерактивный пример работы нашего будущего приложения, вы можете увидеть здесь: **[Riot Application](http://272758.playcode.io/#!/list)**


Мы начнём с создания рабочей директории и точки входа для нашего приложения. Создайте папку с названием **app**, а в ней создайте файл **index.html**:

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

> Мы могли бы создать всё приложение в одном файле **Javascript**, но в дальнейшем, это затруднило бы навигацию по нашему коду. Вместо этого, давайте разделим код на модули и соберём эти модули в файл **dist/build.js**.

Перейдите в наш рабочий каталог **app**, затем откройте терминал командной строки, перейдите в эту папку в терминале и введите команду:

```
npm init -y
```

> Не забывайте в терминале переходить в папку **app**! Терминал должен ссылаться на неё при вводе всех команд.

Она создаст файл **package.json**, который содержит описание нашего проекта и управляет его зависимостями. Если вы всё сделали правильно, то вот так сейчас выглядит этот файл:

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

Создадим в нашей папке **app** подпапку **src**, а в неё добавим ещё три папки:

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

На этом, подготовительные работы для нашего проекта окончены. Следующим шагом будет создание файла конфигурации для **Webpack** и пробный запуск приложения.
<h3 id="configuration-file">Создание файла конфигурации Webpack</h3>

В нашей папке **app** создайте файл **webpack.config.js** и введите в него следующий код:

```js
const path = require('path')

module.exports = {
  entry: './src/App.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js',
    publicPath: 'dist/'
  }
}
```

Точкой входа приложения будет файл **App.js**, расположенный в папке **src**, а выводить наш код мы будем в файл **build.js**, расположеный в папке **dist**.

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

Сохраните файл и запустите терминал из папки **app**. В терминале введите команду:

```
npm run dev
```

После этого откроется страница в браузере, соответствующая файлу **index.html**. Перейдите в консоль браузера, там вы должны увидеть приветственное сообщение:

```js
> Hello Riot!
```

Закройте файл **webpack.config.js** и перейдите в папку **views**, где мы создадим наш первый компонент **Hello**, который будет выводить приветственное сообщение на странице.
<h3 id="create-component-hello">Создание компонента Hello</h3>

> Постарайтесь найти для своего редактора расширение, поддерживающие синтаксис **riot** в файлах **.tag**. Это сильно облегчит вам работу в дальнешей. Для редактора **[Visual Studio Code](https://code.visualstudio.com/)**, такое **[дополнение](https://github.com/crisward/riot-tag)** имеется.

В папке **views** создайте файл **Hello.tag**. В данном файле будет распологаться наш компонент, который мы назовем **r-hello**.

> Все компоненты мы будем хранить в этой папке, поскольку они являются **представлениями** в терминологии **Riot.js**.

Префикс **r-** не является обязательным в названии тега компонента. Этим действием, мы лишь показываем его принадлежность к пользовательским тегам **riot** и, одновременно, избегаем пересечения в пространстве имён со стандартными **html-элементами**, наподобие **header**. Например, если бы нам потребовался компонент **header**, то мы назвали бы его **r-header**.

В файле **Hello.tag** введите:

```html
<r-hello>
  <h1>Hello Riot!</h1>
</r-hello>
```

Затем, откройте файл **App.js**, удалите приветствие и подключите наш компонент к приложению:

```js
// подключаем компонент Hello
import './views/Hello.tag'
```

Точка в начале названия пути **'./views/Hello.tag'** компонента, определяет относительный путь к нему от файла **App.js**.

> Нам **не требуется** импортировать наш компонент в переменную, вида:

 ```js
import Hello from './views/Hello.tag'
```
> Поскольку файлы компонентов **не содержат** никакого экспорта, мы импортируем их содержимое прямо в файл нашего приложения.

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

Мы будем использовать загрузчик **[riot-tag-new-loader](https://www.npmjs.com/package/riot-tag-new-loader)**.

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

Простая установка загрузчика, не избавит нас о вышеуказанной проблемы. Нам нужно будет добавить соответствующие **правила** в файле **webpack.config.js**.

Откроем файл **webpack.config.js** и добавим новое правило в свойство **rules**:

```js
const path = require('path')

module.exports = {
  entry: './src/App.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js',
    publicPath: 'dist/'
  },
  // добавляем новое правило для файлов компонентов (.tag)
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

> Загрузчик лишь компилирует содержимое файлов компонентов в обычный **JavaScript**, который **Webpack** затем подключает к нашему приложению.

Нам потребуется выполнить три завершающих действия:

+ подключить **Riot.js** к нашему приложению
+ передать **Riot.js** тег **Hello** для монтирования
+ подключить тег к странице **index.html**

Откроем файл **App.js** и в самом его верху, **перед** подключением компонента, добавим команду импорта:

```js
import riot from 'riot'
```

а в конце файла, **после** подключением компонента, команду монтирования:

```js
riot.mount('r-hello')
```

Теперь наш файл **App.js** должен выглядеть так:

```js
// подключаем Riot.js
import riot from 'riot'

// подключаем компонент Hello
import './views/Hello.tag'

// монтируем компонент Hello
riot.mount('r-hello')
```

Мы передаём в **Riot.js** название компонента так, как мы указали его в файле **Hello.tag**, т.е. **r-hello**. Это же название мы будем использовать и при подключении компонента к странице, а **Hello.tag** - это просто название файла, в котором хранится наш компонент.

Откроем файл **index.html** и подключим компонент к странице:

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

  <!-- подключаем компонент Hello к странице -->
  <r-hello />

  <script src="dist/build.js"></script>
</body>
</html>
```

И вот теперь, мы снова можем перезапустить **Webpack**:

```
npm run dev
```

после чего, откроется наша страница в браузере с приветственным сообщением:

# Hello Riot!

Мы можем менять наше сообщение в компоненте **Hello**, и браузер автоматически будет обновлять страницу.

Это достигается благодаря тому, что мы в самом начале установили **webpack-dev-server**, а за само открытие страницы в браузере, отвечает его флаг **--open** команды **dev** в секции **scripts** файла **package.json**

```js
"scripts": {
  "dev": "webpack-dev-server -d --open",
  "build": "webpack -p"
}
```

Мы закончили с ознакомительной частью данного руководства и, уже в следующей, перейдём непосредственно к написанию нашего приложения. И начнём мы с создания модуля для хранения его состояния.
<h3 id="storage-module">Модуль хранения состояния</h3>

В папке **models** создайте файл **User.js**. Наше состояние будет храниться в экземпляре класса **User**. Давайте создадим этот класс, который будет иметь два свойства для хранения данных:

```js
export default class User {

  constructor() {
    this.list = []
    this.current = {}
  }
  
}
```

+ свойство **list** - это список пользователей
+ свойство **current** - это текущий пользователь

> Заметьте, что мы используем **экспорт по умолчанию** для нашего класса. Это обычная практика при работе с модулями, содержащими один единственный класс для экспорта, что не отменяет одновременно и **именованный экспорт**, если в этом возникнет такая необходимость.

Теперь давайте добавим код для загрузки некоторых данных с сервера. Для связи с сервером мы будем использовать **[Fetch](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch) API**, который является **[XMLHttpRequest](https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest)** нового поколения.

Создайте метод **getUsers**, который будет запускать вызов **XHR** и получать список пользователей с сервера:

```js
export default class User {

  constructor() {
    this.list = []
    this.current = {}
  }

  getUsers() {
    
  }
  
}
```

> В этом руководстве, мы будем делать вызовы **XHR** для **[REM](http://rem-rest-api.herokuapp.com/) API**, который является фиктивным **[REST](https://ru.wikipedia.org/wiki/REST) API** для быстрого создания прототипов. Этот **API** возвращает список пользователей из конечной точки.

Используя **fetch**, выполним **XHR**-запрос и заполним наш список **list** данными из конечной точки:

```js
export default class User {

  constructor() {
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

+ свойство **method** - это метод **[HTTP](https://ru.wikipedia.org/wiki/HTTP)**
+ свойство **credentials** - отвечает за **[Cookie](https://ru.wikipedia.org/wiki/Cookie)**

В первом аргументе **fetch** передаётся **url** адрес для конечной точки **API**, второй аргумент представляет собой объект с параметрами запроса. В свойстве **method** этого объекта пишем **GET**, а для свойства **credentials** задаём значение **include**, которое указывает на то, что мы используем **куки**, поскольку это является обязательным требованием для **[REM](http://rem-rest-api.herokuapp.com/) API**.

Вызов **fetch** возвращает **промис**, который, когда ответ будет получен, выполняет функции обратного вызова с объектом **[Response](https://developer.mozilla.org/ru/docs/Web/API/Response)** или с ошибкой, если запрос не удался. Объект **response** предоставляет методы, позволяющие прочитать тело ответа в необходимом нам формате. В нашем случае, сервер возвращает нам ответ в формате **JSON**, который, с помощью метода **json()** объекта **response** в первом вызове **.then**, преобразуется в объект **JavaScript** и возвращается промис. Следующий **.then** присваивает полученные данные, которые представляют собой массив объектов **JavaScript**, свойству **list** нашего экземпляра класса **User**.

Теперь мы создадим компонет **UserList**, который является представлением и служит для отображения данных из нашего модуля состояния.
<h3 id="create-component-userlist">Создание компонента UserList</h3>

Из папки **views**  удалите файл **Hello.tag**, поскольку компонент **Hello** нам больше не нужен. Удалите и его подключение из файлов **App.js** и **index.html**. Вот так теперь они должны у вас выглядеть:

**App.js**

```js
// подключаем Riot.js
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

В папке **views** создайте файл **UserList.tag**:

```html
<r-list>

  <div class="list">
    
  </div>

</r-list>
```

Наш компонент пока содержит только шаблон, в виде пустого списка с классом **list**. Стили и логику мы добавим позже.

Теперь давайте обратимся к списку пользователей из модели, которую мы создали ранее, чтобы динамически пройти по всем данным. Добавьте в компонент **UserList** ссылки на пользователей:

```html
<r-list>

  <div class="list">

    <!-- добавляем ссылки на пользователей -->
    <a href="#!/edit/{ id }" class="list__item" each={ list } key={ id }>{ firstName } { lastName }</a>

  </div>

</r-list>
```

В ссылке имеется атрибут **each**, который отвечает за реализацию циклов в **Riot.js**. Он получает свойство **list** объекта компонента, которое, впоследствии, будет ссылаться на одноимённое свойство экземпляра объекта класса **User**, и представляет из себя массив объектов получаемых от сервера. Каждый объект в этом массиве содержит свойства: **id**, **firstName** и **lastName**. В приведённом выше примере, мы просто выводим содержимое этих свойст в ссылку для каждого пользователя.

Вот как выглядит **[JSON](https://ru.wikipedia.org/wiki/JSON)**-файл получаемый с сервера:

```js
{
  "data": [
    {
      "id": 1,
      "firstName": "Peter",
      "lastName": "Mackenzie"
    },
    {
      "id": 2,
      "firstName": "Cindy",
      "lastName": "Zhang"
    },
    {
      "id": 3,
      "firstName": "Ted",
      "lastName": "Smith"
    },
    {
      "id": 4,
      "firstName": "Susan",
      "lastName": "Fernbrook"
    },
    {
      "id": 5,
      "firstName": "Emily",
      "lastName": "Kim"
    },
    {
      "id": 6,
      "firstName": "Peter",
      "lastName": "Zhang"
    },
    {
      "id": 7,
      "firstName": "Cindy",
      "lastName": "Smith"
    },
    {
      "id": 8,
      "firstName": "Ted",
      "lastName": "Fernbrook"
    },
    {
      "id": 9,
      "firstName": "Susan",
      "lastName": "Kim"
    },
    {
      "id": 10,
      "firstName": "Emily",
      "lastName": "Mackenzie"
    }
  ],
  "offset": 0,
  "limit": 10,
  "total": 25
}
```

В объекте нашей модели данных класса **User**, мы определили свойство **list**, которое является массивом и будет хранить содержимое свойства **data**, возвращаемого с сервера файла **JSON**. Последние три свойства в этом файле: **offset**, **limit** и **total** используются исключительно для уточнения запросов. Мы воспользуемся свойством **limit** позже, для указания количества выводимых пользователей. По умолчанию оно равно 10.

Добавим немного стилей в наш компонент. Стили в компоненте размещаются между стандартными тегами **style**:

```html
<r-list>

  <div class="list">

    <!-- добавляем ссылки на пользователей -->
    <a href="#!/edit/{ id }" class="list__item" each={ list } key={ id }>{ firstName } { lastName }</a>

  </div>

  <!--  добавляем стили  -->
  <style>
    .list {
      list-style: none;
      margin: 0 0 10px;
      padding: 0;
    }
    .list__item {
      background: #fafafa;
      border: 1px solid #ddd;
      color: #333;
      display: block;
      margin: 0 0 1px;
      padding: 8px 15px;
      text-decoration: none;
    }
    .list__item:hover {
      text-decoration: underline;
    }
  </style>

</r-list>
```

> Файл компонента представляет из себя обычный **HTML**, но с некоторыми усовершенствованиями, засчет возможностей **Riot.js**.

Последнее, что нам осталось сделать, это определить логику нашего компонента. Её можно разместить как между тегами **script**, так и просто в теле компонента. Мы будем использовать первый вариант.

Итак, нам нужно получить список пользователей с сервера и вывести их в нашем компоненте. Т.е. нам нужно вызвать метод **getUsers** экземплара класса **User**. Этот метод заполнит массив **list** данного класса полученными данными от сервера, а уже потом, мы сможем на него сослаться из нашего компонента и прогнать в цикле.

Для подобных целей, **Riot.js** предоставляет **примеси** и **наблюдателя**. Наблюдатель позволяет отслеживать события и выполнять соответствующие действия при их наступлении, а примеси, позволят расширить функциональность нашего компонента, добавив в него возможность эти события ловить и правильно на нах реагировать.

Давайте сделаем нашу модель данных наблюдаемой. Откройте файл **User.js** и в конструктор класса **User** добавьте параметр **riot**, через который мы будем ссылаться на библиотеку **Riot.js**, и в конце этого конструктора, добавьте команду:

```js
riot.observable(this)
```
Эта команда делает **наблюдаемым**, каждый возвращаемый экземпляр объекта класса **User**:

```js
constructor(riot) {
  this.list = []
  this.current = {}
  // делаем объект модели данных наблюдаемым
  riot.observable(this)
}
```

Теперь наш модуль хранения состояния выглядит так:

```js
export default class User {

  constructor(riot) {
    this.list = []
    this.current = {}
    // делаем объект модели данных наблюдаемым
    riot.observable(this)
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

Наш объект модели данных теперь сможет запускать события, но в этом не будет никакого смысла, поскольку обработчики этих событий должны распологаться в компонентах, а они, попросту пока не могут контактировать с нашим наблюдателем. И для этого, в **Riot.js** предусмотрены **примеси**, которые позволяют расширить функциональность наблюдателя нашей модели данных на любые компонеты.

Откройте главный файл приложения **App.js**. Давайте создадим примесь **user**, которая будет ссылаться на экземпляр наблюдаемой модели данных класса **User**:

```js
// подключаем Riot.js
import riot from 'riot'

// подключаем модель данных User
import User from './models/User'

// создаём общую примесь user и передаём в конструктор модели данных User
// ссылку на библиотеку Riot.js, в виде аргумента riot
riot.mixin({ user: new User(riot) })
```

> Обратите внимание, что во время создания примеси **user**, мы передали в наш класс **ссылку** на библиотеку **Riot.js**, через аргумент **riot** класса **User**, которая будет доступна через одноимённый параметр данного класса. Также заметьте, что перед этим, мы подключили **модель данных** в приложение.

Осталось научить наши компоненты реагировать на события, которые будет генерировать наша модель данных, после успешного получения данных от сервера. Но прежде, давайте на минуту вернёмся в модуль нашей модели данных и научим нашу модель запускать эти самые события, после успешного ответа сервера.

Откройте файл **User.js** и в функции **getUsers**, в конце последнего **.then**, добавьте команду:

```js
this.trigger('updated')
```

Она будет следовать сразу, после присвоения данных ответа сервера свойству **list**, нашей модели данных класса **User**:

```js
.then(result => {
  // присваиваем результат ответа сервера свойству list модели данных
  this.list = result.data
  // запускаем событие updated, после успешного получения данных от сервера
  this.trigger('updated')
})
```

Полный код модуля хранения состояния должен выглядеть так:

```js
export default class User {

  constructor(riot) {
    this.list = []
    this.current = {}
    // делаем объект модели данных наблюдаемым
    riot.observable(this)
  }

  getUsers() {
    fetch('https://rem-rest-api.herokuapp.com/api/users', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(result => {
        // присваиваем результат ответа сервера свойству list модели данных
        this.list = result.data
        // запускаем событие updated, после успешного получения данных от сервера
        this.trigger('updated')
      })
  }
  
}
```

Закончим с компонентом **UserList**. Откройте файл **UserList.tag**, добавьте в конце тела компонента теги **script**, и введите следующий код:

```html
<script>
  
  // запускаем метод getUsers, нашей модели данных
  this.user.getUsers()
  
</script>
```

Поскольку мы расширили экземпляр модели данных класса **User** для любых компонентов с помощью примеси **user**, мы можем ссылаться на этот экземпляр данных, через одноимённое свойство самого **объекта компонента**, на которое указывает ключевое слово **this**.

Данный код будет выполнен до монтирования тега на страницу. Он запускает метод **getUsers** нашей модели данных, который, внутри себя, запускает **fetch**, который выполняется асинхронно, и после загрузки данных с сервера, вызывает событие **updated**.

Теперь нам нужно отловить это событие модели данных в нашем компоненте и запустить событие **update** самого компонента:

```html
<script>
  
  // запускаем метод getUsers, нашей модели данных
  this.user.getUsers()

  // запускаем событие обновления компонента (this.update)
  // при получении события updated от модели данных
  this.user.one('updated', this.update)

</script>
```

В котором, в свою очередь, мы присваиваем свойству **list** объекта компонента значение, одноимённого свойства **list** нашей модели данных:

```html
<script>
  
  // запускаем метод getUsers, нашей модели данных
  this.user.getUsers()

  // запускаем событие обновления компонента (this.update)
  // при получении события updated от модели данных
  this.user.one('updated', this.update)

  // присваиваем свойству list нашего компонента значение
  // полученное моделью данных при запуске её метода getUsers()
  this.on('update', () => this.list = this.user.list)

</script>
```

после чего, компонет обновляется и полученные данные отображаются на странице.

Итоговый код компонента **UserList**:

```html
<r-list>

  <div class="list">

    <!-- добавляем ссылки на пользователей -->
    <a href="#!/edit/{ id }" class="list__item" each={ list } key={ id }>{ firstName } { lastName }</a>

  </div>

  <!--  добавляем стили  -->
  <style>
    .list {
      list-style: none;
      margin: 0 0 10px;
      padding: 0;
    }
    .list__item {
      background: #fafafa;
      border: 1px solid #ddd;
      color: #333;
      display: block;
      margin: 0 0 1px;
      padding: 8px 15px;
      text-decoration: none;
    }
    .list__item:hover {
      text-decoration: underline;
    }
  </style>

  <!--  добавляем логику  -->
  <script>
  
    // запускаем метод getUsers, нашей модели данных
    this.user.getUsers()

    // запускаем событие обновления компонента (this.update)
    // при получении события updated от модели данных
    this.user.one('updated', this.update)

    // присваиваем свойству list нашего компонента значение
    // полученное моделью данных при запуске её метода getUsers()
    this.on('update', () => this.list = this.user.list)

  </script>

</r-list>
```

Подключим компонент к приложению и примонтируем его в файле **App.js**:

```js
// подключаем Riot.js
import riot from 'riot'

// подключаем модель данных User
import User from './models/User'

// подключаем компонент UserList
import './views/UserList.tag'

// создаём общую примесь user и передаём в конструктор модели данных User
// ссылку на библиотеку Riot.js, в виде аргумента riot
riot.mixin({ user: new User(riot) })

// монтируем компонент UserList
riot.mount('r-list')
```

а затем, подключим и к странице в файле **index.html**:

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

  <!-- подключаем компонент UserList к странице -->
  <r-list />

  <script src="dist/build.js"></script>
</body>
</html>
```

Если мы теперь запустим из терминала команду:

```
npm run dev
```

то, откроется страница браузера со списком из 10 пользователей:

```
Peter Mackenzie
Cindy Zhang
Ted Smith
Susan Fernbrook
Emily Kim
Peter Zhang
Cindy Smith
Ted Fernbrook
Susan Kim
Emily Mackenzie
```

Мы увеличим лимит пользователей позже, когда будем реализовывать операции **[CRUD](https://ru.wikipedia.org/wiki/CRUD)** в другом компоненте, который мы тоже вскоре создадим.