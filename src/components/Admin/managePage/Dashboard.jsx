import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { 
  getPaymentStatsApi, 
  getPaymentStatisticsApi, 
  getPaymentStatisticsByPeriodApi 
} from '../../../services/Userservices';

export default function Dashboard() {
  const [userStats, setUserStats] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [periodStats, setPeriodStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Load PrimeReact CSS only when Dashboard mounts and remove when unmounts
  React.useEffect(() => {
    // We'll use scoped CSS instead of loading external stylesheets
    // This prevents global CSS conflicts
    return () => {
      // Cleanup any dashboard-specific styles
      const dashboardStyles = document.querySelectorAll('[data-dashboard-scoped]');
      dashboardStyles.forEach(style => {
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      });
    };
  }, []);

  // Generate months and years options
  const monthOptions = [
    { label: 'Tháng 1', value: 1 },
    { label: 'Tháng 2', value: 2 },
    { label: 'Tháng 3', value: 3 },
    { label: 'Tháng 4', value: 4 },
    { label: 'Tháng 5', value: 5 },
    { label: 'Tháng 6', value: 6 },
    { label: 'Tháng 7', value: 7 },
    { label: 'Tháng 8', value: 8 },
    { label: 'Tháng 9', value: 9 },
    { label: 'Tháng 10', value: 10 },
    { label: 'Tháng 11', value: 11 },
    { label: 'Tháng 12', value: 12 }
  ];

  const yearOptions = [];
  for (let year = 2020; year <= currentDate.getFullYear(); year++) {
    yearOptions.push({ label: `Năm ${year}`, value: year });
  }

  // Add CSS for pulse animation and scoped PrimeReact styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-dashboard-scoped', 'true');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      /* Scoped PrimeReact styles only for Dashboard */
      .dashboard-primereact-scope .p-component {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      }
      
      .dashboard-primereact-scope .p-button {
        color: #ffffff;
        background: #ff8c00;
        border: 1px solid #ff8c00;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
        border-radius: 6px;
      }
      
      .dashboard-primereact-scope .p-button:hover {
        background: #ff6600;
        border-color: #ff6600;
      }
      
      .dashboard-primereact-scope .p-inputtext {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 1rem;
        color: #495057;
        background: #ffffff;
        padding: 0.5rem 0.75rem;
        border: 1px solid #ced4da;
        transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
        border-radius: 6px;
      }
      
      .dashboard-primereact-scope .p-dropdown {
        background: #ffffff;
        border: 1px solid #ced4da;
        transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
        border-radius: 6px;
      }
      
      .dashboard-primereact-scope .p-dropdown:not(.p-disabled):hover {
        border-color: #ff8c00;
      }
      
      .dashboard-primereact-scope .p-dropdown:not(.p-disabled).p-focus {
        outline: 0 none;
        outline-offset: 0;
        box-shadow: 0 0 0 0.2rem rgba(255, 140, 0, 0.2);
        border-color: #ff8c00;
      }
      
      .dashboard-primereact-scope .p-inputnumber-input {
        background: #ffffff;
        border: 1px solid #ced4da;
        border-radius: 6px;
      }
      
      .dashboard-primereact-scope .p-inputnumber-button {
        background: #ff8c00;
        color: #ffffff;
        border: 1px solid #ff8c00;
      }
      
      .dashboard-primereact-scope .p-inputnumber-button:hover {
        background: #ff6600;
        border-color: #ff6600;
      }
      
      .dashboard-primereact-scope .p-progressbar {
        border: 0 none;
        height: 1.5rem;
        background: #dee2e6;
        border-radius: 6px;
      }
      
      .dashboard-primereact-scope .p-progressbar .p-progressbar-value {
        border: 0 none;
        margin: 0;
        background: #ff8c00;
      }
      
      .dashboard-primereact-scope .p-tag {
        background: #ff8c00;
        color: #ffffff;
        font-size: 0.75rem;
        font-weight: bold;
        padding: 0.25rem 0.4rem;
        border-radius: 4px;
      }
      
      .dashboard-primereact-scope .p-card {
        background: #ffffff;
        color: #495057;
        box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
        border-radius: 6px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [selectedMonth, selectedYear]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [userResponse, paymentResponse, periodResponse] = await Promise.all([
        getPaymentStatsApi(),
        getPaymentStatisticsApi(),
        getPaymentStatisticsByPeriodApi(selectedMonth, selectedYear)
      ]);

      setUserStats(userResponse.data);
      setPaymentStats(paymentResponse.data);
      setPeriodStats(periodResponse.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Get number of weeks in the selected month (max 5 weeks)
  const getWeeksInMonth = (month, year) => {
    // A month can have maximum 5 weeks only
    return 5;
  };

  // Generate complete weeks data for the month
  const getCompleteWeeklyData = () => {
    const totalWeeks = getWeeksInMonth(selectedMonth, selectedYear);
    const weeklyData = [];
    const apiWeeklyRevenue = periodStats?.weeklyRevenue || {};
    
    for (let week = 1; week <= totalWeeks; week++) {
      weeklyData.push({
        week: week,
        revenue: apiWeeklyRevenue[week] || 0,
        hasData: apiWeeklyRevenue.hasOwnProperty(week)
      });
    }
    
    return weeklyData;
  };

  const containerStyle = {
    padding: '0',
    background: 'transparent'
  };

  const headerStyle = {
    marginBottom: '2rem',
    textAlign: 'center'
  };

  const dateControlsStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #ff8c00, #ff6600)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: '#ff6600',
    fontSize: '1.1rem',
    fontWeight: '500'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const cardStyle = {
    background: 'linear-gradient(135deg, #fff5f0, #ffe4d6)',
    border: '2px solid #ffcc99',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(255, 140, 0, 0.2)',
    transition: 'all 0.3s ease'
  };

  const cardHeaderStyle = {
    background: 'linear-gradient(90deg, #ff8c00, #ff6600)',
    color: 'white',
    padding: '1rem',
    borderRadius: '13px 13px 0 0',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    textAlign: 'center'
  };

  const statsItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    margin: '0.5rem 0',
    background: 'rgba(255, 140, 0, 0.1)',
    borderRadius: '10px',
    border: '1px solid #ffcc99'
  };

  const statLabelStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ff6600'
  };

  const statValueStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ff8c00'
  };

  const chartCardStyle = {
    ...cardStyle,
    gridColumn: '1 / -1'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={{
            width: '300px',
            height: '3rem',
            background: 'linear-gradient(90deg, #ffcc99, #ffe4d6)',
            margin: '0 auto 1rem',
            borderRadius: '10px',
            animation: 'pulse 2s infinite'
          }}></div>
          <div style={{
            width: '200px',
            height: '1.5rem',
            background: 'linear-gradient(90deg, #ffcc99, #ffe4d6)',
            margin: '0 auto',
            borderRadius: '8px',
            animation: 'pulse 2s infinite'
          }}></div>
        </div>
        <div style={gridStyle}>
          {[1, 2, 3].map(index => (
            <Card key={index} style={cardStyle}>
              <div style={{
                height: '200px',
                background: 'linear-gradient(90deg, #ffcc99, #ffe4d6)',
                borderRadius: '10px',
                animation: 'pulse 2s infinite'
              }}></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: '#ff6600' }}>Có lỗi xảy ra</h2>
        <p style={{ color: '#ff8c00' }}>{error}</p>
        <button 
          onClick={fetchAllData}
          style={{
            background: 'linear-gradient(45deg, #ff8c00, #ff6600)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '25px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="dashboard-primereact-scope">
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard Quản Trị</h1>
        <p style={subtitleStyle}>
          Thống kê tổng quan hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div style={gridStyle}>
        {/* User Stats Card */}
        <Card style={cardStyle}>
          <div style={cardHeaderStyle}>
            📊 Thống Kê Người Dùng
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={statsItemStyle}>
              <span style={statLabelStyle}>Tổng số người dùng:</span>
              <Tag 
                value={userStats?.totalUsers || 0} 
                severity="info"
                style={{ 
                  background: '#ff8c00', 
                  fontSize: '1.2rem',
                  padding: '0.5rem 1rem'
                }}
              />
            </div>
            <div style={statsItemStyle}>
              <span style={statLabelStyle}>Người dùng đã trả phí:</span>
              <Tag 
                value={userStats?.paidUsers || 0} 
                severity="success"
                style={{ 
                  background: '#ff6600', 
                  fontSize: '1.2rem',
                  padding: '0.5rem 1rem'
                }}
              />
            </div>
            <div style={statsItemStyle}>
              <span style={statLabelStyle}>Tỷ lệ chuyển đổi:</span>
              <span style={statValueStyle}>
                {userStats?.totalUsers ? 
                  `${((userStats.paidUsers / userStats.totalUsers) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </span>
            </div>
          </div>
        </Card>

        {/* Payment Statistics Card */}
        <Card style={cardStyle}>
          <div style={cardHeaderStyle}>
            💰 Thống Kê Doanh Thu
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={statsItemStyle}>
              <span style={statLabelStyle}>Tổng doanh thu:</span>
              <span style={statValueStyle}>
                {formatCurrency(paymentStats?.totalPaidAmount || 0)}
              </span>
            </div>
            <div style={statsItemStyle}>
              <span style={statLabelStyle}>Tổng số đơn hàng:</span>
              <Tag 
                value={paymentStats?.totalPaidOrders || 0} 
                severity="warning"
                style={{ 
                  background: '#ff8c00', 
                  fontSize: '1.2rem',
                  padding: '0.5rem 1rem'
                }}
              />
            </div>
            <div style={statsItemStyle}>
              <span style={statLabelStyle}>Doanh thu trung bình:</span>
              <span style={statValueStyle}>
                {paymentStats?.totalPaidOrders ? 
                  formatCurrency(paymentStats.totalPaidAmount / paymentStats.totalPaidOrders) : 
                  formatCurrency(0)
                }
              </span>
            </div>
          </div>
        </Card>

        {/* Period Statistics Card */}
        <Card style={cardStyle}>
          <div style={cardHeaderStyle}>
            📈 Thống Kê Tháng Hiện Tại
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={statsItemStyle}>
              <span style={statLabelStyle}>Doanh thu tháng này:</span>
              <span style={statValueStyle}>
                {formatCurrency(periodStats?.totalMonth || 0)}
              </span>
            </div>
            <div style={statsItemStyle}>
              <span style={statLabelStyle}>Doanh thu tất cả:</span>
              <span style={statValueStyle}>
                {formatCurrency(periodStats?.totalAllTime || 0)}
              </span>
            </div>
            <div style={statsItemStyle}>
              <span style={statLabelStyle}>So với tổng:</span>
              <span style={statValueStyle}>
                {periodStats?.totalAllTime ? 
                  `${((periodStats.totalMonth / periodStats.totalAllTime) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Revenue Progress Bars */}
      <Card style={chartCardStyle}>
        <div style={cardHeaderStyle}>
          📊 Doanh Thu Theo Tuần
        </div>
        
        {/* Date Controls moved here */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid #ffcc99',
          background: 'rgba(255, 140, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ 
                color: '#ff6600', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                Tháng:
              </label>
              <Dropdown
                value={selectedMonth}
                options={monthOptions}
                onChange={(e) => setSelectedMonth(e.value)}
                placeholder="Chọn tháng"
                showClear={false}
                filter
                filterPlaceholder="Tìm tháng..."
                style={{
                  minWidth: '140px'
                }}
                pt={{
                  root: {
                    style: {
                      background: '#fff5f0',
                      border: '2px solid #ffcc99',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }
                  },
                  input: {
                    style: {
                      color: '#ff6600',
                      fontWeight: 'bold',
                      padding: '0.75rem'
                    }
                  }
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ 
                color: '#ff6600', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                Năm:
              </label>
              <InputNumber
                value={selectedYear}
                onValueChange={(e) => setSelectedYear(e.value)}
                min={2020}
                max={currentDate.getFullYear()}
                placeholder="Nhập năm"
                showButtons
                buttonLayout="horizontal"
                step={1}
                useGrouping={false}
                style={{
                  minWidth: '140px'
                }}
                pt={{
                  root: {
                    style: {
                      background: '#fff5f0',
                      border: '2px solid #ffcc99',
                      borderRadius: '8px'
                    }
                  },
                  input: {
                    style: {
                      color: '#ff6600',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: '0.75rem'
                    }
                  },
                  incrementButton: {
                    style: {
                      background: 'linear-gradient(45deg, #ff8c00, #ff6600)',
                      border: 'none',
                      color: 'white'
                    }
                  },
                  decrementButton: {
                    style: {
                      background: 'linear-gradient(45deg, #ff8c00, #ff6600)',
                      border: 'none',
                      color: 'white'
                    }
                  }
                }}
              />
            </div>
            
            <Button
              label="Hôm nay"
              size="small"
              onClick={() => {
                setSelectedMonth(currentDate.getMonth() + 1);
                setSelectedYear(currentDate.getFullYear());
              }}
              style={{
                background: 'linear-gradient(45deg, #ff8c00, #ff6600)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.5rem 1rem',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            color: '#ff8c00',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            Tháng {selectedMonth}/{selectedYear}
          </div>
        </div>
        
        <div style={{ padding: '2rem' }}>
          {getCompleteWeeklyData().map((weekData) => {
            const completeWeeklyData = getCompleteWeeklyData();
            const maxRevenue = Math.max(...completeWeeklyData.map(w => w.revenue));
            const percentage = maxRevenue > 0 ? (weekData.revenue / maxRevenue) * 100 : 0;
            
            return (
              <div key={weekData.week} style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: weekData.hasData ? '#ff6600' : '#ccc'
                  }}>
                    Tuần {weekData.week}
                  </span>
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: weekData.hasData ? '#ff8c00' : '#ccc'
                  }}>
                    {weekData.hasData ? formatCurrency(weekData.revenue) : 'Chưa có dữ liệu'}
                  </span>
                </div>
                <ProgressBar 
                  value={percentage}
                  style={{
                    height: '25px',
                    background: weekData.hasData ? '#ffe4d6' : '#f5f5f5',
                    borderRadius: '15px',
                    border: `2px solid ${weekData.hasData ? '#ffcc99' : '#ddd'}`,
                    opacity: weekData.hasData ? 1 : 0.5
                  }}
                  pt={{
                    value: {
                      style: {
                        background: weekData.hasData ? 
                          'linear-gradient(90deg, #ff8c00, #ff6600)' : 
                          'linear-gradient(90deg, #ddd, #bbb)',
                        borderRadius: '13px'
                      }
                    }
                  }}
                />
                {!weekData.hasData && (
                  <small style={{ 
                    color: '#999', 
                    fontStyle: 'italic',
                    display: 'block',
                    marginTop: '0.25rem'
                  }}>
                    {weekData.week > Math.ceil(new Date().getDate() / 7) && 
                     selectedMonth === currentDate.getMonth() + 1 && 
                     selectedYear === currentDate.getFullYear() 
                     ? 'Chưa đến tuần này' 
                     : 'Không có doanh thu'}
                  </small>
                )}
              </div>
            );
          })}
          
          {getCompleteWeeklyData().length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#999',
              fontStyle: 'italic'
            }}>
              Không có dữ liệu cho tháng này
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
