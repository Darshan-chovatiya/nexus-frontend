import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';
import CommonHeader from './CommonHeader';

const ProfileSetting = ({ toggleSidebar, setCurrentPage }) => {
  const company = JSON.parse(localStorage.getItem('company'));

  const [formData, setFormData] = useState({
    prefix: company.prefix || 'Mr',
    name: company.name || '',
    company: company.company || '',
    state: company.state || '',
    city: company.city || '',
    email: company.email || '',
    category: company.category || '',
    aboutBusiness: company.aboutBusiness || '',
    aboutProduct: company.aboutProduct || '',
    profileImage: null,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch states and categories on component mount
  useEffect(() => {
    const fetchStatesAndCategories = async () => {
      setStatesLoading(true);
      setCategoriesLoading(true);
      try {
        const [statesRes, categoriesRes] = await Promise.all([
          axios.get(`${BaseUrl}/company/states`),
          axios.get(`${BaseUrl}/category/categories`),
        ]);

        if (statesRes.data.status === 200 && Array.isArray(statesRes.data.data)) {
          const uniqueStates = statesRes.data.data.filter(
            (state, index, self) =>
              index === self.findIndex((s) => s.name === state.name)
          );
          setStates(uniqueStates);
        } else {
          setErrorMsg(statesRes.data.message || 'Failed to fetch states.');
        }

        if (categoriesRes.data.status === 200 && Array.isArray(categoriesRes.data.data)) {
          setCategories(categoriesRes.data.data);
        } else {
          setErrorMsg(categoriesRes.data.message || 'Failed to fetch categories.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setErrorMsg(err?.response?.data?.message || 'Error fetching data. Please try again.');
      } finally {
        setStatesLoading(false);
        setCategoriesLoading(false);
      }
    };
    fetchStatesAndCategories();
  }, []);

  // Fetch cities when state changes or on component mount if company.state exists
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.state) {
        setCities([]);
        return;
      }
      const selectedState = states.find((state) => state.name === formData.state);
      if (!selectedState) {
        setCities([]);
        return;
      }
      setCitiesLoading(true);
      try {
        const res = await axios.post(`${BaseUrl}/company/cities-by-state`, { name: selectedState.name });
        if (res.data.status === 200 && Array.isArray(res.data.data)) {
          setCities(res.data.data);
          // Ensure the current city is still selected if it exists in the fetched cities
          if (!res.data.data.some((city) => city.name === formData.city)) {
            setFormData((prev) => ({ ...prev, city: '' }));
          }
        } else {
          setCities([]);
          setErrorMsg(res.data.message || 'No cities found for the selected state.');
        }
      } catch (err) {
        console.error('Cities fetch error:', err);
        setCities([]);
        setErrorMsg(err?.response?.data?.message || 'Error fetching cities. Please try again.');
      } finally {
        setCitiesLoading(false);
      }
    };
    fetchCities();
  }, [formData.state, states]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      // Only reset city if the state is changed
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === 'state' && value !== prev.state ? { city: '' } : {}),
      }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('companyToken');
      const form = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      }
      const res = await axios.put(`${BaseUrl}/company/profile/update/${company._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data?.data) {
        localStorage.setItem('company', JSON.stringify(res.data.data));
        setSuccessMsg('Profile updated successfully.');
        window.location.reload();
      } else {
        setErrorMsg(res.data.message || 'Update failed.');
      }
    } catch (err) {
      console.error('Update Error:', err);
      setErrorMsg('Something went wrong.');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }
    try {
      const token = localStorage.getItem('companyToken');
      const res = await axios.put(`${BaseUrl}/company/change-password/${company._id}`, passwordData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.data?.message === 'Password updated successfully') {
        setPasswordSuccess('Password updated successfully.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(res.data.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Password Update Error:', err);
      setPasswordError('Something went wrong.');
    }
  };

  return (
    <div className="container-fluid p-0">
      <CommonHeader title="Account Setting" company={company} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} />
      <div className="row">
        <div className="col-lg-6">
          <h3 className="my-4">Profile Settings</h3>
          <form onSubmit={handleUpdateSubmit} className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label">Prefix</label>
              <select name="prefix" className="form-select" value={formData.prefix} onChange={handleChange} required>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
                <option>Dr</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Company Name</label>
              <input className="form-control" name="company" value={formData.company} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">State</label>
              <select
                className="form-select"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                disabled={statesLoading || states.length === 0}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              {statesLoading && <small className="text-muted">Loading states...</small>}
              {!statesLoading && states.length === 0 && <small className="text-danger">No states available</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">City</label>
              <select
                className="form-select"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={citiesLoading || !formData.state || cities.length === 0}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {citiesLoading && <small className="text-muted">Loading cities...</small>}
              {!citiesLoading && formData.state && cities.length === 0 && (
                <small className="text-danger">No cities available</small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={categoriesLoading || categories.length === 0}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoriesLoading && <small className="text-muted">Loading categories...</small>}
              {!categoriesLoading && categories.length === 0 && <small className="text-danger">No categories available</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">About Business</label>
              <textarea
                className="form-control"
                rows="2"
                name="aboutBusiness"
                value={formData.aboutBusiness}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">About Product</label>
              <textarea
                className="form-control"
                rows="2"
                name="aboutProduct"
                value={formData.aboutProduct}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Profile Image</label>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                name="profileImage"
                onChange={handleChange}
              />
              {company.profileImage && (
                <div className="mt-2">
                  <img
                    src={`${BaseUrl}/${company.profileImage}`}
                    alt="Current Profile"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>

        <div className="col-lg-6">
          <h3 className="my-4">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-control"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
              />
            </div>
            {passwordError && <div className="alert alert-danger">{passwordError}</div>}
            {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
            <button type="submit" className="btn btn-primary">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;