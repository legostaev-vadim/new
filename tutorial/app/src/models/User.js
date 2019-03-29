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