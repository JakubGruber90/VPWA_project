/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
    Route.get('/channels', 'ChannelsController.getChannels');
    Route.get('/channels/older_messages', 'ChannelsController.getOlderMessages');
    Route.get('/channels/initial_messages/:id', 'ChannelsController.getInitialMessages');
    Route.post('/channels', 'ChannelsController.createChannel');
    Route.post('/message', 'MessagesController.handle_input');
    Route.get('/channels/:id', 'ChannelsController.index');
    Route.delete('/channels/:id', 'ChannelsController.leaveChannel');
  }).middleware(['auth'])


Route.post('/login', 'UsersController.login');
Route.get('/users', 'UsersController.findOne');
Route.post('/users', 'UsersController.create');


