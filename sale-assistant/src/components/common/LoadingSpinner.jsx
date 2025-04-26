import CircularProgress from '@mui/material/CircularProgress';

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
      <CircularProgress />
    </div>
  );
}

export default LoadingSpinner;