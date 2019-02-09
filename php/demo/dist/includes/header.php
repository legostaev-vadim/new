
<div class="navbar-fixed">
<nav class="menu white">
<div class="nav-wrapper">
<a href="/" class="brand-logo"><?php echo $site_name; ?></a>
<a data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
<ul class="right hide-on-med-and-down"><?php get_menu(); ?></ul>
</div>
</nav>
</div>
<div class="sidenav" id="mobile-demo">
<div class="sidenav__header"><i class="sidenav__close material-icons">close</i></div><div class="divider"></div>
<ul><?php get_menu(); ?></ul></div>
<header class="header">
  <div class="wrapper"><div class="carousel">
<p class="carousel-item"><img src="dist/img/carousel/001.jpg"></p>
<p class="carousel-item"><img src="dist/img/carousel/002.jpg"></p>
<p class="carousel-item"><img src="dist/img/carousel/003.jpg"></p>
<p class="carousel-item"><img src="dist/img/carousel/004.jpg"></p>
<p class="carousel-item"><img src="dist/img/carousel/005.jpg"></p>
</div>
  </div>
</header>