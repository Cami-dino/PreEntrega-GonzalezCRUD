import Ticket from '../models/Ticket.js';
import { v4 as uuidv4 } from 'uuid'; // Para generar códigos únicos

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel.findById(cid).populate('products.product');

    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    let totalAmount = 0;
    const unprocessedProducts = [];

    const purchasedProducts = [];

    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;

      if (product.stock >= quantity) {
        product.stock -= quantity;
        await product.save();
        totalAmount += product.price * quantity;
        purchasedProducts.push(item);
      } else {
        unprocessedProducts.push(product._id);
      }
    }

    // Crear ticket si hubo productos comprados
    let ticket = null;
    if (purchasedProducts.length > 0) {
      ticket = await Ticket.create({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: req.user.email
      });
    }

    // Filtrar carrito para dejar solo productos no comprados
    cart.products = cart.products.filter(item =>
      unprocessedProducts.includes(item.product._id)
    );
    await cart.save();

    res.status(200).json({
      message: 'Compra procesada',
      ticket,
      unprocessedProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
