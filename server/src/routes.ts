import express from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

import multerConfig from './config/multer';

const routes = express();
const uploads = multer(multerConfig);

const pointController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index); 

routes.get('/points/:id', pointController.show);
routes.get('/points', pointController.index);

routes.post('/points',
    uploads.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required(),
            items: Joi.string().required(),
        })
    },{
        abortEarly: false
    }),
    pointController.create);

export default routes;