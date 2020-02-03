import File from '../models/File';
import Delivery from '../models/Delivery';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { id } = req.params;

    if (id) {
      const delivery = await Delivery.findByPk(id);

      if (!delivery) {
        return res.status(400).json({ error: 'User not delivery.' });
      }
    }

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
