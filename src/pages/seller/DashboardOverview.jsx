import React from 'react';
import { 
  TrendingUp, Users, Eye, AlertTriangle, 
  DollarSign, Package, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';

export const DashboardOverview = ({ analytics, loading }) => {
  const { formatPrice, convert, selectedCurrency, currencies } = useCurrency();
  const currencySymbol = currencies.find(c => c.code === selectedCurrency)?.symbol || '$';

  if (loading || !analytics) {
    return (
      <div className="flex flex-col gap-md">
        <div className="grid grid-4 gap-md">
          {[1,2,3,4].map(idx => (
            <div key={idx} className="card" style={{ height: '100px' }}>
              <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '10px' }}></div>
              <div className="skeleton" style={{ height: '30px', width: '80%' }}></div>
            </div>
          ))}
        </div>
        <div className="card" style={{ height: '300px' }}>
          <div className="skeleton" style={{ height: '100%', width: '100%' }}></div>
        </div>
      </div>
    );
  }

  const { 
    revenueTrend, bestSellers, conversionRate, 
    viewCount, salesCount, lowStockItems, totalEarnings 
  } = analytics;

  // Custom SVG Chart parameters
  const chartHeight = 160;
  const chartWidth = 500;
  const maxRevenue = Math.max(...revenueTrend.map(r => r.revenue)) || 1000;
  
  // Convert chart data to coordinate points
  const points = revenueTrend.map((item, idx) => {
    const x = (idx / (revenueTrend.length - 1)) * chartWidth;
    // invert y since SVG 0,0 is top left
    const y = chartHeight - (item.revenue / maxRevenue) * chartHeight + 20; // 20px padding
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col gap-lg" style={{ textAlign: 'left' }}>
      
      {/* 1. Quick Stats Cards Grid */}
      <div className="grid grid-4 gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        
        <div className="card flex flex-col justify-between" style={{ padding: '20px' }}>
          <div className="flex justify-between align-center" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>NET EARNINGS</span>
            <DollarSign size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatPrice(totalEarnings)}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              <ArrowUpRight size={12} /> +12.4% <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>from last month</span>
            </span>
          </div>
        </div>

        <div className="card flex flex-col justify-between" style={{ padding: '20px' }}>
          <div className="flex justify-between align-center" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>SALES FULFILLED</span>
            <Package size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{salesCount} items</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              <ArrowUpRight size={12} /> +8.1% <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>p.w. average</span>
            </span>
          </div>
        </div>

        <div className="card flex flex-col justify-between" style={{ padding: '20px' }}>
          <div className="flex justify-between align-center" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>CATALOG VIEWS</span>
            <Eye size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{viewCount} views</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              <ArrowUpRight size={12} /> +15.3% <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>organic views</span>
            </span>
          </div>
        </div>

        <div className="card flex flex-col justify-between" style={{ padding: '20px' }}>
          <div className="flex justify-between align-center" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>CONVERSION RATE</span>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{conversionRate}%</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              <ArrowUpRight size={12} /> +0.4% <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>industry average: 2.1%</span>
            </span>
          </div>
        </div>

      </div>

      {/* 2. Charts and Alerts Section */}
      <div className="grid grid-2 gap-lg flex-mobile-col" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'flex-start' }}>
        
        {/* Beautiful Custom SVG Line Chart */}
        <div className="card flex flex-col gap-md" style={{ padding: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Sales Revenue Trend ({selectedCurrency})</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly performance metrics (Jan - Jun)</p>
          </div>
          
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} 
              style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              
              {/* Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line 
                  key={i}
                  x1="0" 
                  y1={chartHeight * ratio + 20} 
                  x2={chartWidth} 
                  y2={chartHeight * ratio + 20} 
                  stroke="var(--border-color)" 
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              ))}

              {/* Area shading under the curve */}
              <path
                d={`M 0,${chartHeight + 20} L ${points} L ${chartWidth},${chartHeight + 20} Z`}
                fill="url(#chartGradient)"
              />

              {/* Chart Line */}
              <polyline
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />

              {/* Data points markers */}
              {revenueTrend.map((item, idx) => {
                const x = (idx / (revenueTrend.length - 1)) * chartWidth;
                const y = chartHeight - (item.revenue / maxRevenue) * chartHeight + 20;
                return (
                  <g key={idx}>
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="5" 
                      fill="var(--bg-secondary)" 
                      stroke="var(--primary)" 
                      strokeWidth="2.5" 
                    />
                    {/* Value tags */}
                    <text 
                      x={x} 
                      y={y - 10} 
                      fontSize="9" 
                      fontWeight="700" 
                      textAnchor="middle" 
                      fill="var(--text-primary)"
                    >
                      {currencySymbol}{Math.round(convert(item.revenue))}
                    </text>
                  </g>
                );
              })}

              {/* Months labels */}
              {revenueTrend.map((item, idx) => {
                const x = (idx / (revenueTrend.length - 1)) * chartWidth;
                return (
                  <text 
                    key={idx}
                    x={x} 
                    y={chartHeight + 25} 
                    fontSize="10" 
                    fontWeight="500" 
                    textAnchor="middle" 
                    fill="var(--text-secondary)"
                  >
                    {item.name}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Low Stock Watchdog Panel */}
        <div className="card flex flex-col gap-md" style={{ padding: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Low Stock Alert Monitor</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Variants requiring inventory replenishment</p>
          </div>

          <div className="flex flex-col gap-sm" style={{ maxHeight: '230px', overflowY: 'auto' }}>
            {lowStockItems.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                ✓ All items healthy and in-stock.
              </div>
            ) : (
              lowStockItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex align-center justify-between low-stock-alert"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--danger)' }}>{item.productTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Option: {item.variantName} ({item.variantValue}) • SKU: {item.sku}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-danger" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      Qty: {item.inventory} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 3. Top Products Performance List */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px' }}>Best-Selling Store Products</h3>
        
        {bestSellers.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Awaiting your first store purchase to compile best-sellers.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Title</th>
                  <th>Quantity Fulfilled</th>
                  <th>Total Gross Revenue</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                    <td>{item.sales} units</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
