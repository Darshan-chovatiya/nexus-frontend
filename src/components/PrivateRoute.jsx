import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from './service/Uri';

export const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return setIsValid(false);

      try {
        const res = await axios.get(`${BaseUrl}/super-admin/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status === 200) {
          localStorage.setItem('admin', JSON.stringify(res.data.data));
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (err) {
        setIsValid(false);
      }
    };
    verifyToken();
  }, []);

  if (isValid === null) return <div>Loading...</div>;
  return isValid ? children : <Navigate to="/admin/login" />;
};

export const CompanyPrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('companyToken');
      if (!token) return setIsValid(false);

      try {
        const res = await axios.get(`${BaseUrl}/company/verify-company`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status === 200) {
          setIsValid(true);
          localStorage.setItem('company', JSON.stringify(res.data.data));
        } else {
          setIsValid(false);
        }
      } catch (err) {
        setIsValid(false);
      }
    };
    verifyToken();
  }, []);

  if (isValid === null) return <div>Loading...</div>;
  return isValid ? children : <Navigate to="/" />;
};
