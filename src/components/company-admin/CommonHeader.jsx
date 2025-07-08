import React from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BaseUrl } from "../service/Uri";

const CommonHeader = ({ title, company, toggleSidebar, setCurrentPage }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
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
        })
        .then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 shadow-sm bg-white sticky-top" style={{ zIndex: 99 }}>
      <div className="d-flex align-items-center gap-3">
        <FaBars size={22} className="cursor-pointer d-lg-none" onClick={(e) => {e.stopPropagation();toggleSidebar();}}/>
        <h4 className="mb-0 fw-bold text-primary">{title}</h4>
      </div>
      <div className="dropdown">
        <div className="d-flex align-items-center gap-2 cursor-pointer" role="button" data-bs-toggle="dropdown">
          <img src={`${BaseUrl}/${company.profileImage}`} alt="logo" className="rounded-circle border" style={{ width: "40px", height: "40px", objectFit: "cover" }}/>
          <span className="fw-bold d-none d-sm-block">{company.name}</span>
        </div>
        <ul className="dropdown-menu dropdown-menu-end mt-2 shadow-sm">
          <li>
            <button className="dropdown-item" onClick={() => setCurrentPage("Account Setting")}>Account Setting</button>
          </li>
          <li>
            <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default CommonHeader;
