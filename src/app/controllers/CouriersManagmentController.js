import * as Yup from 'yup';

import Delivery from '../models/Delivery';

class CouriersManagmentController {
  async index(req, res) {
    const deliveries = await Delivery.findAll();

    if (!deliveries) {
      return res.status(401).json({ error: 'Deliveries not found.' });
    }

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validate fails.' });
    }

    const deliveryExists = await Delivery.findOne({
      where: { email: req.body.email },
    });

    if (deliveryExists) {
      return res.status(401).json({ error: 'Delivery already exists.' });
    }

    const { id, name, email } = await Delivery.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validate fails.' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not exists.' });
    }

    const { name, email } = await delivery.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not exists.' });
    }

    await Delivery.destroy({ where: { id } });

    return res.status(200).json();
  }
}

export default new CouriersManagmentController();
