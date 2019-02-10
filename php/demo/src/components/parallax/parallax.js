appPlugins.parallax = function(context = 'html') {
  
  $('.parallax-mirror').remove()
  
  const $parallax = $('.parallax', context)

  $('.parallax').parallax({
    imageSrc: $parallax.data('image'),
    speed: $parallax.data('speed')
  }).resize()

}