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
  const $current = $('.menu__page')
  const $items = $('.menu__item')
  const indent = $main.data('indent')
  const duration = 300
  const error = '404'
  let page = $main.attr('id')

  function show_page() {
    $html.fadeTo(duration, 1, function() {
      for (const key in appPlugins) appPlugins[key]('main')
    })
  }

  function load_page(data, id, isAjax) {
    $html.stop().animate({scrollTop: $main.offset().top - indent}, 600, () => {
      $main.html(data).attr({id})
      if(isAjax) {
        let $lastImg = $main.find('img:last')
        if($lastImg.is('img')) $lastImg.one('load', show_page)
        else show_page()
      } else {
        show_page()
      }
    })
  }

  $current.text($items.filter('.menu__item--current').text() || error)

  dataStore[page] = {
    main: $main.html(),
    description: $description.attr('content')
  }

  for (const key in appPlugins) appPlugins[key]()

  route(function(path) {

    if($items.is(`[href="${path || '/'}"]`)) page = path || 'index'
    else page = error

    $html.fadeTo(duration, 0, function() {
      if(page in dataStore) {
        load_page(dataStore[page].main, page)
        $description.attr('content', dataStore[page].description)
      } else {
        dataStore[page] = {}
        $.ajax({
          url: `dist/pages/${path || 'index'}.html`,
          success(data) {
            load_page(data, page, true)
            dataStore[page].main = data
          }
        })
        $.ajax({
          url: `dist/description/${path || 'index'}.txt`,
          success(data) {
            $description.attr('content', data)
            dataStore[page].description = data
          }
        })
      }

      $items.removeClass('menu__item--current')
      
      if(page === error) {
        $title.text(error)
        $current.text(error)
      } else {
        $items.each(function() {
          if($(this)[0].href === location.href) {
            $(this).addClass('menu__item--current')
            if(path) $title.text(`${$(this).text()} | ${siteName}`)
            else $title.text(siteName)
            $current.text($(this).text())
            return false
          }
        })
      }
    })

    $menu.removeClass('menu--open').animate({scrollTop : 0}, 300)
  }) // end route

})