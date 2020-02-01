import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(model) {
    this.belongsTo(model.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });

    this.belongsTo(model.Delivery, {
      foreignKey: 'deliveryman_id',
      as: 'delivery',
    });

    this.belongsTo(model.File, { foreignKey: 'signature_id', as: 'signature' });
  }
}

export default Order;
