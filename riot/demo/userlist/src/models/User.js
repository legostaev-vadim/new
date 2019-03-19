class User {
  constructor() {
    riot.observable(this)
  }

  loadList() {
    this.list = []
    fetch('https://rem-rest-api.herokuapp.com/api/users', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(result => {
        this.list = result.data
        this.trigger('loadedList')
      })
  }

  loadUser(id) {
    this.current = {}
    fetch('https://rem-rest-api.herokuapp.com/api/users/' + id, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(result => {
        this.current = result
        this.trigger('loadedUser')
      })
  }

  save(id) {
    return fetch('https://rem-rest-api.herokuapp.com/api/users/' + this.current.id, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(this.current)
    })
  }
}