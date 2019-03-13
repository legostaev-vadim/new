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
  const $tabsPlay = $($('#tabs-play').html())
  const $tabsGuide = $($('#tabs-guide').html())
  const $tabsApi = $($('#tabs-api').html())
  const $buttonUp = $('.button-up')
  const duration = 300
  const error = '404'
  let page = $main.attr('data-page')
  let oldPage = location.pathname
  let tabsName = false
  let $tabs
  let indent
  let href

  pageStore[page] = {
    main: $main.html(),
    description: $description.attr('content')
  }

  function load_page(data, anchor) {
    $main.html(data).attr('data-page', page)
    if(tabsName) $main.find('#tabs').empty().append($tabs)
    if(anchor) indent = $main.find('#' + anchor).offset().top
    else indent = 0
    $html.scrollTop(indent)
    $main.fadeTo(duration, 1)
  }

  $(window).trigger('scroll.button-up')


  route(function(path, anchor) {

    if(oldPage === location.pathname && anchor) return
    else $buttonUp.removeClass('button-up--show')

    $menu.removeClass('open')
    oldPage = location.pathname
    tabsName = false

    if (!path) page = 'index'
    else if(path === 'play' || path.indexOf('play-') === 0) {
      if($tabsPlay.is(`[href="${path}"]`)) {
        page = path
        tabsName = 'play'
        $tabs = $tabsPlay
      }
      else page = error
    }
    else if(path === 'guide' || path.indexOf('guide-') === 0) {
      if($tabsGuide.is(`[href="${path}"]`)) {
        page = path
        tabsName = 'guide'
        $tabs = $tabsGuide
      }
      else page = error
    }
    else if(path === 'api' || path.indexOf('api-') === 0) {
      if($tabsApi.is(`[href="${path}"]`)) {
        page = path
        tabsName = 'api'
        $tabs = $tabsApi
      }
      else page = error
    } 
    else if($items.is(`[href="${path}"]`)) page = path
    else page = error

    $main.fadeTo(duration, 0, function() {
      if(page in pageStore) {
        load_page(pageStore[page].main, anchor)
        $description.attr('content', pageStore[page].description)
      } else {
        $.ajax({
          url: `dist/pages/${page || 'index'}.html`,
          success(data) {
            load_page(data, anchor)
          }
        })
        $.ajax({
          url: `dist/description/${page || 'index'}.txt`,
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
        if(anchor) href = location.href.slice(0, location.href.indexOf('#'))
        else href = location.href
        $tabs.removeClass('current').each(function() {
          if($(this)[0].href === href) {
            $(this).addClass('current')
            $title.text(`${$(this).text()} · ${siteName}`)
            $items.each(function() {
              if($(this).attr('href') === tabsName) {
                $(this).addClass('current')
                return false
              }
            })
            return false
          }
        })
      } else {
        $items.each(function() {
          if($(this)[0].href === location.href) {
            $(this).addClass('current')
            $title.text(`${$(this).text()} · ${siteName}`)
            return false
          }
        })
      }
    })

  }) // end route

})