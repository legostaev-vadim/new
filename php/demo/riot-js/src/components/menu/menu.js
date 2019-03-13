$(function() {

  const $menu = $('.menu')
  const $button = $('.menu .button')

  $menu.click(function(e) {
    if(e.target === $menu[0]) $menu.removeClass('open')
  })

  $button.click(function() {
    $menu.toggleClass('open')
  })

  $(window).on('keydown', function(e) {
    if(e.which == 27) {
      $menu.removeClass('open')
    }
  })
  
})