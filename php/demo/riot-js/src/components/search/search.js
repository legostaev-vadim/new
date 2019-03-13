$(function() {

  const $search = $('.search')
  const $close = $('.search__close')
  const $text = $('.search__text')
  const $button = $('.search__button')

  $search.submit(function() {
    if(!$text.val()) {
      $button.addClass('search__button--error')
      $text.attr('placeholder', 'пустое поле')
      return false
    }
  }).on('keydown', function(e) {
    if(e.which == 27) {
      $close.click()
    }
  })

  $close.click(function() {
    $search.removeClass('search--open')
    $text.click()
  })

  $text.click(function() {
    $button.removeClass('search__button--error')
    $(this).attr('placeholder', 'введите запрос')
  })

  $button.click(function() {
    if(!$search.hasClass('search--open')) {
      $search.addClass('search--open')
      return false
    }
  })
  
})