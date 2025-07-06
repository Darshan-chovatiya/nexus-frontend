import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Company from './Company';
import ProfileSetting from './ProfileSetting';
import AdminHeader from './AdminHeader';

const AdminPanel = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 991);
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('adminCurrentPage') || 'Dashboard');

  useEffect(() => {
    localStorage.setItem('adminCurrentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 991;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Company':
        return <Company isOpen={isSidebarOpen}/>;
      case 'Account Setting':
        return <ProfileSetting />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="d-flex" style={{ background: '#f8f9fb', minHeight: '100vh', position: 'relative' }}>
      {(isSidebarOpen || !isMobile) && (
        <>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} currentPage={currentPage} setCurrentPage={setCurrentPage} isMobile={isMobile}/>
          {isMobile && (
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 998 }} onClick={toggleSidebar} />
          )}
        </>
      )}

      <div className="flex-grow-1" style={{ zIndex: 0 }}>
        <AdminHeader title={currentPage} toggleSidebar={toggleSidebar} isMobile={isMobile} setCurrentPage={setCurrentPage} />
        <div className="p-3"> {renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
