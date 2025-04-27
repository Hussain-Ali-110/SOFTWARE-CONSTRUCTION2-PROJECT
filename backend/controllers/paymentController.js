const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');

const submitPayment = async (req, res) => {
  const { feeId, amount, paymentMethodId } = req.body;
  try {
    // Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: 'http://localhost:3000/parent-dashboard',
    });

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ msg: 'Payment failed' });
    }

    // Save the payment in the database
    const payment = new Payment({
      feeId,
      userId: req.user.userId,
      amount,
      method: 'credit card',
      date: new Date(),
    });
    await payment.save();

    res.status(201).json({ payment, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Payment processing failed' });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId }).populate('feeId', 'type amount dueDate');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { submitPayment, getPayments };