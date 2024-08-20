<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->post('api/register', 'Auth::register');
$routes->post('api/login', 'Auth::login');
$routes->post('logout', 'Auth::logout');

$routes->group('api', ['namespace' => 'App\Controllers'], function ($routes) {
    $routes->get('dashboard/project-by-category', 'Dashboard::projectByCategory');
    $routes->get('dashboard/project-status', 'Dashboard::projectStatus');
    $routes->get('dashboard/project-count-by-month', 'Dashboard::projectCountByMonth');
    $routes->get('dashboard/user-level', 'Dashboard::userLevel');

    $routes->get('otoritas', 'Otoritas::index');
    $routes->get('otoritas/(:segment)', 'Otoritas::show/$1');
    $routes->get('otoritas/datatables', 'Otoritas::datatables');
    $routes->post('otoritas', 'Otoritas::create');
    $routes->put('otoritas/(:segment)', 'Otoritas::update/$1');
    $routes->delete('otoritas/(:segment)', 'Otoritas::delete/$1');

    $routes->get('tasks', 'Tasks::index');
    $routes->get('tasks/(:segment)', 'Tasks::show/$1');
    $routes->get('tasks/getID/(:segment)', 'Tasks::getID/$1');
    $routes->get('tasks/getIDV2/(:segment)', 'Tasks::getIDV2/$1');
    $routes->post('tasks', 'Tasks::create');
    $routes->put('tasks/(:segment)', 'Tasks::update/$1');
    $routes->delete('tasks/(:segment)', 'Tasks::delete/$1');

    $routes->get('moduls', 'Moduls::index');
    $routes->get('moduls/(:segment)', 'Moduls::show/$1');
    $routes->get('moduls/getID/(:segment)', 'Moduls::getID/$1');
    $routes->get('moduls/datatables', 'Moduls::datatables');
    $routes->post('moduls', 'Moduls::create');
    $routes->put('moduls/(:segment)', 'Moduls::update/$1');
    $routes->delete('moduls/(:segment)', 'Moduls::delete/$1');

    $routes->get('submoduls', 'Submoduls::index');
    $routes->get('submoduls/(:segment)', 'Submoduls::show/$1');
    $routes->get('submoduls/getID/(:segment)', 'Submoduls::getID/$1');
    $routes->get('submoduls/datatables', 'Submoduls::datatables');
    $routes->post('submoduls', 'Submoduls::create');
    $routes->put('submoduls/(:segment)', 'Submoduls::update/$1');
    $routes->delete('submoduls/(:segment)', 'Submoduls::delete/$1');

    $routes->get('kategori', 'Kategori::index');
    $routes->get('kategori/datatables', 'Kategori::datatables');
    $routes->post('kategori', 'Kategori::create');
    $routes->put('kategori/(:segment)', 'Kategori::update/$1');
    $routes->delete('kategori/(:segment)', 'Kategori::delete/$1');

    $routes->get('project/datatables', 'Project::datatables');
    $routes->get('project/show', 'Project::show');
    $routes->get('project', 'Project::index');
    $routes->post('project', 'Project::create');
    $routes->put('project/(:segment)', 'Project::update/$1');
    $routes->delete('project/(:segment)', 'Project::delete/$1');

    $routes->get('user/datatables', 'User::datatables');
    $routes->get('user/(:segment)', 'User::show/$1');
    $routes->get('user', 'User::index');
    $routes->post('user', 'User::create');
    $routes->put('user/(:segment)', 'User::update/$1');
    $routes->delete('user/(:segment)', 'User::delete/$1');
});
