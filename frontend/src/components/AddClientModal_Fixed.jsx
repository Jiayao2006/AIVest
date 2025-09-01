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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    aum: '',
    segment: 'retail',
    domicile: '',
    riskProfile: 'moderate',
    description: ''
  });

  const [keyContacts, setKeyContacts] = useState([
    { name: '', role: '', email: '', phone: '' }
  ]);

  const [segments, setSegments] = useState(['retail']);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const addKeyContact = () => {
    setKeyContacts(prev => [...prev, { name: '', role: '', email: '', phone: '' }]);
  };

  const removeKeyContact = (index) => {
    if (keyContacts.length > 1) {
      setKeyContacts(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateKeyContact = (index, field, value) => {
    setKeyContacts(prev => prev.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        throw new Error('First name and last name are required');
      }
      
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error('A valid email address is required');
      }
      
      if (!formData.aum || parseFloat(formData.aum) <= 0) {
        throw new Error('Assets Under Management must be a positive number');
      }

      // Create client data
      const clientData = {
        id: `c${Date.now()}`,
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        aum: parseFloat(formData.aum),
        segment: formData.segment,
        domicile: formData.domicile.trim(),
        lastContact: new Date().toISOString().split('T')[0],
        status: 'Active',
        segments,
        keyContacts: keyContacts.filter(contact => contact.name.trim()),
        description: formData.description.trim(),
        riskProfile: formData.riskProfile
      };

      console.log('Sending client data:', clientData);

      // Use environment variable or fallback to localhost
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Client created successfully:', result);
      
      if (onClientAdded) {
        onClientAdded(result);
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        aum: '',
        segment: 'retail',
        domicile: '',
        riskProfile: 'moderate',
        description: ''
      });
      setKeyContacts([{ name: '', role: '', email: '', phone: '' }]);
      setSegments(['retail']);
      setError(null);
      setIsSubmitting(false);
      onHide();

    } catch (error) {
      console.error('❌ Failed to create client:', error);
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Client</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Assets Under Management ($ Millions) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="form-control"
                    value={formData.aum}
                    onChange={(e) => handleInputChange('aum', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Risk Profile</label>
                  <select
                    className="form-select"
                    value={formData.riskProfile}
                    onChange={(e) => handleInputChange('riskProfile', e.target.value)}
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Segment</label>
                  <select
                    className="form-select"
                    value={formData.segment}
                    onChange={(e) => handleInputChange('segment', e.target.value)}
                  >
                    <option value="retail">Retail</option>
                    <option value="private">Private Banking</option>
                    <option value="institutional">Institutional</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Domicile</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Switzerland, Singapore"
                    value={formData.domicile}
                    onChange={(e) => handleInputChange('domicile', e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Additional notes about the client..."
                  />
                </div>
              </div>

              <hr />
              
              <h6>Key Contacts</h6>
              {keyContacts.map((contact, index) => (
                <div key={index} className="row g-2 mb-3">
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={contact.name}
                      onChange={(e) => updateKeyContact(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Role"
                      value={contact.role}
                      onChange={(e) => updateKeyContact(index, 'role', e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={contact.email}
                      onChange={(e) => updateKeyContact(index, 'email', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone"
                      value={contact.phone}
                      onChange={(e) => updateKeyContact(index, 'phone', e.target.value)}
                    />
                  </div>
                  <div className="col-md-1">
                    {keyContacts.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeKeyContact(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={addKeyContact}
              >
                + Add Contact
              </button>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating...
                  </>
                ) : (
                  'Create Client'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
