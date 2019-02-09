$(function() {

  $('.sidenav').sidenav()

  const $overlay = $('.sidenav-overlay')

  $('.sidenav__close').on('click', function() {
    $overlay.click()
  })
  
  $('body').on('keydown.close', function(e) {
    if(e.which === 27) $overlay.click()
  })
  
})