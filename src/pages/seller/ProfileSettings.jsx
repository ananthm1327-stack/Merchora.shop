import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldAlert, Building, Phone, Key, Landmark, CheckCircle, Upload, FileText } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [businessName, setBusinessName] = useState(user?.profile?.businessName || '');
  const [contact, setContact] = useState(user?.profile?.contact || '');
  const [taxId, setTaxId] = useState(user?.profile?.taxId || '');
  const [bankAccount, setBankAccount] = useState(user?.profile?.bankAccount || '');
  const [fileSelected, setFileSelected] = useState(null);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!businessName.trim()) err.businessName = 'Business name is required.';
    if (!contact.trim()) err.contact = 'Business phone number is required.';
    if (!taxId.trim()) err.taxId = 'Tax ID (EIN) number is required.';
    if (!bankAccount.trim()) err.bankAccount = 'Payout bank details are required.';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSuccessMsg('');
    try {
      await updateProfile({
        businessName,
        contact,
        taxId,
        bankAccount
      });
      setSuccessMsg('Business settings updated successfully!');
    } catch (err) {
      addToast('Error updating business: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('File size exceeds 5MB limit.', 'error');
        return;
      }
      setFileSelected(file);
      addToast('Business document uploaded successfully. Merchora support will review it within 24 hours.', 'success');
    }
  };

  return (
    <div style={{ textAlign: 'left' }} className="flex flex-col gap-lg">
      
      {/* 1. Header */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Business Settings & Security</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Review payout details, tax identifications, business licenses and verification state</p>
      </div>

      {successMsg && (
        <div className="badge badge-success" style={{ display: 'block', padding: '12px', borderRadius: '4px', textAlign: 'center', width: '100%' }}>
          {successMsg}
        </div>
      )}

      {/* 2. Form & Payout card */}
      <div className="grid grid-2 gap-lg flex-mobile-col" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'flex-start' }}>
        
        {/* Core settings form */}
        <form onSubmit={handleSave} className="card flex flex-col gap-md">
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Store Profile
          </h3>

          <div className="form-group">
            <label className="form-label">Registered Business Name</label>
            <div style={{ position: 'relative' }}>
              <Building size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            {errors.businessName && <span className="form-error">{errors.businessName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Customer Support Phone</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            {errors.contact && <span className="form-error">{errors.contact}</span>}
          </div>

          <div className="grid grid-2 gap-md">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tax ID Number (EIN)</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
              {errors.taxId && <span className="form-error">{errors.taxId}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Payout Bank Account Target</label>
              <div style={{ position: 'relative' }}>
                <Landmark size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
              {errors.bankAccount && <span className="form-error">{errors.bankAccount}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={saving}
            style={{ alignSelf: 'flex-start', marginTop: '10px' }}
          >
            {saving ? 'Updating Business...' : 'Save Settings Details'}
          </button>

        </form>

        {/* Right card: Verification files upload & status */}
        <div className="flex flex-col gap-md">
          
          {/* Status Badge */}
          <div className="card text-center" style={{ padding: '24px', borderLeft: '4px solid var(--success)' }}>
            <CheckCircle size={32} style={{ color: 'var(--success)', margin: '0 auto 8px' }} />
            <h4 style={{ fontWeight: 600 }}>Store Verification Status</h4>
            <div style={{ marginTop: '8px' }}>
              <span className="badge badge-success" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                {user?.profile?.verificationStatus || 'Verified'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.4 }}>
              Your store credentials have been verified. Unlimited product lists and instant payouts are active.
            </p>
          </div>

          {/* Licenses uploads */}
          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>Business Certifications</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Upload incorporation records, sales tax permits, or regulatory files to maintain payout compliance.
            </p>
            
            <div 
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-tertiary)'
              }}
              onClick={() => document.getElementById('licensesFile').click()}
            >
              <Upload size={20} style={{ color: 'var(--text-tertiary)', margin: '0 auto 6px' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block', color: 'var(--text-secondary)' }}>
                {fileSelected ? `Selected: ${fileSelected.name}` : 'Click to select license document (.pdf)'}
              </span>
              <input 
                type="file" 
                id="licensesFile" 
                style={{ display: 'none' }} 
                accept=".pdf"
                onChange={handleFileUpload}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
