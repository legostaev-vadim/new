$(function() {

  route.start()
  route.base('/')

  const dataStore = {};
  const $html = $('html')
  const siteName = $('html').data('name')
  const $description = $('meta[name=description]')
  const $title = $('title')
  const $main = $('main')
  const $menu = $('.menu')
  const $page = $('.menu__page')
  const $items = $('.menu__item')
  const indent = $main.data('indent')
  const duration = 300
  const error = '404'
  let idPage = $items.filter('.menu__item--current').attr('href')
  let href

  function show_page(data, idPage) {
    $html.stop().animate({scrollTop: $main.offset().top - indent}, 600, () => {
      $main.html(data).attr('id', idPage).fadeTo(duration, 1, function() {
        for (const key in appPlugins) appPlugins[key]('main')
      })
    })
  }

  href = $items.filter('.menu__item--current').text() || error
  $page.text(href)
  
  if(href !== error) {
    href = location.href
    if(idPage === '/') idPage = 'index'
  } else idPage = error

  $main.attr('id', idPage)

  dataStore[href] = {
    main: $main.html(),
    description: $description.attr('content')
  }

  for (const key in appPlugins) appPlugins[key]()


  route(function(path) {

    if($items.is(`[href="${path || '/'}"]`)) {
      href = location.href
      idPage = path || 'index'
    } else {
      href = error
      idPage = error
    }

    $main.fadeTo(duration, 0, function() {
      if(href in dataStore) {
        show_page(dataStore[href].main, idPage)
        $description.attr('content', dataStore[href].description)
      } else {
        dataStore[href] = {}
        $.ajax({
          url: `dist/pages/${path || 'index'}.html`,
          cache: false,
          success(data) {
            show_page(data, idPage)
            dataStore[href].main = data
          }
        })
        $.ajax({
          url: `dist/description/${path || 'index'}.txt`,
          cache: false,
          success(data) {
            $description.attr('content', data)
            dataStore[href].description = data
          }
        })
      }

      $items.removeClass('menu__item--current')
      
      if(href === error) {
        $title.text(error)
        $page.text(error)
      } else {
        $items.each(function() {
          if($(this)[0].href === href) {
            $(this).addClass('menu__item--current')
            if(path) $title.text(`${$(this).text()} | ${siteName}`)
            else $title.text(siteName)
            $page.text($(this).text())
            return false
          }
        })
      }
    })

    $menu.removeClass('menu--open').animate({scrollTop : 0}, 300)
  }) // end route

})