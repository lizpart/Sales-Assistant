// components/ObjectionHandler.jsx
import { useState } from 'react';
import apiService from '../api/apiService';
import LoadingSpinner from './common/LoadingSpinner';
import StatusAlert from './common/StatusAlert';

function ObjectionHandler() {
  const [customerId, setCustomerId] = useState('');
  const [interactionType, setInteractionType] = useState('');
  const [objections, setObjections] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerId || !objections) {
      setError('Please enter customer ID and objections');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const objectionsList = objections.split(',').map(obj => obj.trim());
      
      const response = await apiService.analyzeObjections({
        customer_id: customerId,
        interaction_type: interactionType || 'General Inquiry',
        objections: objectionsList,
        notes: notes
      });
      
      setAnalysis(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error analyzing objections:', err);
      setError('Failed to analyze objections. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="objection-handler">
      <h1>Sales Objection Handler</h1>
      <p>Analyze customer objections and get AI-powered strategies to overcome them.</p>
      
      {error && <StatusAlert type="error" message={error} />}
      
      <div className="card">
        <div className="card-header">
          <h2>Enter Objection Details</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerId">Customer ID</label>
              <input
                type="text"
                id="customerId"
                className="form-control"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Enter customer ID"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="interactionType">Interaction Type</label>
              <select
                id="interactionType"
                className="form-control"
                value={interactionType}
                onChange={(e) => setInteractionType(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Select Type --</option>
                <option value="Initial Contact">Initial Contact</option>
                <option value="Follow-up Call">Follow-up Call</option>
                <option value="Product Demo">Product Demo</option>
                <option value="Proposal Review">Proposal Review</option>
                <option value="Price Negotiation">Price Negotiation</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="objections">Objections (comma separated)</label>
              <textarea
                id="objections"
                className="form-control"
                value={objections}
                onChange={(e) => setObjections(e.target.value)}
                placeholder="E.g., Price too high, Delivery timeframe, Technical specifications"
                rows={3}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Interaction Notes</label>
              <textarea
                id="notes"
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional context about the interaction"
                rows={4}
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Objections'}
            </button>
          </form>
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      
      {analysis && !loading && (
        <div className="card">
          <div className="card-header">
            <h2>Objection Analysis</h2>
          </div>
          <div className="card-content">
            <div className="analysis-content">
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {analysis.analysis}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ObjectionHandler;