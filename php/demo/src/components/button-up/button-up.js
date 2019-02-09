$(function() {

  const $html = $('html')
  const $buttonUp = $('.button-up')

  $buttonUp.on('click', function() {
    $html.stop().animate({scrollTop : 0}, 600)
  })

  $(window).on('scroll.buttonup', function() {
    if ($(window).scrollTop() > 150) $buttonUp.addClass('button-up--show')
    else $buttonUp.removeClass('button-up--show')
  })
  
})