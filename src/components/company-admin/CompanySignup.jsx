import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../service/Uri';
import axios from 'axios';
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaIdCard,
  FaCity, FaGlobeAsia, FaBuilding, FaInfoCircle, FaImage
} from 'react-icons/fa';

const CompanySignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prefix: 'Mr',
    name: '',
    company: '',
    state: '',
    city: '',
    email: '',
    password: '',
    aboutBusiness: '',
    aboutProduct: '',
    category: '',
    mobile: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
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
          axios.get(`${BaseUrl}/category/categories`)
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
          if (categoriesRes.data.data.length > 0) {
            setForm((prev) => ({ ...prev, category: categoriesRes.data.data[0]._id }));
          }
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

  // Fetch cities when state changes
  useEffect(() => {
  const fetchCities = async () => {
    if (!form.state) {
      setCities([]);
      return;
    }
    setCitiesLoading(true);
    try {
      // Find the state object to get the state name
      const selectedState = states.find((state) => state.name === form.state);
      if (!selectedState) {
        setCities([]);
        setErrorMsg('Selected state not found.');
        return;
      }

      const res = await axios.post(`${BaseUrl}/company/cities-by-state`, { name: selectedState.name });
      if (res.data.status === 200 && Array.isArray(res.data.data)) {
        setCities(res.data.data);
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
}, [form.state, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'state' ? { city: '' } : {}),
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const res = await axios.post(`${BaseUrl}/company/signup`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 200 && res.data.data) {
        setSuccessMsg('Company account created! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setErrorMsg(res.data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMsg(err?.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center p-4 signup_bg">
      <div className="float-blob blob1"></div>
      <div className="float-blob blob2"></div>

      <div className="card p-5 shadow-sm" style={{ maxWidth: 550, width: '100%' }}>
        <div className="text-center mb-4">
          <FaBuilding size={32} className="text-primary mb-2" />
          <h3 className="fw-bold">Company Sign Up</h3>
          <p className="text-muted mb-0">Register your company to get started</p>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Prefix</label>
              <select className="form-select" name="prefix" value={form.prefix} onChange={handleChange} required>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
            </div>

            <div className="col-md-8">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Company Name</label>
              <div className="input-group">
                <span className="input-group-text"><FaIdCard /></span>
                <input type="text" className="form-control" name="company" value={form.company} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Mobile No</label>
              <div className="input-group">
                <span className="input-group-text"><FaIdCard /></span>
                <input type="number" className="form-control" name="mobile" value={form.mobile} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">State</label>
              <div className="input-group">
                <span className="input-group-text"><FaGlobeAsia /></span>
                <select
                  className="form-select"
                  name="state"
                  value={form.state}
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
              </div>
              {statesLoading && <small className="text-muted">Loading states...</small>}
              {!statesLoading && states.length === 0 && <small className="text-danger">No states available</small>}
            </div>

            <div className="col-md-6">
              <label className="form-label">City</label>
              <div className="input-group">
                <span className="input-group-text"><FaCity /></span>
                <select
                  className="form-select"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  disabled={citiesLoading || !form.state || cities.length === 0}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              {citiesLoading && <small className="text-muted">Loading cities...</small>}
              {!citiesLoading && form.state && cities.length === 0 && <small className="text-danger">No cities available</small>}
            </div>

            <div className="col-12">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text"><FaEnvelope /></span>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  name="password"
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">About Business</label>
              <div className="input-group">
                <span className="input-group-text"><FaInfoCircle /></span>
                <textarea className="form-control" rows="2" name="aboutBusiness" value={form.aboutBusiness} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">About Product</label>
              <div className="input-group">
                <span className="input-group-text"><FaInfoCircle /></span>
                <textarea className="form-control" rows="2" name="aboutProduct" value={form.aboutProduct} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Category</label>
              <div className="input-group">
                <span className="input-group-text"><FaInfoCircle /></span>
                <select
                  className="form-select"
                  name="category"
                  value={form.category}
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
              </div>
              {categoriesLoading && <small className="text-muted">Loading categories...</small>}
              {!categoriesLoading && categories.length === 0 && <small className="text-danger">No categories available</small>}
            </div>

            <div className="col-12">
              <label className="form-label">Profile Image</label>
              <div className="input-group">
                <span className="input-group-text"><FaImage /></span>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>
          </div>

          {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary fw-bold py-2" disabled={loading}>
              {loading ? 'Creating Account...' : <><FaSignInAlt className="me-2" /> Create Company Account</>}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-muted small">
              Already have an account? <a href="/company-login/your-company" className="text-primary fw-bold">Login here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySignup;