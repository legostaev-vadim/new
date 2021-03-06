import riot from 'riot'
import route from '../node_modules/riot-route/dist/amd.route+tag'
import User from './models/User'
import './views/App.tag'
import './views/Header.tag'
import './views/Menu.tag'
import './views/UserList.tag'
import './views/UserForm.tag'
import './views/Footer.tag'

riot.mixin({ user: new User(riot), route: route })
route.base('#!/')
route('list')
riot.mount('app')