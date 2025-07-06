import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {FaEnvelope,FaLock,FaEye,FaEyeSlash,FaSignInAlt,FaBuilding,FaExclamationTriangle} from 'react-icons/fa';
import { BaseUrl } from "../service/Uri";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/CompanyLogin.css';

const CompanyLogin = () => {
  const { companyName } = useParams(); 
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/company/slug-info/${companyName}`);
        setCompanyInfo(res.data.data);
      } catch (err) {
        console.error("Error fetching company info:", err);
      }
    };
    fetchCompanyInfo();
  }, [companyName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await axios.post(`${BaseUrl}/company/login`, {email: emailId,password: password});
      const result = response.data;
      if (result.data) {
        localStorage.setItem('companyToken', result.data.token);
        localStorage.setItem('company', JSON.stringify(result.data.company));
        setErrorMsg('');
        navigate('/company');
      } else {
        setErrorMsg(result.message || 'Login failed');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center p-4">
      <div className="login-overlay"></div>
      <div className="float-blob blob1"></div>
      <div className="float-blob blob2"></div>
      <div className="login-card position-relative">
        <div className="login-header text-white text-center py-4 px-4">
          <div className="mb-3">
            {companyInfo?.profileImage ? (
              <img src={`${BaseUrl}/${companyInfo.profileImage}`} alt="Logo" className="company-logo" style={{ height: 60,width:60,borderRadius:"50%" }} />
            ) : (
              <div className="header-icon">
                <FaBuilding size={28} className="text-white" />
              </div>
            )}
          </div>
          <h3 className="mb-1 fw-bold">{companyInfo?.name ? companyInfo.name : 'Company Portal'}</h3>
          <p className="mb-0 opacity-75">Sign in to access your dashboard</p>
          <div className="header-wave"></div>
        </div>

        <div className="p-5 company_form">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark mb-2">Email Address</label>
              <div className="custom-input-group input-group">
                <span className="input-group-text text-primary px-3"><FaEnvelope size={18} /></span>
                <input type="email" className="form-control bg-transparent" placeholder="Enter your email address" value={emailId} onChange={(e) => setEmailId(e.target.value)} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-dark mb-2">Password</label>
              <div className="custom-input-group input-group">
                <span className="input-group-text text-primary px-3"><FaLock size={18} /></span>
                <input type={showPassword ? 'text' : 'password'} className="form-control bg-transparent" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className="btn bg-transparent border-0 text-muted px-3" type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="error-alert alert d-flex align-items-center">
                <FaExclamationTriangle className="me-2" size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="d-grid">
              <button type="submit" className="login-btn btn btn-lg text-white fw-semibold py-3" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="me-2" />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">Secure company authentication portal</p>
              <p className="mt-2">
      Don't have an account?{" "}
      <a href="/signup" className="text-primary fw-bold">Sign up</a>
    </p>
          </div>
        </div>

        <div className="decorative-circle top-right"></div>
        <div className="decorative-circle bottom-left"></div>
      </div>
    </div>
  );
};

export default CompanyLogin;
