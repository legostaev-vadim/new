<app>
  <app-menu />
  
  <main data-is="router">
    <route path="list"><app-list /></route>
    <route path="edit/*"><app-form /></route>
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