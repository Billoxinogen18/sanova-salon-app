const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'dkk', paymentMethod, customerId, bookingId } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method: paymentMethod,
      customer: customerId,
      metadata: {
        bookingId,
        app: 'sanova'
      },
      confirm: true,
      return_url: 'sanova://payment-success'
    });

    res.status(200).json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}
