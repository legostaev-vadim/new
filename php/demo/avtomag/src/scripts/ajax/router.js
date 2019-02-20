$(function() {

  route.start()
  route.base('/')

  const pageStore = {};
  const $html = $('html')
  const siteName = $('html').data('name')
  const $description = $('meta[name=description]')
  const $title = $('title')
  const $main = $('main')
  const $items = $('.menu .item')
  const indent = $main.data('indent')
  const duration = 300
  const error = '404'
  let page = $main.attr('id')

  // for (const key in appPlugins) appPlugins[key]()

  pageStore[page] = {
    main: $main.html(),
    description: $description.attr('content')
  }


  route(function(path) {

    if($items.is(`[href="${path || '/'}"]`)) page = path || 'index'
    else page = error

    $html.fadeTo(duration, 0, function() {
      if(page in pageStore) {
        $main.html(pageStore[page].main).attr('id', page)
        $description.attr('content', pageStore[page].description)
        $html.scrollTop($main.offset().top - indent).fadeTo(duration, 1, function() {
          // for (const key in appPlugins) appPlugins[key]()
        })
      } else {
        $.ajax({
          url: `dist/pages/${page || 'index'}.html`,
          success(data) {
            $main.html(data).attr('id', page)
            $html.scrollTop($main.offset().top - indent).fadeTo(duration, 1, function() {
              // for (const key in appPlugins) appPlugins[key]()
            })
          }
        })
        $.ajax({
          url: `dist/description/${page || 'index'}.txt`,
          success(data) {
            $description.attr('content', data)
          }
        })
      }
      
      if (!path) $title.text(siteName)
      else if(page === error) $title.text(error)
      else $title.text($items.filter(`[href="${page}"]`).text() + ' | ' + siteName)
    })

  }) // end route

})