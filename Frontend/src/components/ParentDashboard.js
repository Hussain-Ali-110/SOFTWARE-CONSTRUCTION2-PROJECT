import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('your_stripe_publishable_key'); // Replace with your Stripe Publishable Key

const PaymentForm = ({ feeId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/payments',
        { feeId, amount, paymentMethodId: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/payments',
        { feeId, amount, paymentMethodId: paymentMethod.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.payment) {
        onSuccess();
        alert('Payment successful!');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Card Details</label>
        <CardElement className="p-2 border rounded" />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const ParentDashboard = () => {
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const feesRes = await axios.get('http://localhost:5000/api/fees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const paymentsRes = await axios.get('http://localhost:5000/api/payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFees(feesRes.data);
        setPayments(paymentsRes.data);
      } catch (err) {
        console.error(err.response.data);
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handlePaymentSuccess = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/payments', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPayments(res.data);
    setSelectedFee(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Parent Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Submit Payment</h3>
      <div className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700">Select Fee</label>
          <select
            value={selectedFee?.id || ''}
            onChange={(e) => {
              const fee = fees.find(f => f._id === e.target.value);
              setSelectedFee(fee ? { id: fee._id, amount: fee.amount } : null);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a fee</option>
            {fees.map((fee) => (
              <option key={fee._id} value={fee._id}>
                {fee.type} - {fee.amount} (Due: {new Date(fee.dueDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
        {selectedFee && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              feeId={selectedFee.id}
              amount={selectedFee.amount}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-4">Payment History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Fee Type</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Method</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="py-2 px-4 border">{payment.feeId.type}</td>
                <td className="py-2 px-4 border">{payment.amount}</td>
                <td className="py-2 px-4 border">{payment.method}</td>
                <td className="py-2 px-4 border">{new Date(payment.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParentDashboard;