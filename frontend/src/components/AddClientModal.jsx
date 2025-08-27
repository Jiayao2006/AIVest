import React, { useState } from 'react';

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' }
];

export default function AddClientModal({ show, onHide, onClientAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+41',
    phoneNumber: '',
    aum: '',
    domicile: '',
    segments: '',
    keyContacts: '',
    description: '',
    riskProfile: 'Moderate'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{6,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Phone number must contain only digits (6-15 digits)';
    }

    // AUM validation
    if (!formData.aum) {
      errors.aum = 'AUM is required';
    } else if (parseFloat(formData.aum) <= 0) {
      errors.aum = 'AUM must be greater than 0';
    } else if (parseFloat(formData.aum) < 1) {
      errors.aum = 'Minimum AUM for HNWI clients is $1M';
    }

    // Domicile validation
    if (!formData.domicile) {
      errors.domicile = 'Domicile is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number - only allow digits and spaces
    if (name === 'phoneNumber') {
      const cleanValue = value.replace(/[^\d\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setError(''); // Clear general error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Process segments and key contacts
      const segments = formData.segments.split(',').map(s => s.trim()).filter(Boolean);
      const keyContacts = formData.keyContacts.split(',').map(s => s.trim()).filter(Boolean);

      const clientData = {
        name: formData.name.trim(),
        phone: `${formData.countryCode} ${formData.phoneNumber}`,
        aum: parseFloat(formData.aum),
        domicile: formData.domicile,
        segments,
        keyContacts,
        description: formData.description.trim(),
        riskProfile: formData.riskProfile
      };

      console.log('Sending client data:', clientData);

      const response = await fetch('http://localhost:5000/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const newClient = await response.json();
      console.log('New client created:', newClient);
      
      // Reset form
      setFormData({
        name: '',
        countryCode: '+41',
        phoneNumber: '',
        aum: '',
        domicile: '',
        segments: '',
        keyContacts: '',
        description: '',
        riskProfile: 'Moderate'
      });
      setValidationErrors({});

      // Notify parent component
      onClientAdded(newClient);
      onHide();
      
    } catch (err) {
      console.error('Error creating client:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-plus-fill me-2 text-primary"></i>
              Add New Client
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Elena Rossi-Marchetti"
                    required
                  />
                  {validationErrors.name && (
                    <div className="invalid-feedback">{validationErrors.name}</div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Phone Number *</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      style={{ maxWidth: '120px' }}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      className={`form-control ${validationErrors.phoneNumber ? 'is-invalid' : ''}`}
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="22 999 1234"
                      required
                    />
                    {validationErrors.phoneNumber && (
                      <div className="invalid-feedback">{validationErrors.phoneNumber}</div>
                    )}
                  </div>
                  <small className="text-muted">Enter digits only (spaces allowed for formatting)</small>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">AUM (Millions USD) *</label>
                  <input
                    type="number"
                    className={`form-control ${validationErrors.aum ? 'is-invalid' : ''}`}
                    name="aum"
                    value={formData.aum}
                    onChange={handleChange}
                    placeholder="850"
                    min="1"
                    step="0.1"
                    required
                  />
                  {validationErrors.aum && (
                    <div className="invalid-feedback">{validationErrors.aum}</div>
                  )}
                  <small className="text-muted">Minimum $1M for HNWI clients</small>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Domicile *</label>
                  <select
                    className={`form-select ${validationErrors.domicile ? 'is-invalid' : ''}`}
                    name="domicile"
                    value={formData.domicile}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Domicile</option>
                    <option value="Switzerland">🇨🇭 Switzerland</option>
                    <option value="United States">🇺🇸 United States</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Singapore">🇸🇬 Singapore</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="France">🇫🇷 France</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="Norway">🇳🇴 Norway</option>
                    <option value="Spain">🇪🇸 Spain</option>
                    <option value="Italy">🇮🇹 Italy</option>
                    <option value="Other">🌍 Other</option>
                  </select>
                  {validationErrors.domicile && (
                    <div className="invalid-feedback">{validationErrors.domicile}</div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Risk Profile *</label>
                  <select
                    className="form-select"
                    name="riskProfile"
                    value={formData.riskProfile}
                    onChange={handleChange}
                    required
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Segments</label>
                  <input
                    type="text"
                    className="form-control"
                    name="segments"
                    value={formData.segments}
                    onChange={handleChange}
                    placeholder="Family Office, Wealth Preservation"
                  />
                  <small className="text-muted">Separate multiple segments with commas</small>
                </div>
                
                <div className="col-12">
                  <label className="form-label">Key Contacts</label>
                  <input
                    type="text"
                    className="form-control"
                    name="keyContacts"
                    value={formData.keyContacts}
                    onChange={handleChange}
                    placeholder="Elena Rossi, Marco Rossi"
                  />
                  <small className="text-muted">Separate multiple contacts with commas</small>
                </div>
                
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief description of the client's background and investment objectives..."
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-lg me-2"></i>
                    Create Client
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
