import Delivery from '../models/Delivery';
import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Order';

import CancellationOrder from '../jobs/CancellationOrder';
import Queue from '../../lib/Queue';

class DeliveryProblemsController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblems.findAll();

    if (!deliveryProblems) {
      return res.status(400).json({ error: 'Delivery problems not found.' });
    }

    return res.json(deliveryProblems);
  }

  async show(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not exists.' });
    }

    const orderProblems = await DeliveryProblems.findAll({
      where: { delivery_id: id },
    });

    return res.json(orderProblems);
  }

  async store(req, res) {
    const { id } = req.params;
    const { delivery_id } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(401).json({ error: 'User is not delivery.' });
    }

    const orderExist = await Order.findByPk(delivery_id);

    if (!orderExist) {
      return res.status(400).json({ error: 'Order not found.' });
    }

    const deliveryProblem = await DeliveryProblems.create(req.body);

    return res.json(deliveryProblem);
  }

  async update(req, res) {
    const { id } = req.params;

    const deliveryProblem = await DeliveryProblems.findByPk(id, {
      include: [
        {
          model: Order,
          attributes: ['id', 'product'],
          include: [
            { model: Delivery, as: 'delivery', attributes: ['name', 'email'] },
          ],
        },
      ],
    });

    if (!deliveryProblem) {
      return res.status(400).json({ error: 'Order not found.' });
    }

    const order = await Order.findByPk(deliveryProblem.Order.id);

    await order.update({ canceled_at: new Date() });

    const { name, email } = deliveryProblem.Order.delivery;

    await Queue.add(CancellationOrder.key, {
      name,
      email,
      deliveryProblem,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemsController();
