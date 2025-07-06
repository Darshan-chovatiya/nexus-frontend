import { QRCodeCanvas } from 'qrcode.react';
import { BaseUrl, FrontendUrl } from '../service/Uri';
import { FaQrcode } from 'react-icons/fa';


const CompanyQR = ({ companyId }) => {
  const qrUrl = `${FrontendUrl}/user-form/${companyId}`;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body text-center p-4">
        <div className="mb-3">
          <FaQrcode size={24} className="text-primary mb-2" />
          <h6 className="fw-bold text-primary">Company QR Code</h6>
        </div>
        <div className="d-flex justify-content-center mb-3">
          <div className="p-3 bg-white shadow rounded-3">
            <QRCodeCanvas value={qrUrl} size={190} />
          </div>
        </div>
        <div className="bg-light p-3 rounded-3">
          <small className="text-muted d-block mb-1">Scan URL:</small>
          <code className="text-primary small">{qrUrl}</code>
        </div>
      </div>
    </div>
  );
};

export default CompanyQR;