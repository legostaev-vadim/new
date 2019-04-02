<?php if(!defined('IN_INCLUDE')) die('you cannot load this page directly.');

$site_name = 'Vetanic';

$menu = [
  '/' => 'Главная',
  '/doctors' => 'Врачи',
  '/services' => 'Услуги',
  '/prices' => 'Цены',
  '/reviews' => 'Отзывы',
  '/graph' => 'График',
  '/contacts' => 'Контакты'
];

if(!isset($_GET['id'])) $page = 'index';
elseif(file_exists('dist/pages/'.$_GET['id'].'.html')) $page = $_GET['id'];
else $page = '404';