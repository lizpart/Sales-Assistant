// components/ProductRecommendations.jsx
import { useState } from 'react';
import apiService from '../api/apiService';
import LoadingSpinner from './common/LoadingSpinner';
import StatusAlert from './common/StatusAlert';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function ProductRecommendations() {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [industry, setIndustry] = useState('');
  const [purchaseHistory, setPurchaseHistory] = useState([{ product: '', category: '', date: '' }]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  const handleAddPurchase = () => {
    setPurchaseHistory([...purchaseHistory, { product: '', category: '', date: '' }]);
  };

  const handlePurchaseChange = (index, field, value) => {
    const updatedHistory = purchaseHistory.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setPurchaseHistory(updatedHistory);
  };

  const handleRemovePurchase = (index) => {
    if (purchaseHistory.length > 1) {
      setPurchaseHistory(purchaseHistory.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId || !customerName) {
      setError('Please enter customer ID and name');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Filter out empty purchase history entries
      const validPurchaseHistory = purchaseHistory.filter(p => p.product && p.category);

      const response = await apiService.getProductRecommendations({
        id: customerId,
        name: customerName,
        industry: industry,
        purchase_history: validPurchaseHistory
      });

      setRecommendations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch recommendations');
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Product Recommendations
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Customer ID"
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Customer Name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Industry"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                fullWidth
              />
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Purchase History
                </Typography>
                <Stack spacing={1}>
                  {purchaseHistory.map((purchase, idx) => (
                    <Paper key={idx} sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        label="Product"
                        value={purchase.product}
                        onChange={e => handlePurchaseChange(idx, 'product', e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Category"
                        value={purchase.category}
                        onChange={e => handlePurchaseChange(idx, 'category', e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Date"
                        type="date"
                        value={purchase.date}
                        onChange={e => handlePurchaseChange(idx, 'date', e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <IconButton
                        onClick={() => handleRemovePurchase(idx)}
                        disabled={purchaseHistory.length === 1}
                        color="error"
                        size="small"
                        aria-label="remove"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddPurchase}
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                  >
                    Add Purchase
                  </Button>
                </Stack>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Loading...' : 'Get Recommendations'}
              </Button>
            </Stack>
          </Box>
          {loading && <LoadingSpinner />}
          {error && <StatusAlert severity="error" message={error} />}
          {recommendations && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Recommended Products
              </Typography>
              <List>
                {recommendations.products && recommendations.products.length > 0 ? (
                  recommendations.products.map((rec, idx) => (
                    <ListItem key={idx} divider>
                      <ListItemText
                        primary={
                          <span>
                            <strong>{rec.name}</strong> <span style={{ color: '#888' }}>({rec.category})</span>
                          </span>
                        }
                        secondary={rec.reason}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No recommendations found." />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProductRecommendations;