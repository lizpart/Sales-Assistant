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
  Stack,
  Paper
} from '@mui/material';

function ProposalGenerator() {
  const [clientName, setClientName] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [objectives, setObjectives] = useState('');
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !projectDetails || !objectives) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    setProposal('');
    try {
      const response = await apiService.generateProposal({
        client_name: clientName,
        project_details: projectDetails,
        objectives,
      });
      setProposal(response.data.proposal || 'No proposal generated.');
    } catch (err) {
      setError('Failed to generate proposal');
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Proposal Generator
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Client Name"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Project Details"
                value={projectDetails}
                onChange={e => setProjectDetails(e.target.value)}
                required
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Objectives"
                value={objectives}
                onChange={e => setObjectives(e.target.value)}
                required
                multiline
                rows={2}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Generating...' : 'Generate Proposal'}
              </Button>
            </Stack>
          </Box>
          {loading && <LoadingSpinner />}
          {error && <StatusAlert severity="error" message={error} />}
          {proposal && (
            <Paper elevation={3} sx={{ mt: 4, p: 3, background: '#f9f9f9' }}>
              <Typography variant="h6" gutterBottom>
                Generated Proposal
              </Typography>
              <Box
                component="pre"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  background: 'none',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  m: 0,
                  p: 0,
                }}
              >
                {proposal}
              </Box>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProposalGenerator;