import Alert from '@mui/material/Alert';

function StatusAlert({ severity = "info", message }) {
  if (!message) return null;
  return (
    <Alert severity={severity} sx={{ mt: 2 }}>
      {message}
    </Alert>
  );
}

export default StatusAlert;