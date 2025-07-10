import React, { useState } from 'react';
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
    category: 'Pure B2B',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        formData.append('profileImage', profileImage); // field name must match backend (e.g. multer expects "logo")
      }
      
      
      const res = await axios.post(`${BaseUrl}/company/signup`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res.data,"data");

      if (res.data?.data) {
        setSuccessMsg("Company account created! Redirecting to login...");
        setTimeout(() => {
          navigate(`/`);
        }, 2000);
      } else {
        setErrorMsg(res.data.message || "Signup failed.");
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" d-flex align-items-center justify-content-center p-4 signup_bg" >
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
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
                <option>Dr</option>
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
                <input type="text" className="form-control" name="state" value={form.state} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">City</label>
              <div className="input-group">
                <span className="input-group-text"><FaCity /></span>
                <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} required />
              </div>
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
                  type={showPassword ? "text" : "password"}
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
              <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
                <option>Pure B2B</option>
                <option>Pure B2C</option>
                <option>B2B + B2C</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Profile Image</label>
              <div className="input-group">
                <span className="input-group-text"><FaImage /></span>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} required />
              </div>
            </div>
          </div>

          {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary fw-bold py-2" disabled={loading}>
              {loading ? "Creating Account..." : <><FaSignInAlt className="me-2" /> Create Company Account</>}
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
