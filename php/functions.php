<?php

function get_menu() {
  global $menu;

  $class_current = 'active';

  if(!isset($_GET['id'])) $href = '/';
  else $href = $_GET['id'];

  foreach ($menu as $key => $value) {
    if($key == $href)
      echo "<li class='$class_current'><a href='$key'>$value</a></li>";
    else
      echo "<li><a href='$key'>$value</a></li>";
  }
}