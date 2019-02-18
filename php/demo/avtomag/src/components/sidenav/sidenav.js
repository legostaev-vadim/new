$(function() {

  let $overlay

  $('.sidenav').sidenav()

  $('.sidenav .collapsible').collapsible({accordion: false})
  
  $('.sidenav .collapsible-header').click(function() {
    $(this).find('.material-icons').toggleClass('open')
  })
  
  $('.sidenav .item, .sidenav__close').click(function() {
    if(!$overlay) $overlay = $('.sidenav-overlay')
    $overlay.click()
  })

  $(window).on('keydown', function(e) {
    if(!$overlay) $overlay = $('.sidenav-overlay')
    if(e.which == 27) $overlay.click()
  })

})