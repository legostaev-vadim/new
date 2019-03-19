<app-form>
  <form onsubmit={ submit }>
    <label class="label">Имя</label>
    <input type="text" class="input" oninput={ input } data-name="firstName" placeholder="First name" value="{ firstName }">
    <label class="label">Фамилия</label>
    <input type="text" class="input" oninput={ input } data-name="lastName" placeholder="Last name" value="{ lastName }">
    <button type="submit" class="button">Сохранить</button>
  </form>

  <style>
    .label {
      display: block;
      margin: 0 0 5px;
    }
    .input {
      border: 1px solid #ddd;
      border-radius: 3px;
      box-sizing: border-box;
      display: block;
      margin: 0 0 10px;
      padding: 10px 15px;
      width: 100%;
    }
    .button {
       background: #ddd;
       border: 1px solid #ddd;
       border-radius: 3px;
       color: #222;
       cursor: pointer;
       display: inline-block;
       margin-top: 20px;
       padding: 10px 15px;
       text-decoration: none;
      }
    .button:hover {
      background: #222;
      color: #fff;
    }
  </style>

  <script>
    submit(e) {
      e.preventDefault()
      this.user.save()
    }

    input(e) {
      this.user.current[e.target.dataset.name] = e.target.value
    }

    this.on('update', () => {
      this.firstName = this.user.current.firstName
      this.lastName = this.user.current.lastName
    })

    this.on('route', (id) => this.user.loadUser(id))
    this.user.one('loadedUser', this.update)
  </script>
</app-form>