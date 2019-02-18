$(function() {

  $(".dropdown-trigger").dropdown({
    hover: true,
    coverTrigger: false,
    constrainWidth: false
  })

  $('.dropdown-content').hover(
    function() {
      $(this).parent('li').addClass('active')
    },
    function() {
      $(this).parent('li').removeClass('active')
    }
  )

})