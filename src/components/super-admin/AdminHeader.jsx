import React, { useState } from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminHeader = ({ title, toggleSidebar, isMobile ,setCurrentPage}) => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        localStorage.removeItem('adminCurrentPage');
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/admin/login');
        });
      }
    });
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 shadow-sm bg-white p-3 sticky-top" style={{ zIndex: 1050 }}>
      <div className="d-flex align-items-center">
        {isMobile && <FaBars size={22} onClick={toggleSidebar} className="me-3" style={{ cursor: 'pointer' }} />}
        <h3 className="mb-0">{title}</h3>
      </div>
      <div className="position-relative">
        <div className="d-flex align-items-center" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
          <FaUserCircle size={38} className="me-2" />
          <div className='d-none d-sm-block'>
            <h5 className="mb-0 fw-bold text-truncate" style={{ fontSize: '16px' }}> Super Admin</h5>
            <small style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '12px' }}>{admin?.emailId} </small>
          </div>
        </div>
        {dropdownOpen && (
          <div className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm" style={{ zIndex: 1000,width:"150px" }}>
            <div className="px-3 py-2 border-bottom" style={{ cursor: 'pointer' }} onClick={() => { setDropdownOpen(false); setCurrentPage('Account Setting');}}>
              Account Setting
            </div>
            <div className="px-3 py-2" style={{ cursor: 'pointer' }} onClick={handleLogout}> Logout</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
