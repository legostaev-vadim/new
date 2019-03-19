<app>
  <r-menu />
  
  <main data-is="router">
    <route path="list"><r-list /></route>
    <route path="edit/*"><r-form /></route>
  </main>

  <style>
    :scope {
      padding: 15px;
      font: normal 16px Verdana;
    }
  </style>

  <script>
    route.base('#!/')
    route('list')
  </script>
</app>
