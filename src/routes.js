import { Router } from 'express';

import SessionsController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import CouriersManagmentController from './app/controllers/CouriersManagmentController';
import OrderController from './app/controllers/OrderController';
import CouriesController from './app/controllers/CouriesController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/delivery/:id/deliveries', CouriesController.index);
routes.put('/delivery/orders/:id', CouriesController.update);

routes.post('/delivery/:id/problems', DeliveryProblemsController.store);

routes.post('/sessions', SessionsController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get('/couriers', CouriersManagmentController.index);
routes.post('/couriers', CouriersManagmentController.store);
routes.put('/couriers/:id', CouriersManagmentController.update);
routes.delete('/couriers/:id', CouriersManagmentController.delete);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.get('/delivery/problems', DeliveryProblemsController.index);
routes.get('/delivery/:id/problems', DeliveryProblemsController.show);
routes.put('/delivery/:id/cancel-delivery', DeliveryProblemsController.update);

export default routes;
