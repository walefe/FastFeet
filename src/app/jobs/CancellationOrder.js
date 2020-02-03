import Mail from '../../lib/Mail';

class CancellationOrder {
  get key() {
    return 'CancellationOrder';
  }

  async handle({ data }) {
    const { name, email, deliveryProblem } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Entrega cancelada.',
      template: 'cancelationOrder',
      context: {
        delivery: name,
        product: deliveryProblem.Order.product,
        description: deliveryProblem.description,
      },
    });
  }
}

export default new CancellationOrder();
