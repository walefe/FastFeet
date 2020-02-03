import { Op } from 'sequelize';
import { isAfter, isBefore, parseISO, getHours } from 'date-fns';

import Delivery from '../models/Delivery';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class CouriesController {
  async index(req, res) {
    const { id } = req.params;
    const { filter, page = 1 } = req.query;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'User is not a delivery person' });
    }

    if (filter === 'open') {
      const orders = await Order.findAll({
        where: { deliveryman_id: id, end_date: null, canceled_at: null },
        attributes: ['id', 'product'],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['name', 'street', 'city'],
          },
        ],
      });
      return res.json(orders);
    }
    if (filter === 'delivered') {
      const orders = await Order.findAll({
        where: {
          deliveryman_id: id,
          end_date: {
            [Op.ne]: null,
          },
        },
        limit: 20,
        offset: (page - 1) * 20,
        attributes: ['id', 'product'],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['name', 'street', 'city'],
          },
        ],
      });
      return res.json(orders);
    }

    return res.status(401).json({ error: 'Orders not found.' });
  }

  async update(req, res) {
    const { id } = req.params;
    const { start_date, end_date } = req.query;
    const { deliveryman_id, signature_id } = req.body;

    const delivery = await Delivery.findByPk(deliveryman_id);

    if (!delivery) {
      return res.status(400).json({ error: 'User is not a delivery person' });
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does note exist.' });
    }

    if (start_date) {
      const orders = await Order.findAll({
        where: { deliveryman_id },
      });

      const startHour = getHours(parseISO(start_date));
      const endHour = getHours(parseISO(start_date));

      if (
        isBefore(startHour, getHours(new Date().setHours(8))) ||
        isAfter(endHour, getHours(new Date().setHours(17)))
      ) {
        return res.status(401).json({ error: 'Hour not permited' });
      }

      if (orders.length >= 5) {
        return res.status(400).json({
          error: 'you have already reached the limit of 5 withdrawals',
        });
      }

      await order.update({ start_date });
    }

    if (end_date) {
      const file = await File.findByPk(signature_id);

      if (!file) {
        return res.status(400).json({ error: 'Signature not exists' });
      }
      await order.update({ end_date, signature_id });
    }

    return res.json(order);
  }
}

export default new CouriesController();
