$(function() {

  route.start()
  route.base('/')

  const $html = $('html')
  const siteName = $('html').data('name')
  const $description = $('meta[name=description]')
  const $title = $('title')
  const $main = $('main')
  const $menuItems = $('.menu li')
  const $sidenavItems = $('.sidenav li')
  const dataStore = {};
  const indent = $main.data('indent')
  const duration = 300
  let link

  function show_page(data) {
    $html.stop().animate({scrollTop: $main.offset().top - indent}, 400, () => {
      $main.html(data).fadeTo(duration, 1, function() {
        $('.parallax').parallax()
      })
    })
  }

  dataStore[location.href] = {
    main: $main.html(),
    description: $description.attr('content')
  }

  route(function(path) {
    $main.fadeTo(duration, 0, function() {
      if(location.href in dataStore) {
        show_page(dataStore[location.href].main)
        $description.attr('content', dataStore[location.href].description)
      } else {
        dataStore[location.href] = {}
        $.ajax({
          url: `dist/pages/${path || 'index'}.html`,
          cache: false,
          success(data) {
            show_page(data)
            dataStore[location.href].main = data
          }
        })
        $.ajax({
          url: `dist/description/${path || 'index'}.txt`,
          cache: false,
          success(data) {
            $description.attr('content', data)
            dataStore[location.href].description = data
          }
        })
      }
      $menuItems.removeClass('active')
        .each(function() {
          link = $(this).children('a')[0]
          if(link.href === location.href) {
            $(this).addClass('active')
            $sidenavItems.removeClass('active').eq($(this).index()).addClass('active')
            if(path) $title.text(`${$(link).text()} | ${siteName}`)
            else $title.text(siteName)
            return false
          }
        })
    })
  }) // end route

})