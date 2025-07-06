import { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from "../service/Uri";
import CommonHeader from './CommonHeader';

const Visitors = ({ toggleSidebar, setCurrentPage, isOpen }) => {
  const company = JSON.parse(localStorage.getItem('company'));
  const [otherCompanies, setOtherCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOtherCompanies = async () => {
    try {
      const token = localStorage.getItem("companyToken");
      const res = await axios.get(`${BaseUrl}/company/another/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOtherCompanies(res.data.data);
    } catch (err) {
      console.error("Error fetching companies:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtherCompanies();
  }, []);

  return (
    <div className="container-fluid p-0">
      <CommonHeader
        title="Users"
        company={company}
        toggleSidebar={toggleSidebar}
        setCurrentPage={setCurrentPage}
      />

<div className="container mt-4">
  <div className="d-flex align-items-center justify-content-between mb-4">
    <h4 className="fw-bold text-dark mb-0">
      <i className="fas fa-users me-2 text-primary"></i>
      All Users
    </h4>
    <span className="badge bg-primary rounded-pill px-3 py-2">
      {otherCompanies.length} Companies
    </span>
  </div>

  {loading ? (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">Loading companies...</p>
    </div>
  ) : otherCompanies.length === 0 ? (
    <div className="text-center py-5">
      <div className="mb-3">
        <i className="fas fa-users text-muted" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
      </div>
      <h5 className="text-muted">No Companies Found</h5>
      <p className="text-muted">No other companies are available at the moment.</p>
    </div>
  ) : (
    <div className="row g-4">
      {otherCompanies.map((comp) => (
        <div className="col-lg-4 col-md-6" key={comp._id}>
          <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden company-card">
            <div className="card-body p-4">
              {/* Header */}
              <div className="d-flex align-items-center mb-3">
                <div className="position-relative">
                  <img
                    src={`${BaseUrl}/${comp.profileImage}`}
                    alt="Profile"
                    className="rounded-circle border border-2 border-light shadow-sm"
                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                  />
                  <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1">
                    <i className="fas fa-check text-white" style={{ fontSize: '8px' }}></i>
                  </div>
                </div>
                <div className="ms-3 flex-grow-1">
                  <h6 className="fw-bold mb-1">{comp.prefix} {comp.name}</h6>
                  <small className="text-muted">{comp.email}</small>
                </div>
              </div>

              {/* Company Info */}
              <div className="row g-2 mb-3">
                <div className="col-12">
                  <div className="d-flex align-items-center p-2 bg-light rounded-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                      <i className="fas fa-building text-primary" style={{ fontSize: '12px' }}></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Company</small>
                      <span className="fw-semibold small">{comp.company}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="d-flex align-items-center p-2 bg-light rounded-3">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                      <i className="fas fa-map-marker-alt text-success" style={{ fontSize: '12px' }}></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Location</small>
                      <span className="fw-semibold small">{comp.city}, {comp.state}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="d-flex align-items-center p-2 bg-light rounded-3">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-2">
                      <i className="fas fa-tags text-warning" style={{ fontSize: '12px' }}></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Category</small>
                      <span className="fw-semibold small">{comp.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button className="btn btn-primary btn-sm rounded-pill flex-fill">
                  <i className="fas fa-eye me-1"></i>
                  Book Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  <style jsx>{`
    .company-card {
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .company-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
    }
  `}</style>
</div>
    </div>
  );
};

export default Visitors;
