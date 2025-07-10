import React from 'react';
import { FaBars, FaBuilding, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import Swal from 'sweetalert2';
import "../../style/SuperAdminSidebar.css"
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar, currentPage, setCurrentPage, isMobile }) => {
  const navigate = useNavigate();

  const handleItemClick = (name) => {
    if (name === 'Logout') {
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
    } else {
      setCurrentPage(name);
      if (isMobile) toggleSidebar();
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt /> },
    { name: 'Users', icon: <FaBuilding /> },
    { name: 'Account Setting', icon: <IoMdSettings /> },
    { name: 'Logout', icon: <FaSignOutAlt /> },
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 998, backdropFilter: 'blur(2px)', }} onClick={toggleSidebar} />
      )}

      <div className="top-0 start-0 text-white shadow-lg" style={{ minHeight: '100vh', width: isOpen ? (isMobile ? '280px' : '240px') : (isMobile ? '0' : '80px'), zIndex: 999, transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', position: isMobile ? 'fixed' : 'relative', transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', borderRight: '1px solid rgba(255, 255, 255, 0.1)', }}>
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom"
          style={{ cursor: 'pointer', borderColor: 'rgba(255, 255, 255, 0.1) !important', minHeight: '72px', }}>
          {isOpen && (
            <div className="d-flex align-items-center">
              <div>
                <h5 className="mb-0 fw-bold text-truncate" style={{ fontSize: '16px' }}> SuperAdmin</h5>
                <small style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}> Admin Panel</small>
              </div>
            </div>
          )}

          <button className={`btn text-white p-2 rounded ${!isOpen ? 'mx-auto' : ''}`} onClick={toggleSidebar}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none', transition: 'all 0.2s ease', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';}}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';}}
          >
            <FaBars size={16} />
          </button>
        </div>

        <div className="p-3">
          {sidebarItems.map((item, index) => (
            <div key={item.name} onClick={() => handleItemClick(item.name)}
              className={`mb-2 d-flex align-items-center p-3 rounded position-relative ${ currentPage === item.name ? 'active-item' : 'nav-item' }`}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: currentPage === item.name ? '#4a90e2' : 'transparent',
                border: currentPage === item.name ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                ...(currentPage === item.name && {
                  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)',
                }),
              }}
              onMouseEnter={(e) => { if (currentPage !== item.name) { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}}
              onMouseLeave={(e) => { if (currentPage !== item.name) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}}
            >
              {currentPage === item.name && (
                <div className="position-absolute start-0 top-50 translate-middle-y rounded-end" style={{ width: '3px', height: '60%', backgroundColor: '#ffffff', left: '-1px', }} /> )}

              <span className={`${!isOpen ? 'mx-auto' : ''}`} style={{ fontSize: '18px', color: currentPage === item.name ? '#ffffff' : 'rgba(255, 255, 255, 0.8)', minWidth: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                {item.icon}
              </span>

              {isOpen && (
                <span className="ms-3" style={{ color: currentPage === item.name ? '#ffffff' : 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: currentPage === item.name ? '600' : '400', letterSpacing: '0.3px', }}>
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {isOpen && (
          <div className="position-absolute bottom-0 start-0 end-0 p-3 text-center border-top"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1) !important', backgroundColor: 'rgba(0, 0, 0, 0.1)', }}>
            <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}> Version 1.0.0</small>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;