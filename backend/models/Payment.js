const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'monthly', 'term-wise'
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin who created it
});

module.exports = mongoose.model('Fee', feeSchema);