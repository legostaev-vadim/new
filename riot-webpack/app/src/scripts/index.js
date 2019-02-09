import riot from 'riot'
import User from './models/user'
import './views/header.tag'
import './views/app.tag'

riot.mount('app', User)