import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import SessionsController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import CouriersManagmentController from './app/controllers/CouriersManagmentController';
import OrderController from './app/controllers/OrderController';
import OrderManagementController from './app/controllers/OrderManagementController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/delivery/:id/deliveries', OrderManagementController.index);
routes.put('/delivery/orders/:id', OrderManagementController.update);

routes.post(
  '/files/:id/signature',
  upload.single('file'),
  FileController.store
);

routes.post('/delivery/:id/problems', DeliveryProblemsController.store);

routes.post('/sessions', SessionsController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get('/couriers', CouriersManagmentController.index);
routes.post('/couriers', CouriersManagmentController.store);
routes.put('/couriers/:id', CouriersManagmentController.update);
routes.delete('/couriers/:id', CouriersManagmentController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.get('/delivery/problems', DeliveryProblemsController.index);
routes.get('/delivery/:id/problems', DeliveryProblemsController.show);
routes.put('/delivery/:id/cancel-delivery', DeliveryProblemsController.update);

export default routes;
