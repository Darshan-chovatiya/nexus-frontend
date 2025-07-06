import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from './service/Uri';
import { FaBuilding, FaUser, FaMapMarkerAlt, FaEnvelope, FaBoxOpen, FaTags, FaInfoCircle, FaPhone, FaGlobe } from 'react-icons/fa';

const CompanyDataForm = () => {
  const { id } = useParams(); // get :id from route
  const [company, setCompany] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/company/user/public/${id}`);
        if (res.data?.data) {
          setCompany(res.data.data);
        } else {
          setError('Company not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong.');
      }
    };
    fetchCompany();
  }, [id]);

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="alert alert-danger border-0 shadow-lg rounded-4 px-4 py-3">
          <div className="d-flex align-items-center">
            <FaInfoCircle className="me-2 text-danger" />
            <span className="fw-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium">Loading company details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="signup_bg" style={{minHeight: '40vh'}}>
        <div className="container py-5">
          <div className="row align-items-center justify-content-center text-center text-white">
            <div className="col-lg-8">
              <div className="mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={`${BaseUrl}/${company.profileImage}`}
                    alt={company.company}
                    className="rounded-circle border border-4 border-white shadow-lg"
                    style={{ 
                      width: '150px', 
                      height: '150px', 
                      objectFit: 'cover',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                  />
                  <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2" 
                       style={{ width: '40px',height:'40px' }}>
                    <FaBuilding className="text-white" size={16} />
                  </div>
                </div>
              </div>
              <h1 className="display-5 fw-bold mb-3">{company.company}</h1>
              <p className="lead mb-4 opacity-90">{company.prefix} {company.name}</p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <span className="badge bg-white text-dark px-3 py-2 rounded-pill shadow-sm">
                  <FaTags className="me-1" /> {company.category}
                </span>
                <span className="badge bg-white text-dark px-3 py-2 rounded-pill shadow-sm">
                  <FaMapMarkerAlt className="me-1" /> {company.city}, {company.state}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Contact Information Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4 text-primary">
                  <FaInfoCircle className="me-2" />
                  Contact Information
                </h5>
                
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 flex-shrink-0 d-flex justify-content-center align-items-center" style={{ width: '40px',height:'40px' }}>
                      <FaEnvelope className="text-primary" size={14} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Email Address</small>
                      <span className="fw-medium">{company.email}</span>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3 flex-shrink-0 d-flex justify-content-center align-items-center" style={{ width: '40px',height:'40px' }}>
                      <FaMapMarkerAlt className="text-success" size={14} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Location</small>
                      <span className="fw-medium">{company.city}, {company.state}</span>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3 flex-shrink-0 d-flex justify-content-center align-items-center" style={{ width: '40px',height:'40px' }}>
                      <FaTags className="text-warning" size={14} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Category</small>
                      <span className="fw-medium">{company.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="col-lg-8">
            <div className="row g-4">
              {/* About Business Card */}
              <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-3 text-primary">
                      <FaBuilding className="me-2" />
                      About Our Business
                    </h5>
                    <p className="text-muted lh-lg mb-0" style={{ textAlign: 'justify' }}>
                      {company.aboutBusiness}
                    </p>
                  </div>
                </div>
              </div>

              {/* About Product Card */}
              <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-3 text-success">
                      <FaBoxOpen className="me-2" />
                      Our Products & Services
                    </h5>
                    <p className="text-muted lh-lg mb-0" style={{ textAlign: 'justify' }}>
                      {company.aboutProduct}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDataForm;