import { Op } from 'sequelize';
import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { q } = req.query;

    let recipients;

    if (q) {
      recipients = await Recipient.findAll({
        where: {
          name: {
            [Op.iLike]: `${q}%`,
          },
        },
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
      });
    } else {
      recipients = await Recipient.findAll({
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
      });
    }

    if (!recipients) {
      return res.status(400).json({ error: 'Recipent does note exists.' });
    }

    return res.json(recipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validate fails.' });
    }
    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await Recipient.create(req.body);

    return res.json({ id, name, street, number, complement, state, city, cep });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validate fails.' });
    }
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient not found.' });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await recipient.update(req.body);

    return res.json({ id, name, street, number, complement, state, city, cep });
  }
}

export default new RecipientController();
