$(function() {

  route.start()
  route.base('/')

  const pageStore = {};
  const $html = $('html')
  const siteName = $('html').data('name')
  const $description = $('meta[name=description]')
  const $title = $('title')
  const $menu = $('.menu')
  const $main = $('main')
  const $items = $('#nav a').not('[target="_blank"]')
  const $buttonUp = $('.button-up')
  const error = '404'
  const $tabs = {}
  let duration = 0
  let indent = 0
  let page = $main.attr('data-page')
  let prevPage = location.pathname
  let $currentTabs
  let tabsName
  let $anchor
  let href

  if(location.hash) {
    $anchor =  $main.find(location.hash)
    if($anchor[0]) $html.scrollTop($anchor.offset().top - 100)
    else $html.scrollTop(indent)
  }

  $('[data-tabs').each(function() {
    $tabs[$(this).data('tabs')] = $($(this).html())
  })

  pageStore[page] = {
    main: $main.html(),
    description: $description.attr('content')
  }

  function load_page(data, anchor) {
    $main.html(data).attr('data-page', page)
    if(tabsName) $main.find('#tabs').empty().append($currentTabs)
    if(anchor) {
      $anchor =  $main.find(anchor)
      if($anchor[0]) indent = $anchor.offset().top - 100
      else indent = 0
    }
    else indent = 0
    $html.scrollTop(indent)
    $main.fadeTo(duration, 1)
    duration = 0
  }

  $(window).trigger('scroll.button-up')

  $('body').on('click', 'a', function() {
    duration = 300
  })

  $main.on('click', 'a[href^="#"]', function(e) {
    if(location.hash === $(this).attr('href')) {
      $anchor = $main.find($(this).attr('href'))
      if($anchor[0]) $html.scrollTop($anchor.offset().top - 100)
    }
    else
      return e.stopPropagation()
  })

  route(function(...path) {

    if(path.length > 2) path = error
    else if(location.hash) path = path[0]
    else path = path.pop()

    if(prevPage === location.pathname && location.hash) {
      $anchor = $main.find(location.hash)
      if($anchor[0]) $html.scrollTop($anchor.offset().top - 100)
      return
    }
    
    $menu.removeClass('open')
    $buttonUp.removeClass('button-up--show')

    prevPage = location.pathname
    tabsName = false

    if (!path) page = 'index'
    else if($tabs[path]) {
      page = path
      tabsName = path
      $currentTabs = $tabs[path]
    }
    else if(path.indexOf('-') > 0) {
      page = path
      tabsName = path.slice(0, path.indexOf('-'))
      $currentTabs = $tabs[tabsName]
    }
    else if($items.is(`[href="/${path}"]`)) page = path
    else page = error

    $main.fadeTo(duration, 0, function(e) {
      if(page in pageStore) {
        load_page(pageStore[page].main, location.hash)
        $description.attr('content', pageStore[page].description)
      } else {
        $.ajax({
          url: `/dist/pages/${page || 'index'}.html`,
          success(data) {
            load_page(data, location.hash)
          }
        })
        $.ajax({
          url: `/dist/description/${page || 'index'}.txt`,
          success(data) {
            $description.attr('content', data)
          }
        })
      }

      $items.removeClass('current')
      
      if (page === 'index') {
        $title.text(siteName)
      } else if(page === error) {
        $title.text(error)
      } else if(tabsName) {
        if(location.hash) href = location.href.slice(0, location.href.indexOf('#'))
        else href = location.href
        $currentTabs.removeClass('current').each(function() {
          if($(this)[0].href === href) {
            $(this).addClass('current')
            $title.text(`${$(this).text()} · ${siteName}`)
            $items.each(function() {
              if($(this).attr('href') === `/${tabsName}`) {
                $(this).addClass('current')
                return false
              }
            })
            return false
          }
        })
      } else {
        if(location.hash) href = location.href.slice(0, location.href.indexOf('#'))
        else href = location.href
        $items.each(function() {
          if($(this)[0].href === href) {
            $(this).addClass('current')
            $title.text(`${$(this).text()} · ${siteName}`)
            return false
          }
        })
      }
    })

  }) // end route

})