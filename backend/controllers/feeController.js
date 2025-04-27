const Fee = require('../models/Fee');

// Create a new fee (Admin only)
const createFee = async (req, res) => {
  const { type, amount, dueDate } = req.body;
  try {
    const fee = new Fee({ type, amount, dueDate, createdBy: req.user.id });
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update an existing fee (Admin only)
const updateFee = async (req, res) => {
  const { type, amount, dueDate } = req.body;
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ msg: 'Fee not found' });
    if (fee.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    fee.type = type || fee.type;
    fee.amount = amount || fee.amount;
    fee.dueDate = dueDate || fee.dueDate;
    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { createFee, updateFee };