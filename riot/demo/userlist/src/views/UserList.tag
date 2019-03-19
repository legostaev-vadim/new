<app-list>
  <div class="user-list">
    <a href="#!/edit/{ id }" class="user-list-item" each={ list } key={ id }>{ firstName } { lastName }</a>
  </div>

  <style>
    .user-list {
      list-style: none;
      margin: 0 0 10px;
      padding: 0;
    }
    .user-list-item {
      background: #fafafa;
      border: 1px solid #ddd;
      color: #333;
      display: block;
      margin: 0 0 1px;
      padding: 8px 15px;
      text-decoration: none;
    }
    .user-list-item:hover {
      text-decoration: underline;
    }
  </style>

  <script>
    this.on('update', () => this.list = this.user.list)
    this.user.one('updated', this.update)
    this.user.getUsers()
  </script>
</app-list>