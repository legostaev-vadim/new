<?php if(!defined('IN_INCLUDE')) die('you cannot load this page directly.');

$site_name = 'АвтоМАГ';

$menu = [
  'cars' => 'Все автомобили',
  'credit' => 'Автокредит',
  'insurance' => 'Автострахование',
  'organizations' => 'Организациям',

  'exchange' => 'Обмен',
  'buyout' => 'Выкуп',
  'calc' => 'Автокредит',
  'commission' => 'Комиссия',

  'maintenance' => 'Техобслуживание',
  'locksmith' => 'Слесарный ремонт',
  'bodywork' => 'Кузовной ремонт',
  'spare' => 'Запчасти',
  'special' => 'Спецпредложения',

  'purchase' => 'Покупка автомобиля',
  'service' => 'Сервис',

  'news' => 'Новости',
  'services' => 'Услуги',
  'discount' => 'Дисконтная система',
  'jobs' => 'Вакансии'
];

if(!isset($_GET['id'])) $page = 'index';
elseif(file_exists('dist/pages/'.$_GET['id'].'.html')) $page = $_GET['id'];
else $page = '404';