import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [fees, setFees] = useState([]);
  const [formData, setFormData] = useState({ type: '', amount: '', dueDate: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/fees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFees(res.data);
      } catch (err) {
        console.error(err.response.data);
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchFees();
  }, [navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/fees', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get('http://localhost:5000/api/fees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFees(res.data);
      setFormData({ type: '', amount: '', dueDate: '' });
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Create Fee Structure</h3>
      <form onSubmit={onSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700">Fee Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={onChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={onChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={onChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Fee
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Fee Structures</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Due Date</th>
              <th className="py-2 px-4 border">Created By</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee._id}>
                <td className="py-2 px-4 border">{fee.type}</td>
                <td className="py-2 px-4 border">{fee.amount}</td>
                <td className="py-2 px-4 border">{new Date(fee.dueDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{fee.createdBy.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;