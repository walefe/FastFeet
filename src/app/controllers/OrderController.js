import { Op } from 'sequelize';
import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';
import Order from '../models/Order';
import File from '../models/File';

import NewOrder from '../jobs/NewOrder';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    let orders;

    if (q) {
      orders = await Order.findAll({
        where: {
          product: {
            [Op.iLike]: `${q}%`,
          },
        },
        attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
        limit: 10,
        offset: (page - 1) * 10,
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'id',
              'name',
              'street',
              'number',
              'complement',
              'state',
              'city',
              'cep',
            ],
          },
          {
            model: Delivery,
            as: 'delivery',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });
    } else {
      orders = await Order.findAll({
        attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
        limit: 10,
        offset: (page - 1) * 10,
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'id',
              'name',
              'street',
              'number',
              'complement',
              'state',
              'city',
              'cep',
            ],
          },
          {
            model: Delivery,
            as: 'delivery',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });
    }

    if (!orders) {
      return res.status(401).json({ error: 'Orders not found' });
    }

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const deliverytExists = await Delivery.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliverytExists) {
      return res.status(400).json({ error: 'Delivery not exists.' });
    }

    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
      attributes: ['name', 'city', 'cep'],
    });

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not exists.' });
    }

    const { id, product } = await Order.create(req.body);

    await Queue.add(NewOrder.key, {
      deliverytExists,
      product,
      recipientExists,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    await order.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    await Order.destroy({ where: { id } });

    return res.status(200).json();
  }
}

export default new OrderController();
