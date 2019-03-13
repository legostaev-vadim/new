<?php if(!defined('IN_INCLUDE')) die('you cannot load this page directly.');

function get_menu($list) {

  global $menu;

  $current = 'current';

  if(!isset($_GET['id'])) $href = '/';
  else $href = $_GET['id'];

  if($list === $menu) {
    if(strpos($href, 'play-') === 0) $href = 'play';
    elseif(strpos($href, 'guide-') === 0) $href = 'guide';
    elseif(strpos($href, 'api-') === 0) $href = 'api';
  }

  foreach ($list as $key => $value) {
    if($key === $href) echo "<a href='$key' class='$current'>$value</a>";
    else  echo "<a href='$key'>$value</a>";
  }
}