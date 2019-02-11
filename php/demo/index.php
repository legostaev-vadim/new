<?php
  define("IN_INCLUDE", true);
  include 'data.php';
  include 'functions.php';
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
  <title><?php
    if(!isset($_GET['id']) or $_GET['id'] == 'index') echo $site_name;
    elseif(array_key_exists($_GET['id'], $menu)) echo $menu[$_GET['id']] . ' | ' . $site_name;
    else echo '404';
  ?></title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
  <link rel="stylesheet" href="dist/main.css">
</head>
<body>
  <?php include 'dist/includes/header.php'; ?>
  <main data-indent="200"><?php
    if(!isset($_GET['id']))
      include 'dist/pages/index.html';
    elseif(file_exists('dist/pages/'.$_GET['id'].'.html'))
      include 'dist/pages/'.$_GET['id'].'.html';
    else
      include 'dist/pages/404.html';
  ?></main>
  <?php include 'dist/includes/footer.php'; ?>
  <script src="dist/main.js"></script>
</body>
</html>