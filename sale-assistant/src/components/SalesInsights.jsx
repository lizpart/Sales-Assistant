// File: components/SalesInsights.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function SalesInsights() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/sales-insights');
        setInsights(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales insights:', error);
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, []);
  
  if (loading) {
    return <CircularProgress />;
  }
  
  // Prepare data for pie chart
  const productData = insights?.top_performing_products?.map(product => ({
    name: product.name,
    value: product.sales_count
  })) || [];
  
  // Prepare data for bar chart
  const objectionData = insights?.common_objections?.map(objection => ({
    name: objection.objection,
    frequency: parseFloat(objection.frequency.replace('%', ''))
  })) || [];
  
  return (
    <div className="sales-insights">
      <Typography variant="h4" component="h1" gutterBottom>
        Sales Insights & Analytics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Top Performing Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Top Performing Products
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Sales Count</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insights?.top_performing_products?.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {product.name}
                        </TableCell>
                        <TableCell align="right">{product.sales_count}</TableCell>
                        <TableCell align="right">${product.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Common Objections */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Most Common Objections
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={objectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Frequency (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="frequency" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Objection</TableCell>
                      <TableCell align="right">Frequency (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insights?.common_objections?.map((objection, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {objection.objection}
                        </TableCell>
                        <TableCell align="right">{objection.frequency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default SalesInsights;