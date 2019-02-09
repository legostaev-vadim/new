$(function() {

  const $carousel = $('.carousel')
  const $items = $carousel.find('.carousel-item')
  const opts = {
    numVisible: 3,
    dist: -80,
    shift: -150
  }
  let idTimeout
  let current

  $carousel.carousel(opts)

  $(window).on('resize', function() {
    clearTimeout(idTimeout)
    idTimeout = setTimeout(function() {
      current = $items.filter('.active').index()
      $carousel.carousel(opts)
      $carousel.carousel('set', current)
    }, 300)
  })

})