import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BaseUrl } from "../service/Uri";

const Login = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await axios.post(`${BaseUrl}/super-admin/signin`, {emailId,password});      
      const result = res.data;
      
      if(result.data){
        localStorage.setItem('adminToken', result.data.token);
        localStorage.setItem('admin',JSON.stringify(result.data.user))
        setErrorMsg('')
        navigate('/super-admin');
      }else{
        setErrorMsg(result.message)
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card shadow-lg animated fadeInDown">
        <div className="card-header text-white text-center py-3 gradient-header">
          <h3 className="mb-0">🔐 Admin Login</h3>
        </div>
        <div className="card-body p-4">
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="input-group login-input-group">
                <span className="input-group-text bg-white text-primary">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="input-group login-input-group">
                <span className="input-group-text bg-white text-primary">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="btn toggle-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg glow-on-hover">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
