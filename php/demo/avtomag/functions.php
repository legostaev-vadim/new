<?php if(!defined('IN_INCLUDE')) die('you cannot load this page directly.');

function get_menu() {
  global $menu;

  $item = 'menu__item';
  $current = $item.'--current';

  if(!isset($_GET['id'])) $href = '/';
  else $href = $_GET['id'];

  foreach ($menu as $key => $value) {
    if($key == $href) $class = "$item $current";
    else  $class = $item;
    echo "<a href='$key' class='$class'>$value</a>";
  }
}