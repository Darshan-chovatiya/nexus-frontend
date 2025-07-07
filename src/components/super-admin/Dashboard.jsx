// Dashboard.js
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';
import moment from 'moment';

const Dashboard = () => {
  const token = localStorage.getItem('adminToken');
  const [stats, setStats] = useState({ totalCompanies: 0, totalVisitor: 0 });

  const [banners, setBanners] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [updateId, setUpdateId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/banner/banners`);
      setBanners(res.data);
    } catch (err) {
      console.error('Failed to load banners', err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG, and WEBP images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be under 2MB.');
        return;
      }

      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('banner', selectedFile);

    setLoading(true);
    try {
      if (updateId) {
        await axios.put(`${BaseUrl}/banner/banners/${updateId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUpdateId(null);
      } else {
        await axios.post(`${BaseUrl}/banner/bannerss`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setSelectedFile(null);
setPreviewURL('');
setUpdateId(null);
fetchBanners();

// Clear file input manually
const fileInput = document.getElementById('bannerInput');
if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setUpdateId(id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      await axios.delete(`${BaseUrl}/banner/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBanners();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };


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

<div className="container mt-4">
      <h4 className="mb-3">🖼️ Manage Banners</h4>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <input
            id="bannerInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
              style={{ maxWidth: '300px' }}
            />
          </div>

          {previewURL && (
            <div className="col-auto">
              <img
                src={previewURL}
                alt="Preview"
                style={{ height: 60, borderRadius: 6, objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="col-auto">
            <button className="btn btn-primary" type="submit" disabled={loading || !selectedFile}>
              {updateId ? 'Update Banner' : 'Add Banner'}
            </button>
          </div>

          {updateId && (
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setUpdateId(null);
                  setSelectedFile(null);
                  setPreviewURL('');
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="row">
        {banners.map((banner) => (
          <div className="col-md-3 mb-4" key={banner._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={`${BaseUrl}${banner.imageUrl}`}
                alt="Banner"
                className="card-img-top"
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <div className="card-body text-center">
                <small className="text-muted d-block mb-2">
                  Uploaded: {moment(banner.uploadedAt).format('MMM D, YYYY')}
                </small>
                <button
                  className="btn btn-sm btn-outline-success w-100 mb-2"
                  onClick={() => handleEdit(banner._id)}
                >
                  Update
                </button>
                <button
                  className="btn btn-sm btn-outline-danger w-100"
                  onClick={() => handleDelete(banner._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
