import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUsers, FaTag } from 'react-icons/fa';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';
import moment from 'moment';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const token = localStorage.getItem('adminToken');
  const [stats, setStats] = useState({ totalCompanies: 0, totalVisitor: 0 });
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [updateId, setUpdateId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryUpdateId, setCategoryUpdateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [slotDate, setSlotDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('10');
  const [slotCreationLoading, setSlotCreationLoading] = useState(false);

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
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Stats Fetch Failed',
        text: 'Failed to fetch dashboard stats.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/banner/banners`);
      setBanners(res.data);
    } catch (err) {
      console.error('Failed to load banners', err);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Banner Load Failed',
        text: 'Failed to load banners.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/category/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 200) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Category Load Failed',
        text: 'Failed to load categories.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBanners();
    fetchCategories();
  }, []);

  const handleSlotCreation = async (e) => {
    e.preventDefault();
    try {
      setSlotCreationLoading(true);
      const res = await axios.post(`${BaseUrl}/slot/admin/slots/create`, {
        date: slotDate,
        startTime,
        endTime,
        duration,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        icon: 'success',
        title: 'Global slots created!',
        showConfirmButton: false,
        timer: 2000,
      });
      setSlotDate('');
      setStartTime('');
      setEndTime('');
      setDuration('10');
    } catch (err) {
      console.error("Slot creation error:", err.response?.data || err.message);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Slot Creation Failed',
        text: err.response?.data?.error || 'Failed to create slots.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    } finally {
      setSlotCreationLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Only JPG, PNG, and WEBP images are allowed.',
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
        return;
      }
      if (file.size > maxSize) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'File Too Large',
          text: 'File size must be under 2MB.',
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
        return;
      }
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleBannerSubmit = async (e) => {
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
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Banner Updated',
          text: 'Banner has been successfully updated!',
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
        setUpdateId(null);
      } else {
        await axios.post(`${BaseUrl}/banner/bannerss`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Banner Added',
          text: 'Banner has been successfully added!',
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      }

      setSelectedFile(null);
      setPreviewURL('');
      setUpdateId(null);
      fetchBanners();

      const fileInput = document.getElementById('bannerInput');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Upload failed', err);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload banner.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Category Name Required',
        text: 'Please enter a category name.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
      return;
    }

    setCategoryLoading(true);
    try {
      if (categoryUpdateId) {
        await axios.put(`${BaseUrl}/category/categories/${categoryUpdateId}`, { name: categoryName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Category Updated',
          text: 'Category has been successfully updated!',
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      } else {
        await axios.post(`${BaseUrl}/category/categories`, { name: categoryName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Category Added',
          text: 'Category has been successfully added!',
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      }

      setCategoryName('');
      setCategoryUpdateId(null);
      fetchCategories();
    } catch (err) {
      console.error('Category operation failed', err);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: categoryUpdateId ? 'Category Update Failed' : 'Category Creation Failed',
        text: err.response?.data?.message || 'Failed to process category.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleEditBanner = (id) => {
    setUpdateId(id);
  };

  const handleEditCategory = (id, name) => {
    setCategoryUpdateId(id);
    setCategoryName(name);
  };

  const handleDeleteBanner = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this banner?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BaseUrl}/banner/banners/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          icon: 'success',
          title: 'Banner Deleted',
          text: 'Banner has been successfully deleted!',
          showConfirmButton: false,
          timer: 2000,
        });
        fetchBanners();
      } catch (err) {
        console.error('Delete failed', err);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete banner.',
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BaseUrl}/category/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          icon: 'success',
          title: 'Category Deleted',
          text: 'Category has been successfully deleted!',
          showConfirmButton: false,
          timer: 2000,
        });
        fetchCategories();
      } catch (err) {
        console.error('Delete failed', err);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Delete Failed',
          text: err.response?.data?.message || 'Failed to delete category.',
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      }
    }
  };

  return (
    <div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-white-75 mb-1">Total Users</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalCompanies}</h2>
                  <small className="text-white-75">All time Users</small>
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

      <div className="container mt-5">
        <h4 className="mb-3">📅 Create Slots for Users</h4>
        <form onSubmit={handleSlotCreation} className="row g-3 align-items-end">
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              min={moment().format("YYYY-MM-DD")}
            />
          </div>
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <label className="form-label">End Time</label>
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <label className="form-label">Slot Duration (minutes)</label>
            <select
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="10">10 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="40">40 minutes</option>
              <option value="50">50 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
          <div className="col-xxl-4 col-md-6 mx-auto">
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={slotCreationLoading}
            >
              {slotCreationLoading ? 'Creating...' : 'Create Slots'}
            </button>
          </div>
        </form>
      </div>

      <div className="container mt-5">
        <h4 className="mb-3">🖼️ Manage Banners</h4>

        <form onSubmit={handleBannerSubmit} className="mb-4">
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
                    onClick={() => handleEditBanner(banner._id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger w-100"
                    onClick={() => handleDeleteBanner(banner._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-5">
        <h4 className="mb-3">🏷️ Manage Categories</h4>

        <form onSubmit={handleCategorySubmit} className="mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-primary" type="submit" disabled={categoryLoading}>
                {categoryUpdateId ? 'Update Category' : 'Add Category'}
              </button>
            </div>
            {categoryUpdateId && (
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setCategoryUpdateId(null);
                    setCategoryName('');
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="row">
          {categories.map((category) => (
            <div className="col-md-3 mb-4" key={category._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title">{category.name}</h6>
                  <small className="text-muted d-block mb-2">
                    Created: {moment(category.createdAt).format('MMM D, YYYY')}
                  </small>
                  <button
                    className="btn btn-sm btn-outline-success w-100 mb-2"
                    onClick={() => handleEditCategory(category._id, category.name)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger w-100"
                    onClick={() => handleDeleteCategory(category._id)}
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