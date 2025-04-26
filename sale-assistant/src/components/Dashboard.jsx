// File: components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [insights, setInsights] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales data
        const salesResponse = await axios.get('http://localhost:8000/api/sales-invoices');
        setSalesData(salesResponse.data);
        
        // Fetch insights
        const insightsResponse = await axios.get('http://localhost:8000/api/sales-insights');
        setInsights(insightsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Prepare chart data
  const chartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <div className="dashboard">
      <Typography variant="h4" component="h1" gutterBottom>
        Sales Dashboard
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h5" component="div">
                {insights?.total_sales || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Conversion Rate
              </Typography>
              <Typography variant="h5" component="div">
                {insights?.conversion_rate || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Proposals
              </Typography>
              <Typography variant="h5" component="div">
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Follow-ups Due
              </Typography>
              <Typography variant="h5" component="div">
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Sales Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Sales Performance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Recent Sales & Recommendations */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Sales
              </Typography>
              {salesData.slice(0, 5).map((sale, index) => (
                <Box key={index} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body1">
                    {sale.Customer_Name || 'Customer ' + (index + 1)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Invoice: {sale.No || 'N/A'} | Amount: ${sale.Amount || 'N/A'}
                  </Typography>
                </Box>
              ))}
              <Button variant="contained" color="primary" size="small" sx={{ mt: 2 }}>
                View All Sales
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recommended Actions
              </Typography>
              {insights?.recommendations?.map((recommendation, index) => (
                <Box key={index} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body1">{recommendation}</Typography>
                </Box>
              ))}
              <Button variant="contained" color="primary" size="small" sx={{ mt: 2 }}>
                Get More Insights
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Leads */}
      {/* <TopLeads /> */}
    </div>
  );
}

export default Dashboard;
