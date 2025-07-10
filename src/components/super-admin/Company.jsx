import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl, FrontendUrl } from "../service/Uri";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../../style/SuperAdminCompany.css';

const Company = ({isOpen}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', logo: null, email: '', password: '', isActive: true });
  const [errorMsg, setErrorMsg] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [updateData, setUpdateData] = useState({ name: '', logo: null, email: '', password: '', isActive: true });
  const [updateErrorMsg, setUpdateErrorMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    fetchCompanies();
  }, []);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 992);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

const fetchCompanies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${BaseUrl}/company/getall`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCompanies(res.data.data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
};

const handleFormChange = (e) => {
  const { name, value, type, checked, files } = e.target;
  if (name === 'mobile') {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setFormData({ ...formData, [name]: numericValue });
    }
    return;
  }

  if (type === 'checkbox') {
    setFormData({ ...formData, [name]: checked });
  } else if (type === 'file') {
    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (file && allowedTypes.includes(file.type)) {
      setFormData({ ...formData, logo: file });
    } else {
      alert('Only JPG, JPEG, or PNG files are allowed.');
    }
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
      const response = await axios.post(`${BaseUrl}/company/create`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data && response.data.data) {
      setErrorMsg('')
      fetchCompanies();
      setShowAddModal(false)
      setFormData({ name: '', logo: null, email: '', password: '',mobile:'',pname:'',address:'' , isActive: true });
    } else {
      setErrorMsg(response.data.message || 'Failed to create company.');
    }
    } catch (error) {
      console.error('Error adding company:', error);
    }
};

const handleDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this company?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    customClass: {
      confirmButton: 'btn btn-danger me-2',
      cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${BaseUrl}/company/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}`}
        });
        Swal.fire({
                    title: 'Deleted!',
                    text: 'Company has been deleted.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                  })
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        Swal.fire('Error', 'Something went wrong!', 'error');
      }
    }
  });
};

const handleToggleStatus = async (companyId) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await axios.patch(`${BaseUrl}/company/status/${companyId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

      fetchCompanies(); // Refresh list
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false
      });
  } catch (error) {
    console.error("Error updating status:", error);
    Swal.fire({
      icon: 'error',
      title: 'Failed',
      text: 'Unable to update company status'
    });
  }
};

const handleUpdateClick = (company) => {
  setUpdateErrorMsg('');
  setCurrentCompany(company);
  setUpdateData({
    name: company.name,
    logo: null,
    email: company.email,
    mobile: company.mobile,
    pname: company.pname,
    address: company.address,
    password: company.password,
    isActive: company.isActive,
  });
  setShowUpdateModal(true);
};
const handleUpdateChange = (e) => {
  const { name, value, type, checked, files } = e.target;
  if (name === 'mobile') {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setUpdateData({ ...updateData, [name]: numericValue });
    }
    return;
  }
  if (type === 'checkbox') {
    setUpdateData({ ...updateData, [name]: checked });
  } else if (type === 'file') {
  const file = files[0];
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUpdateErrorMsg('Only JPG, JPEG, and PNG formats are allowed.');
      return;
    }
  }
  setUpdateData({ ...updateData, logo: file });
  } else {
    setUpdateData({ ...updateData, [name]: value });
  }
};
const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  if (!currentCompany) return;
  try {
    const token = localStorage.getItem('adminToken');
    const form = new FormData();
    for (const key in updateData) {
      if (updateData[key] !== null) {
        form.append(key, updateData[key]);
      }
    }
    const res = await axios.put(`${BaseUrl}/company/update/${currentCompany._id}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res.data && res.data.data) {
      fetchCompanies();
      setShowUpdateModal(false);
      setCurrentCompany(null);
      setUpdateErrorMsg('');
    }else {
      setUpdateErrorMsg(res.data.message || 'Update failed.');
    }
  } catch (err) {
    console.error("Update Error:", err);
  }
};

