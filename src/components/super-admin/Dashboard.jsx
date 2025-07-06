// Dashboard.js
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';

const Dashboard = () => {
  const token = localStorage.getItem('adminToken');
  const [stats, setStats] = useState({ totalCompanies: 0, totalVisitor: 0 });

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/company/dashboard/company`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-white-75 mb-1">Total Companies</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalCompanies}</h2>
                  <small className="text-white-75">All time companies</small>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                  <FaUsers size={24} className='text-black' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #26de81, #20bf6b)' }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-white-75 mb-1">Total Visitor</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalVisitor}</h2>
                  <small className="text-white-75">All Time Visitors</small>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                  <FaCalendarAlt size={24} className='text-black' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
