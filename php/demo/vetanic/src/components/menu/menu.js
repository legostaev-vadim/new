$(function() {

  const $menu = $('.menu')
  const $button = $menu.find('.menu__button')
  const $list = $menu.find('.menu__list')

  $button.on('click', function() {
    $menu.toggleClass('menu--open').animate({scrollTop : 0}, 300)
  })

  $list.on('click', function(e) {
    if(e.target == this) {
        $button.click()
    }
  })
  
  $(window).on('scroll.menu', function() {
    if ($(window).scrollTop() > 150) $menu.addClass('menu--small')
    else $menu.removeClass('menu--small')
  }).on('keydown', function(e) {
    if(e.which == 27) {
      $menu.removeClass('menu--open').animate({scrollTop : 0}, 300)
    }
  }).trigger('scroll.menu')

})