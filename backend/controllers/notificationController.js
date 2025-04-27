const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const Fee = require('../models/Fee');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminder = async () => {
  try {
    const today = new Date();
    const fees = await Fee.find({ dueDate: { $lte: today } }).populate('createdBy');
    const parents = await User.find({ role: 'parent' });

    for (const fee of fees) {
      for (const parent of parents) {
        const message = `Reminder: Your ${fee.type} fee of $${fee.amount} is due today.`;
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: parent.email,
          subject: 'School Fee Payment Reminder',
          text: message,
        };

        await transporter.sendMail(mailOptions);

        const notification = new Notification({
          userId: parent._id,
          message,
          type: 'email',
        });
        await notification.save();
      }
    }
  } catch (err) {
    console.error('Error sending reminders:', err);
  }
};

// Run reminders daily
setInterval(sendReminder, 24 * 60 * 60 * 1000); // Run every 24 hours

module.exports = { sendReminder };