const generateCompanyUrl = (name) => {
  return `${FrontendUrl}/${name.toLowerCase().replace(/\s+/g, '-')}`;
};

  const filteredCompanies = companies.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch ;
  });

  return (
    <>
    <div>
      <div className="d-flex justify-content-end align-items-center mb-3">
        {/* <button className="btn btn-primary" onClick={() => setShowAddModal(true)}> + Add Company</button> */}
      </div>

      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div>
          <input type="text" className="form-control" placeholder="Search Users..." value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className=" sa_company"  style={{ maxWidth: isMobile ? 'calc(100vw - 32px)' : isOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)', overflowX: 'scroll',}}>
          <table className="table mb-0 table-hover align-middle shadow-lg border-0 rounded-4 overflow-scroll modern-table">
            <thead>
              <tr className="table-header">
                <th scope="col" className="border-0 py-4 px-xxl-2" style={{minWidth:"90px"}}>
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="fw-bold text-dark">Logo</span>
                  </div>
                </th>
                <th scope="col" className="border-0 py-4 px-xxl-2" style={{minWidth:"150px"}}>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold text-dark">Company</span>
                  </div>
                </th>
                <th scope="col" className="border-0 py-4 px-xxl-2" style={{minWidth:"150px"}}>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold text-dark">Name</span>
                  </div>
                </th>
                <th scope="col" className="border-0 py-4 px-xxl-2" style={{minWidth:"160px"}}>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold text-dark">Email</span>
                  </div>
                </th>
                <th scope="col" className="border-0 py-4 px-xxl-2" style={{minWidth:"160px"}}>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold text-dark">Category</span>
                  </div>
                </th>
                <th scope="col" className="border-0 py-4 px-xxl-2" style={{minWidth:"100px"}}>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold text-dark">URL</span>
                  </div>
                </th>
                <th scope="col" className="border-0 py-4 px-xxl-2" style={{minWidth:"100px"}}>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold text-dark">Status</span>
                  </div>
                </th>
                <th scope="col" className="text-center border-0 py-4 px-xxl-2" style={{width:"180px"}}>
                  <span className="fw-bold text-dark">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((c, index) => (
                  <tr key={c._id} className="table-row" style={{ animationDelay: `${index * 0.1}s`,}}>
                    <td className="border-0 py-4 px-xxl-2">
                      <div className="logo-container">
                        <img src={`${BaseUrl}/${c.profileImage}`} alt={c.name} className="company-logo"
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #f8f9fa', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease',}}
                          onMouseEnter={(e) => { e.target.style.transform = 'scale(1.1)'; e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';}}
                          onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';}}
                        />
                      </div>
                    </td>
                    <td className="border-0 py-4 px-xxl-2">
                      <div className="company-name">
                        <span className="fw-semibold text-dark" style={{ fontSize: '15px', letterSpacing: '0.3px',}}> {c.company}</span>
                      </div>
                    </td>
                    <td className="border-0 py-4 px-xxl-2">
                      <div className="company-name">
                        <span className="fw-semibold text-dark" style={{ fontSize: '15px', letterSpacing: '0.3px',}}> {c.name}</span>
                      </div>
                    </td>
                    <td className="border-0 py-4 px-xxl-2">
                      <div className="email-container">
                        <span className="text-muted" style={{ fontSize: '14px', wordBreak: 'break-word',}}> {c.email}</span>
                      </div>
                    </td>
                    <td className="border-0 py-4 px-xxl-2">
                      <div className="email-container">
                        <span className="text-muted" style={{ fontSize: '14px', wordBreak: 'break-word',}}> {c.category}</span>
                      </div>
                    </td>
                   
                    <td className="border-0 py-4 px-xxl-2">
                      <div className="url-container d-flex align-items-center gap-2">
                        {copiedId === c._id ? (
                          <span style={{ fontSize: '13px', color: 'green', fontWeight: '600', backgroundColor: '#e6ffed', padding: '4px 10px', borderRadius: '8px', transition: 'opacity 0.3s ease',}}> Copied!</span>
                        ) : (
                          <span className="text-primary" style={{ fontSize: '13px', cursor: 'pointer' }}
                            onClick={() => { const companyUrl = generateCompanyUrl(c.name); navigator.clipboard.writeText(companyUrl);
                              setCopiedId(c._id); setTimeout(() => setCopiedId(null), 1000);}}> 🔗 Copy URL</span>
                        )}
                      </div>
                    </td>
                    <td className="border-0 py-4 px-xxl-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${c.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          className={`btn btn-sm ${c.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px' }}
                          onClick={() => handleToggleStatus(c._id)}
                        >
                          {c.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>

                    <td className="text-end border-0 py-4 px-xxl-2">
                      <div className="action-buttons d-flex justify-content-end gap-2">
                        {/* <button className="btn btn-sm action-btn update-btn" onClick={() => handleUpdateClick(c)}
                          style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s ease', textTransform: 'capitalize',}}
                          onMouseEnter={(e) => { e.target.style.backgroundColor = '#ffc107'; e.target.style.color = '#ffffff'; e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 8px rgba(255, 193, 7, 0.3)';}}
                          onMouseLeave={(e) => { e.target.style.backgroundColor = '#fff3cd'; e.target.style.color = '#856404'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none';}}
                        > Edit</button> */}
                        <button className="btn btn-sm action-btn delete-btn" onClick={() => handleDelete(c._id)}
                          style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s ease', textTransform: 'capitalize',}}
                          onMouseEnter={(e) => { e.target.style.backgroundColor = '#dc3545'; e.target.style.color = '#ffffff'; e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.3)';}}
                          onMouseLeave={(e) => { e.target.style.backgroundColor = '#f8d7da'; e.target.style.color = '#721c24'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                        > Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-5 border-0">
                    <div className="no-data-container" style={{ padding: '40px 20px', color: '#6c757d', backgroundColor: '#f8f9fa', borderRadius: '12px', margin: '20px', }} >
                      <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📊</div>
                      <h5 style={{ marginBottom: '8px', color: '#495057' }}>No users found</h5>
                      <p style={{ margin: 0, fontSize: '14px' }}>Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

{showUpdateModal && (
  <div className="modal show d-block company_model" tabIndex="-1" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog modal-dialog-centered">
      <form className="modal-content shadow rounded-4 overflow-hidden" onSubmit={handleUpdateSubmit}>
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title fw-semibold">Edit Company</h5>
          <button type="button" className="btn-close btn-close-white" onClick={() => setShowUpdateModal(false)}></button>
        </div>
        <div className="modal-body px-4 py-3">
          <div className="mb-3">
            <label className="form-label fw-semibold">Company Name</label>
            <input type="text" className="form-control" name="name" value={updateData.name} onChange={handleUpdateChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" name="email" value={updateData.email} onChange={handleUpdateChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Mobile Number</label>
            <input type="text" className="form-control" name="mobile" value={updateData.mobile} onChange={handleUpdateChange} maxLength="10" pattern="^[0-9]{10}$" title="Mobile number must be exactly 10 digits" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Contact Person Name</label>
            <input type="text" className="form-control" name="pname" value={updateData.pname} onChange={handleUpdateChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <input type="text" className="form-control" name="address" value={updateData.address} onChange={handleUpdateChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="text" className="form-control" name="password" value={updateData.password} onChange={handleUpdateChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Logo (optional) (JPG, JPEG, PNG) </label>
            <input type="file" className="form-control" name="logo" accept=".jpg,.jpeg,.png" onChange={handleUpdateChange} />
            {currentCompany?.logo && (
              <div className="mt-2">
                <img src={`${BaseUrl}/${currentCompany.logo}`} alt="Current Logo" style={{ width: '60px', borderRadius: '6px' }} />
              </div>
            )}
          </div>
          <div className="form-check form-switch mb-2">
            <input className="form-check-input" type="checkbox" name="isActive" checked={updateData.isActive} onChange={handleUpdateChange} />
            <label className="form-check-label">Active</label>
          </div>
        </div>
        {updateErrorMsg && <div className="alert alert-danger mx-4">{updateErrorMsg}</div>}
        <div className="modal-footer px-4 py-3">
          <button type="button" className="btn btn-outline-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
          <button type="submit" className="btn btn-primary">Update</button>
        </div>
      </form>
    </div>
  </div>
)}

{showAddModal && (
  <div className="modal show d-block fade" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content border-0 shadow-lg rounded-4">
        <div className="modal-header bg-primary text-white rounded-top-4 px-4 py-3">
          <h5 className="modal-title fw-bold">Add Company</h5>
          <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Company Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleFormChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleFormChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Mobile Number</label>
                <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleFormChange} pattern="^[0-9]{10}$" maxLength="10" required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Contact Person Name</label>
                <input type="text" className="form-control" name="pname" value={formData.pname} onChange={handleFormChange} required />
              </div>
              <div className="col-md-12">
                <label className="form-label fw-semibold">Address</label>
                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleFormChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Password</label>
                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleFormChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Logo (JPG, JPEG, PNG)</label>
                <input type="file" accept=".jpg,.jpeg,.png" className="form-control" name="logo" onChange={handleFormChange} />
              </div>
              <div className="col-md-12">
                <div className="form-check form-switch mt-2">
                  <input className="form-check-input" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} />
                  <label className="form-check-label">Active</label>
                </div>
              </div>
            </div>
            {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
          </div>
          <div className="modal-footer p-3 bg-light rounded-bottom-4">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
            <button type="submit" className="btn btn-primary">Save Company</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    </div>
    </>
  );
};

export default Company;
