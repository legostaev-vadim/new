$(function() {

  route.start()
  route.base('/')

  const dataStore = {};
  const $html = $('html')
  const siteName = $('html').data('name')
  const $description = $('meta[name=description]')
  const $title = $('title')
  const $main = $('main')
  const $items = $('.menu__item')
  const $button = $('.menu__button')
  const $page = $('.menu__page')
  const indent = $main.data('indent')
  const duration = 300
  let idPage = $items.filter('.menu__item--current').attr('href')

  function show_page(data, idPage) {
    $html.stop().animate({scrollTop: $main.offset().top - indent}, 600, () => {
      $main.html(data).attr('id', idPage).fadeTo(duration, 1, function() {
        for (const key in appPlugins) appPlugins[key]('main')
      })
    })
  }

  if(idPage === '/') idPage = 'index'
  $main.attr('id', idPage)

  $page.text($items.filter('.menu__item--current').text())

  for (const key in appPlugins) appPlugins[key]()

  dataStore[location.href] = {
    main: $main.html(),
    description: $description.attr('content')
  }

  route(function(path) {
    $main.fadeTo(duration, 0, function() {
      if(location.href in dataStore) {
        show_page(dataStore[location.href].main, path || 'index')
        $description.attr('content', dataStore[location.href].description)
      } else {
        dataStore[location.href] = {}
        $.ajax({
          url: `dist/pages/${path || 'index'}.html`,
          cache: false,
          success(data) {
            show_page(data, path || 'index')
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
      $items.removeClass('menu__item--current')
        .each(function() {
          if($(this)[0].href === location.href) {
            $(this).addClass('menu__item--current')
            if(path) $title.text(`${$(this).text()} | ${siteName}`)
            else $title.text(siteName)
            $page.text($(this).text())
            return false
          }
        })
    })
    if(path) $button.click()
  }) // end route

})