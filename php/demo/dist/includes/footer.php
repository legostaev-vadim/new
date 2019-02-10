
<footer class="footer">
  <div class="footer__block"><img class="footer__pic" src="dist/img/footer/001.jpg" alt=""/></div>
  <section class="advantage advantage--call">
    <div class="advantage__first wow fadeInRight" data-wow-offset="150">
      <div class="advantage__block">
        <h3 class="advantage__title">ВЫЗОВ ВРАЧА НА ДОМ</h3>
        <p class="advantage__text">Lorem ipsum dolor sit amet consectetur adipiscing elit sed tempor incididunt ut laboret dolore</p>
        <button class="button button--call">ВЫЗВАТЬ</button>
      </div>
    </div>
    <div class="advantage__last wow fadeInLeft" data-wow-offset="150"><img class="advantage__pic" src="dist/img/advantage/005.jpg" alt=""/></div>
  </section>
  <div class="cart"><iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14684.905008814461!2d37.61853179202!3d55.72568576244975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1543963957335" style="border:0" allowfullscreen></iframe></div>
  <p class="footer__copy"><?php echo $site_name; ?> © <?php echo date('Y'); ?></p>
</footer>
<button class="button-up"></button>
<div class="popup">
  <form class="popup__form" method="get" action="#"><div class="form-group">
<label for="exampleInputName">Введите имя</label>
<input class="form-control" name="name" id="exampleInputName" type="text" required placeholder="Имя">
</div>
<div class="form-group popup__address">
<label for="exampleInputAddress">Введите адрес</label>
<input class="form-control" name="address" id="exampleInputAddress" type="text" required placeholder="Адрес">
</div>
<div class="form-group">
<label for="exampleInputPhone">Введите телефон</label>
<input class="form-control" name="phone" id="exampleInputPhone" type="text" required placeholder="Телефон">
</div>
    <button class="button button--submit" type="submit">Отправить</button>
  </form>
</div>