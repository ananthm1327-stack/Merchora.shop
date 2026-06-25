import React, { useState } from 'react';
import { DollarSign, Landmark, Download, Percent, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export const Financials = ({ analytics }) => {
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  const [loadingPayout, setLoadingPayout] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const totalEarnings = analytics ? analytics.totalEarnings : 0;
  const platformFee = analytics ? analytics.platformFee : 0;
  const pendingPayout = analytics ? analytics.pendingPayout : 0;
  
  // Calculate payouts
  const netEarnings = parseFloat((totalEarnings - platformFee).toFixed(2));

  // Payout simulator
  const handleRequestPayout = () => {
    if (pendingPayout <= 0) {
      addToast('You have no pending payouts at this time.', 'info');
      return;
    }
    setLoadingPayout(true);
    setSuccessMsg('');
    setTimeout(() => {
      setLoadingPayout(false);
      setSuccessMsg(`Payout request of ${formatPrice(pendingPayout)} approved! Funds have been securely routed to your verified bank account.`);
      addToast(`Payout request of ${formatPrice(pendingPayout)} approved & routed!`, 'success');
      // Mock reset pending payout state
      // (For visual mockup, we show success banner)
    }, 1500);
  };

  // Mock Ledger list
  const payoutLedger = [
    { id: 'pay_98765', date: '2026-06-18', amount: 1540.00, account: 'Chase Bank ****9876', status: 'completed' },
    { id: 'pay_98432', date: '2026-06-10', amount: 3200.00, account: 'Chase Bank ****9876', status: 'completed' },
    { id: 'pay_98120', date: '2026-05-28', amount: 4890.00, account: 'Chase Bank ****9876', status: 'completed' }
  ];

  return (
    <div style={{ textAlign: 'left' }} className="flex flex-col gap-lg">
      
      {/* 1. Header Overview */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Financial Overview & Payouts</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Track gross revenue volume, payouts to bank accounts, escrow charges and fee deductions</p>
      </div>

      {successMsg && (
        <div className="badge badge-success" style={{ display: 'block', padding: '12px', borderRadius: '4px', textAlign: 'center', width: '100%' }}>
          {successMsg}
        </div>
      )}

      {/* 2. Financial Balance widgets */}
      <div className="grid grid-3 gap-md">
        
        <div className="card flex flex-col justify-between" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
          <div className="flex justify-between align-center" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>TOTAL GROSS EARNINGS</span>
            <DollarSign size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{formatPrice(totalEarnings)}</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Accumulated marketplace sales volume</p>
          </div>
        </div>

        <div className="card flex flex-col justify-between" style={{ padding: '24px', borderLeft: '4px solid var(--success)' }}>
          <div className="flex justify-between align-center" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>NET PAYABLE TO YOU</span>
            <Landmark size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{formatPrice(netEarnings)}</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Excludes 10% platform service fees</p>
          </div>
        </div>

        <div className="card flex flex-col justify-between" style={{ padding: '24px', borderLeft: '4px solid var(--warning)' }}>
          <div className="flex justify-between align-center" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>ESCROW PENDING PAYOUT</span>
            <ShieldCheck size={18} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{formatPrice(pendingPayout)}</h2>
            <button 
              onClick={handleRequestPayout} 
              disabled={loadingPayout || pendingPayout <= 0}
              className="btn btn-primary btn-sm flex align-center gap-xs"
              style={{ marginTop: '10px', width: '100%' }}
            >
              <Download size={12} /> {loadingPayout ? 'Routing Payout...' : 'Request Payout Route'}
            </button>
          </div>
        </div>

      </div>

      {/* 3. Platform fees calculator */}
      <div className="grid grid-2 gap-lg flex-mobile-col" style={{ gridTemplateColumns: '1.2fr 1fr', alignItems: 'flex-start' }}>
        
        {/* Payout records */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Payout Transaction Ledger</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Date Approved</th>
                  <th>Payout Target</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutLedger.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.id}</td>
                    <td>{item.date}</td>
                    <td>{item.account}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(item.amount)}</td>
                    <td>
                      <span className="badge badge-success" style={{ textTransform: 'uppercase' }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform commission explanation */}
        <div className="card flex flex-col gap-md" style={{ padding: '24px' }}>
          <h3 className="flex align-center gap-sm" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            <Percent size={18} style={{ color: 'var(--primary)' }} /> Platform Commission Split
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Merchora utilizes a <strong>10.0% flat-rate service fee</strong> on all fulfilled listings. These fees directly cover:
          </p>
          <ul style={{ fontSize: '0.8rem', paddingLeft: '16px', listStyleType: 'disc', color: 'var(--text-secondary)' }} className="flex flex-col gap-sm">
            <li>Secure Stripe-gateway escrow protection.</li>
            <li>Client dispute moderation services.</li>
            <li>Free hosting and visibility of listing assets.</li>
          </ul>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '6px' }}>
            <div className="flex justify-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
              <span>Total Service Charge:</span>
              <span style={{ fontWeight: 600 }}>-{formatPrice(platformFee)}</span>
            </div>
            <div className="flex justify-between" style={{ fontSize: '0.85rem' }}>
              <span>Payout Target Rates:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>90.0% Net Payout</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
