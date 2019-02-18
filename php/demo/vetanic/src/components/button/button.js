appPlugins.button = function(context = 'html') {

  const $address = $('.popup__address')

  $('.button', context).off().on('click', function() {

    if($(this).hasClass('button--visit')) $address.hide()
    else if($(this).hasClass('button--call')) $address.show()
    
    $(this).simplePopup({
      type: "html",
      htmlSelector: ".popup",
      afterOpen(html) {
        $('.popup__form', html).validate({
          rules: {
            name: {
              required: true,
              minlength: 2
            },
            address: {
              required: true,
              minlength: 5
            },
            phone: {
              required: true,
              minlength: 5
            }
          },
          messages: {
            name: {
              required: "Поле «Имя» обязательно к заполнению",
              minlength: "Введите не менее 2-х символов в поле «Имя»"
            },
            address: {
              required: "Поле «Адрес» обязательно к заполнению",
              minlength: "Введите не менее 7-и символов в поле «Адрес»"
            },
            phone: {
              required: "Поле «Телефон» обязательно к заполнению",
              minlength: "Введите не менее 5-и символов в поле «Телефон»"
            }
          }
        })
      }
    })

  })

}