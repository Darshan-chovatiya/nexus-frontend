import { useEffect } from 'react';
import { FaBars, FaUserFriends, FaTachometerAlt, FaSignOutAlt, FaUserTie} from 'react-icons/fa';
import { GiPoliceOfficerHead } from "react-icons/gi";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IoMdSettings } from "react-icons/io";

// Sidebar Component with Modern Design
const Sidebar = ({ isOpen, toggleSidebar, currentPage, setCurrentPage }) => {
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
      confirmButtonText: 'Yes, logout!',
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('companyToken');
        localStorage.removeItem('company');
        localStorage.removeItem('currentPage');
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/');
        });
      }
    });
  } else {
    setCurrentPage(name);
  }
};
const sidebarItems = [
  { name: 'Dashboard', icon: <FaTachometerAlt /> },
  { name: 'Users', icon: <FaUserFriends /> },
  { name: 'Account Setting', icon: <IoMdSettings /> },
  { name: 'Logout', icon: <FaSignOutAlt /> },
];

const CompanyInfo = JSON.parse(localStorage.getItem('company'));
const isMobile = window.innerWidth < 992;
const sidebarStyle = { minHeight: '100vh', maxWidth: isOpen ? (isMobile ? '260px' : '280px') : (isMobile ? '0' : '70px'), minWidth: isOpen ? (isMobile ? '260px' : '280px') : (isMobile ? '0' : '70px'), transition: 'all 0.3s ease-in-out', background: 'linear-gradient(rgb(26, 26, 46) 0%, rgb(22, 33, 62) 50%, rgb(15, 52, 96) 100%)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', position: isMobile ? 'fixed' : 'relative', zIndex: 999, top: 0, left: 0, overflowX: 'hidden',};

useEffect(() => {
  const handleOutsideClick = (e) => {
    if (isMobile && isOpen && !e.target.closest('.sidebar-container')) {
      toggleSidebar();
    }
  };
  document.addEventListener('click', handleOutsideClick);
  return () => document.removeEventListener('click', handleOutsideClick);
}, [isMobile, isOpen]);

  const overlayStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', zIndex: 1};

  return (
    <div className="sidebar-container d-flex flex-column text-white p-lg-2" style={sidebarStyle}>
      <div style={overlayStyle}></div>
      <div className='m-2 m-lg-0' style={{ position: 'relative', zIndex: 2 }}>
        <div className="mb-4 d-flex align-items-center justify-content-between p-2 rounded" 
          onClick={toggleSidebar} 
          style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease'}}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        >
          {isOpen && <h6 className="mb-0 fw-bold text-truncate" style={{ fontSize: '14px' }}>{CompanyInfo.name}</h6>}
          {isOpen && <FaBars size={18} />}
          {!isOpen && <FaBars size={18} className='mx-auto' />}
        </div>

        {sidebarItems.map((item) => (
          <div key={item.name} onClick={() => { handleItemClick(item.name); if (window.innerWidth < 992) toggleSidebar(); }}
            className={`mb-2 d-flex align-items-center p-3 rounded ${currentPage === item.name ? 'bg-white text-primary shadow-sm' : ''}`}
            style={{ cursor: 'pointer', transition: 'all 0.3s ease', background: currentPage === item.name ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
            onMouseEnter={(e) => { if (currentPage !== item.name) { e.target.style.background = 'rgba(255,255,255,0.2)';} }}
            onMouseLeave={(e) => { if (currentPage !== item.name) { e.target.style.background = 'rgba(255,255,255,0.1)';}}}
          >
            <span style={{ fontSize: '18px', minWidth: '20px' }}>{item.icon}</span>
            {isOpen && <span className="ms-3 fw-medium">{item.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
