import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';

const ProfileSetting = () => {
  const storedAdmin = JSON.parse(localStorage.getItem('admin'));
  const token = localStorage.getItem('adminToken');
  const [emailId, setEmailId] = useState(storedAdmin?.emailId || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!emailId || !password) {
      setError("Both email and password are required.");
      return;
    }
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const response = await axios.put(`${BaseUrl}/super-admin/update-profile/${storedAdmin._id}`,{ emailId, password },{ headers: {Authorization: `Bearer ${token}`,},}
      );
      if (response.data.data) {
        const updatedAdmin = {
          ...storedAdmin,
          emailId: response.data.data.emailId,
        };
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      }
      setMessage(response.data.message || "Profile updated successfully!");
      setPassword('');
    } catch (error) {
      console.error("Update failed:", error);
      setError(err?.response?.data?.message || "Something went wrong while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-10 col-xl-8 col-xxl-6  mx-auto"> 
          <form onSubmit={handleUpdate} className="card p-4 shadow space-y-4 max-w-md mx-auto mt-4">
            <div className='mb-4'>
              <label className="form-label font-medium">Email</label>
              <input type="email" className="form-control border p-2 rounded w-full" value={emailId} onChange={(e) => setEmailId(e.target.value)} required />
            </div>
            <div className='mb-4'>
              <label className="form-label font-medium">New Password</label>
              <input type="password" className="form-control border p-2 rounded w-full" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <button type="submit" className="btn btn-primary bg-blue-600 text-white py-2 px-4 rounded w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
