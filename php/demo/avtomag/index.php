<?php
  define("IN_INCLUDE", true);
  include 'data.php';
  // include 'functions.php';
?>
<!DOCTYPE html>
<html lang="ru" data-name="<?php echo $site_name; ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="description" content="<?php
    if(!isset($_GET['id']))
      include 'dist/description/index.txt';
    elseif(file_exists('dist/description/'.$_GET['id'].'.txt'))
      include 'dist/description/'.$_GET['id'].'.txt';
    else
      include 'dist/description/404.txt';
  ?>">
  <link rel="shortcut icon" type="image/x-icon" href="dist/favicon.ico">
  <title>
    <?php
      if($page == 'index') echo $site_name;
      elseif($page == '404') echo $page;
      else echo $menu[$page] . ' | ' . $site_name;
    ?>
  </title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="dist/main.css">
</head>
<body>
  <?php
    include 'dist/includes/header.php';
  ?>
  <main id="<?php echo $page; ?>" data-indent="200">
    <?php include 'dist/pages/'.$page.'.html'; ?>
  </main>
  <?php include 'dist/includes/footer.php'; ?>
  <script src="dist/main.js"></script>
</body>
</html>
