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