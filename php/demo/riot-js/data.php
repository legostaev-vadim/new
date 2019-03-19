<?php if(!defined('IN_INCLUDE')) die('you cannot load this page directly.');

$site_name = 'Riot.js';

$menu = [
  'compare' => 'Сравнение',
  'play' => 'Играть',
  'guide' => 'Учебник',
  'api' => 'API',
  'download' => 'Скачать',
  'faq' => 'FAQ'
];

$tabsPlay = [
  'play' => 'Живое демо',
  'play-todo' => 'Todo App',
  'play-timer' => 'Таймер',
  'play-router' => 'Маршрутизатор',
  'play-more' => 'Больше'
];

$tabsGuide = [
  'guide' => 'Пользовательские теги',
  'guide-compiler' => 'Компилятор',
  'guide-design' => 'Разработка приложения',
  'guide-migration' => 'Миграция из riot 2'
];

$tabsApi = [
  'api' => 'Пользовательские теги',
  'api-compiler' => 'Компилятор',
  'api-observable' => 'Наблюдатель',
  'api-route' => 'Маршрутизатор'
];

if(!isset($_GET['id'])) $page = 'index';
elseif(file_exists('dist/pages/'.$_GET['id'].'.html')) $page = $_GET['id'];
else $page = '404';