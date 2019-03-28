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