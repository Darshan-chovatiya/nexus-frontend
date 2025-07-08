import React, { useState, useRef, useEffect } from 'react';
import CompanyQR from './CompanyQR';
import axios from 'axios';
import CommonHeader from './CommonHeader';
import { BaseUrl } from '../service/Uri';
import { BrowserQRCodeReader } from '@zxing/browser';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import SwiperCore from 'swiper';
import { Autoplay } from 'swiper/modules';

SwiperCore.use([Autoplay]);


const CompanyDashboard = ({ setCurrentPage, toggleSidebar }) => {
  const company = JSON.parse(localStorage.getItem('company'));
  const [scanQr, setScanQr] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [banners, setBanners] = useState([]);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    // Clean up when component unmounts
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }
    };
  }, []);

const startScanner = async () => {
  try {
    setScanQr(true);
    setScanResult('');

    const codeReader = new BrowserQRCodeReader();
    codeReaderRef.current = codeReader;

    const devices = await BrowserQRCodeReader.listVideoInputDevices();

    if (devices.length === 0) {
      alert("No camera found.");
      setScanQr(false);
      return;
    }

    // ✅ Always pick back camera (usually the last one)
    const backCamera = devices.find((device) =>
      device.label.toLowerCase().includes('back')
    ) || devices[devices.length - 1];

    const selectedDeviceId = backCamera.deviceId;

    await codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      videoRef.current,
      (result, error) => {
        if (result) {
          setScanResult(result.getText());
          stopScanner(); // auto stop after successful scan
        }
        if (error) {
          // Optional: console.warn('QR Scan Error:', error);
        }
      }
    );
  } catch (err) {
    console.error("Scanner Error:", err);
    alert("Could not start scanner. Please check camera permissions.");
    setScanQr(false);
  }
};



const stopScanner = () => {
  if (codeReaderRef.current) {
    codeReaderRef.current.reset();
    codeReaderRef.current = null;
  }

  // 🔥 Properly stop camera stream
  if (videoRef.current?.srcObject) {
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
  }

  setScanQr(false);
};


const handleScanResult = async (result) => {
  const scanId = result?.split('/').pop();
   console.log("Raw Scanned Result:", scanId);


  if (!scanId || scanId.length !== 24) {
    alert("Invalid QR code format.");
    return;
  }

  const scannerId = JSON.parse(localStorage.getItem("company"))?._id;

  try {
    const res = await axios.post(`${BaseUrl}/scan/${scanId}`, { scannerId });
  window.location.href = result;

  } catch (err) {
    console.error("Scan error:", err.response?.data || err.message);
    alert("Something went wrong while saving scan.");
  } 
};  

  useEffect(() => {
    if (scanResult) {
      handleScanResult(scanResult);
    }
  }, [scanResult]);


useEffect(() => {
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/banner/banners`);
      setBanners(res.data);
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    }
  };

  fetchBanners();
}, []);

  return (
    <div className="container-fluid p-0">
      <CommonHeader title="Dashboard" company={company} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} />

      <div>
        {banners.length > 0 && (
  <div className="container mt-3">
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 3000 }}
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner._id}>
          <img
            src={`${BaseUrl}${banner.imageUrl}`}
            alt="Banner"
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '10px'
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
)}

      </div>

      <div className="row g-4 mt-3">
        {/* Left column - Company Info */}
        <div className="col-md-6">
          <div className="card shadow-sm py-3 px-4">
            <div className="d-flex align-items-center">
              <img
                src={`${BaseUrl}/${company?.profileImage}`}
                alt="Profile"
                className="rounded-circle me-3"
                style={{ width: 70, height: 70, objectFit: 'cover' }}
              />
              <div>
                <h5 className="mb-0">{company?.prefix} {company?.name}</h5>
                <small className="text-muted">{company?.email}</small>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-6 mb-2"><strong>Company:</strong></div>
              <div className="col-6 mb-2">{company?.company}</div>

              <div className="col-6 mb-2"><strong>State:</strong></div>
              <div className="col-6 mb-2">{company?.state}</div>

              <div className="col-6 mb-2"><strong>City:</strong></div>
              <div className="col-6 mb-2">{company?.city}</div>

              <div className="col-6 mb-2"><strong>Category:</strong></div>
              <div className="col-6 mb-2">{company?.category}</div>

              <div className="col-6 mb-2"><strong>Role:</strong></div>
              <div className="col-6 mb-2">{company?.role}</div>
            </div>

            <hr />

            <div>
              <strong>About Business:</strong>
              <p className="text-muted">{company?.aboutBusiness}</p>

              <strong>About Product:</strong>
              <p className="text-muted mb-0">{company?.aboutProduct}</p>
            </div>
          </div>
        </div>

        {/* Right column - QR */}
        <div className="col-md-6">
          <CompanyQR companyId={company?._id} />
          
          {/* QR Scanner Section */}
          <div className="card shadow-sm py-3 px-4 mt-4">
            {!scanQr ? (
              <button 
                onClick={startScanner}
                className="btn btn-primary"
              >
                Scan QR Code
              </button>
            ) : (
              <>
                <button 
                  onClick={stopScanner}
                  className="btn btn-danger mb-3"
                >
                  Stop Scanner
                </button>
                
                <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                  <video
  ref={videoRef}
  playsInline
  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
/>

                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%',
                    height: '70%',
                    border: '4px solid rgba(0, 255, 0, 0.5)',
                    borderRadius: '8px',
                    pointerEvents: 'none'
                  }}></div>
                </div>
                
                <p className="mt-2 text-center">Scan a QR code to connect with another company</p>
              </>
            )}
            
            {scanResult && (
              <div className="alert alert-success mt-3">
                Scanned successfully! ID: {scanResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;