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
import Swal from 'sweetalert2';

SwiperCore.use([Autoplay]);

const CompanyDashboard = ({ setCurrentPage, toggleSidebar }) => {
  const company = JSON.parse(localStorage.getItem('company'));
  const [scanQr, setScanQr] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [banners, setBanners] = useState([]);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [myBookings, setMyBookings] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [scannedBy, setScannedBy] = useState([]);
  const [scannedByMe, setScannedByMe] = useState([]);
  const [activeTab, setActiveTab] = useState('booked');

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("companyToken");
      const [bookedRes, sentRes, receivedRes, scannerRes, scanRes] = await Promise.all([
        axios.get(`${BaseUrl}/slot/pair-slot/booked`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BaseUrl}/slot/pair-slot/pending-sent`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BaseUrl}/slot/pair-slot/pending-received`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BaseUrl}/scan/scanner`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BaseUrl}/scan/myscan`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setMyBookings(bookedRes.data);
      setPendingSent(sentRes.data);
      setPendingReceived(receivedRes.data);
      setScannedBy(scannerRes.data.data);
      setScannedByMe(scanRes.data.data);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleApprove = async (slotId) => {
    try {
      const token = localStorage.getItem("companyToken");
      await axios.patch(`${BaseUrl}/slot/pair-slots/approve/${slotId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Slot Approved',
        text: 'The slot has been successfully approved!',
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
      fetchMyBookings();
    } catch (err) {
      console.error("Error approving slot:", err.response?.data || err.message);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Approval Failed',
        text: err.response?.data?.error || 'Failed to approve slot.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    }
  };

  const handleCancel = async (slotId) => {
    try {
      const token = localStorage.getItem("companyToken");
      await axios.delete(`${BaseUrl}/slot/pair-slots/cancel/${slotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Slot Cancelled',
        text: 'The slot has been successfully cancelled!',
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
      fetchMyBookings();
    } catch (err) {
      console.error("Error cancelling slot:", err.response?.data || err.message);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Cancellation Failed',
        text: err.response?.data?.error || 'Failed to cancel slot.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    }
  };

  useEffect(() => {
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
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'No Camera Found',
          text: 'No camera found. Please ensure a camera is connected.',
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
        setScanQr(false);
        return;
      }
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
            stopScanner();
          }
        }
      );
    } catch (err) {
      console.error("Scanner Error:", err);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Scanner Error',
        text: 'Could not start scanner. Please check camera permissions.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
      setScanQr(false);
    }
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanQr(false);
  };

  const handleScanResult = async (result) => {
    const scanId = result?.split('/').pop();
    if (!scanId || scanId.length !== 24) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Invalid QR Code',
        text: 'Invalid QR code format.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
      return;
    }
    const scannerId = JSON.parse(localStorage.getItem("company"))?._id;
    try {
      const res = await axios.post(`${BaseUrl}/scan/${scanId}`, { scannerId });
      window.location.href = result;
      fetchMyBookings(); // Refresh scan data after successful scan
    } catch (err) {
      console.error("Scan error:", err.response?.data || err.message);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Scan Failed',
        text: err.response?.data?.error || 'Something went wrong while saving scan.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
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
                      borderRadius: '10px' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <div className="row g-4 mt-3">
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
              <div className="col-6 mb-2"><strong>Mobile No.:</strong></div>
              <div className="col-6 mb-2">{company?.mobile}</div>
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

        <div className="col-md-6">
          <CompanyQR companyId={company?._id} />
          
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

        <div className="col-12">
          <div className="card shadow-sm py-3 px-4 mt-4">
            <h5 className="mb-3">📅 Slot Management</h5>
            
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'booked' ? 'active' : ''}`}
                  onClick={() => setActiveTab('booked')}
                >
                  Booked Slots
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'sent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sent')}
                >
                  Sent Requests
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'received' ? 'active' : ''}`}
                  onClick={() => setActiveTab('received')}
                >
                  Received Requests
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'scans' ? 'active' : ''}`}
                  onClick={() => setActiveTab('scans')}
                >
                  Scan History
                </button>
              </li>
            </ul>

            <div className="table-responsive">
              {activeTab === 'booked' && (
                <table className="table table-bordered table-sm text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Slot Time</th>
                      <th>Booked With</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.length === 0 ? (
                      <tr><td colSpan="3">No approved bookings</td></tr>
                    ) : (
                      myBookings.map(slot => (
                        <tr key={slot._id}>
                          <td>{slot.date}</td>
                          <td>{slot.startTime} - {slot.endTime}</td>
                          <td>{slot?.otherUser?.name} ({slot?.otherUser?.email})</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'sent' && (
                <table className="table table-bordered table-sm text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Slot Time</th>
                      <th>Sent To</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSent.length === 0 ? (
                      <tr><td colSpan="4">No pending sent requests</td></tr>
                    ) : (
                      pendingSent.map(slot => (
                        <tr key={slot._id}>
                          <td>{slot.date}</td>
                          <td>{slot.startTime} - {slot.endTime}</td>
                          <td>{slot?.otherUser?.name} ({slot?.otherUser?.email})</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleCancel(slot._id)}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'received' && (
                <table className="table table-bordered table-sm text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Slot Time</th>
                      <th>Requested By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReceived.length === 0 ? (
                      <tr><td colSpan="4">No pending received requests</td></tr>
                    ) : (
                      pendingReceived.map(slot => (
                        <tr key={slot._id}>
                          <td>{slot.date}</td>
                          <td>{slot.startTime} - {slot.endTime}</td>
                          <td>{slot?.otherUser?.name} ({slot?.otherUser?.email})</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleApprove(slot._id)}
                            >
                              Accept
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleCancel(slot._id)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'scans' && (
                <div>
                  <h6>Scanned By Others</h6>
                  <table className="table table-bordered table-sm text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Scanned At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scannedBy.length === 0 ? (
                        <tr><td colSpan="4">No one has scanned your QR code</td></tr>
                      ) : (
                        scannedBy.map(record => (
                          <tr key={record._id}>
                            <td>{record?.scannerId?.prefix} {record?.scannerId?.name}</td>
                            <td>{record?.scannerId?.company}</td>
                            <td>{record?.scannerId?.email}</td>
                            <td>{new Date(record.scannedAt).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <h6 className="mt-4">Scanned By Me</h6>
                  <table className="table table-bordered table-sm text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Scanned At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scannedByMe.length === 0 ? (
                        <tr><td colSpan="4">You haven't scanned any QR codes</td></tr>
                      ) : (
                        scannedByMe.map(record => (
                          <tr key={record._id}>
                            <td>{record?.scanId?.prefix} {record?.scanId?.name}</td>
                            <td>{record?.scanId?.company}</td>
                            <td>{record?.scanId?.email}</td>
                            <td>{new Date(record.scannedAt).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;