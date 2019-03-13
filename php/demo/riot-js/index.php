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
  <link rel="shortcut icon" type="image/x-icon" href="dist/img/favicon.ico">
  <link rel="icon" type="image/png" sizes="152x152" href="dist/img/favicon-152x152.png">
  <link rel="apple-touch-icon-precomposed" sizes="152x152" href="dist/img/favicon-152x152.png">
  <title>
    <?php
      if($page == 'index') echo $site_name;
      elseif($page == '404') echo $page;
      elseif($_GET['id'] === 'play' || strpos($_GET['id'], 'play-') === 0) echo $tabsPlay[$page] . ' · ' . $site_name;
      elseif($_GET['id'] === 'guide' || strpos($_GET['id'], 'guide-') === 0) echo $tabsGuide[$page] . ' · ' . $site_name;
      elseif($_GET['id'] === 'api' || strpos($_GET['id'], 'api-') === 0) echo $tabsApi[$page] . ' · ' . $site_name;
      else echo $menu[$page] . ' · ' . $site_name;
    ?>
  </title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
  <link rel="stylesheet" href="dist/main.css">
</head>
<body>
  <?php include 'dist/includes/header.php'; ?>
  <main id="main" data-page="<?php echo $page; ?>">
    <?php include 'dist/pages/'.$page.'.html'; ?>
  </main>
  <?php include 'dist/includes/footer.php'; ?>
  <template id="tabs-play">
    <?php
      foreach ($tabsPlay as $key => $value) {
        echo "<a href='$key'>$value</a>";
      }
    ?>
  </template>
  <template id="tabs-guide">
    <?php
      foreach ($tabsGuide as $key => $value) {
        echo "<a href='$key'>$value</a>";
      }
    ?>
  </template>
  <template id="tabs-api">
    <?php
      foreach ($tabsApi as $key => $value) {
        echo "<a href='$key'>$value</a>";
      }
    ?>
    <a target="_blank" href="https://riot.js.org/api/misc/">Misc</a>
  </template>
  <script src="dist/main.js"></script>
</body>
</html>