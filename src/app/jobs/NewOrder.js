import Mail from '../../lib/Mail';

class NewOrder {
  get key() {
    return 'NewOrder';
  }

  async handle({ data }) {
    const { deliverytExists, product, recipientExists } = data;

    await Mail.sendMail({
      to: `${deliverytExists.name} <${deliverytExists.email}>`,
      subject: 'Nova entrega disponível.',
      template: 'newOrder',
      context: {
        delivery: deliverytExists.name,
        product,
        recipient: recipientExists.name,
      },
    });
  }
}

export default new NewOrder();
