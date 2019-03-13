<?php if(!defined('IN_INCLUDE')) die('you cannot load this page directly.');

$site_name = 'Riot.js';

$menu = [
  'compare' => 'Compare',
  'play' => 'PLAY',
  'guide' => 'Guide',
  'api' => 'API',
  'download' => 'Download',
  'faq' => 'FAQ'
];

$tabsPlay = [
  'play' => 'Live demo',
  'play-todo' => 'Todo App',
  'play-timer' => 'Timer',
  'play-router' => 'Router',
  'play-more' => 'More'
];

$tabsGuide = [
  'guide' => 'Custom tags',
  'guide-compiler' => 'Compiler',
  'guide-design' => 'App design',
  'guide-migration' => 'Migration from riot 2'
];

$tabsApi = [
  'api' => 'Custom tags',
  'api-compiler' => 'Compiler',
  'api-observable' => 'Observable',
  'api-route' => 'Router'
];

if(!isset($_GET['id'])) $page = 'index';
elseif(file_exists('dist/pages/'.$_GET['id'].'.html')) $page = $_GET['id'];
else $page = '404';