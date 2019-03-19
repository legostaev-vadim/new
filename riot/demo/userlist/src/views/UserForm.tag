<r-form>
  <form>
    <label class="label">Имя</label>
    <input type="text" class="input" oninput={ inputValue } data-name="firstName" placeholder="First name" value="{ firstName }">
    <label class="label">Фамилия</label>
    <input type="text" class="input" oninput={ inputValue } data-name="lastName" placeholder="Last name" value="{ lastName }">
    <button class="btn btn-create" onclick={ clickButton } data-method="createUser">Создать</button>
    <button class="btn btn-delete" onclick={ clickButton } data-method="deleteUser">Удалить</button>
    <button class="btn btn-update" onclick={ clickButton } data-method="updateUser">Обновить</button>
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
    .btn {
      background: #ddd;
      border: 1px solid #ddd;
      border-radius: 3px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      margin-top: 20px;
      padding: 10px 15px;
      text-decoration: none;
    }
    .btn-create {
      background: #41BA5E;
    }
    .btn-delete {
      background: #FF0044;
    }
    .btn-update {
      background: #0B77B3;
    }
    .btn:hover {
      background: #ddd;
      color: #222;
    }
  </style>

  <script>
    clickButton(e) {
      e.preventDefault()
      e.preventUpdate = true
      this.user[e.target.dataset.method]()
    }

    inputValue(e) {
      e.preventUpdate = true
      this.user.current[e.target.dataset.name] = e.target.value
    }

    this.on('update', () => {
      this.firstName = this.user.current.firstName
      this.lastName = this.user.current.lastName
    })

    this.on('route', (id) => this.user.getUser(id))
    this.user.one('updated', this.update)
    this.user.one('home', () => route('list'))
  </script>
</r-form>