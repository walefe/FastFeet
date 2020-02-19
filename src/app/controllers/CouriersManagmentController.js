import { Op } from 'sequelize';
import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import File from '../models/File';

class CouriersManagmentController {
  async index(req, res) {
    const { q } = req.query;

    let deliveries;

    if (q) {
      deliveries = await Delivery.findAll({
        where: {
          name: {
            [Op.iLike]: `${q}%`,
          },
        },
        attributes: ['id', 'name', 'email', 'avatar_id'],
      });
    } else {
      deliveries = await Delivery.findAll({
        attributes: ['id', 'name', 'email', 'avatar_id'],
      });
    }

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
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validate fails.' });
    }

    const { id } = req.params;
    const { avatar_id } = req.body;

    const delivery = await Delivery.findByPk(id, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not exists.' });
    }

    const avatar = await File.findByPk(avatar_id);

    if (!avatar) {
      return res.status(401).json({ error: 'File not exists.' });
    }

    await delivery.update(req.body);

    return res.json(delivery);
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
