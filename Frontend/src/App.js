import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';  
import icp2 from './images/icp2.jpg'; // Import the new background image

import Register from './components/Register';
import Login from './components/login';
import AdminDashboard from './components/AdminDashboard'; 
import ParentDashboard from './components/ParentDashboard';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <nav className=" bg-green-500 p-4">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link to="/" className="text-white hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/register" className="text-white hover:underline">Register</Link>
            </li>
            <li>
              <Link to="/login" className="text-white hover:underline">Login</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <div
                className="flex-1 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${icp2})` }}
              >
                <div className="bg-black bg-opacity-50 p-6 rounded-lg">
                  <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">
                    School Fee SaaS
                  </h1>
                </div>
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;