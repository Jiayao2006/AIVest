import React, { useState } from 'react';

export default function ScheduleCallModal({ show, onHide, client, onSchedule }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '30',
    purpose: '',
    agenda: '',
    participants: '',
    meetingType: 'video',
    reminderBefore: '15'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const callData = {
        ...formData,
        clientId: client.id,
        clientName: client.name,
        scheduledAt: new Date().toISOString(),
        status: 'scheduled'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSchedule(callData);
      
      // Reset form
      setFormData({
        date: '',
        time: '',
        duration: '30',
        purpose: '',
        agenda: '',
        participants: '',
        meetingType: 'video',
        reminderBefore: '15'
      });
      
      onHide();
    } catch (error) {
      console.error('Error scheduling call:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show || !client) return null;

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-telephone-fill me-2 text-primary"></i>
              Schedule Call with {client.name}
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Time *</label>
                  <input
                    type="time"
                    className="form-control"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Duration</label>
                  <select
                    className="form-select"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Meeting Type</label>
                  <select
                    className="form-select"
                    name="meetingType"
                    value={formData.meetingType}
                    onChange={handleChange}
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
                
                <div className="col-12">
                  <label className="form-label">Purpose/Topic *</label>
                  <select
                    className="form-select"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Purpose</option>
                    <option value="portfolio-review">Portfolio Review</option>
                    <option value="investment-planning">Investment Planning</option>
                    <option value="risk-assessment">Risk Assessment</option>
                    <option value="performance-update">Performance Update</option>
                    <option value="new-opportunities">New Opportunities</option>
                    <option value="market-outlook">Market Outlook</option>
                    <option value="estate-planning">Estate Planning</option>
                    <option value="tax-planning">Tax Planning</option>
                    <option value="regular-checkin">Regular Check-in</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="col-12">
                  <label className="form-label">Agenda/Notes</label>
                  <textarea
                    className="form-control"
                    name="agenda"
                    value={formData.agenda}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Meeting agenda, topics to discuss, documents to review..."
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Additional Participants</label>
                  <input
                    type="text"
                    className="form-control"
                    name="participants"
                    value={formData.participants}
                    onChange={handleChange}
                    placeholder="colleagues, family members..."
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Reminder</label>
                  <select
                    className="form-select"
                    name="reminderBefore"
                    value={formData.reminderBefore}
                    onChange={handleChange}
                  >
                    <option value="5">5 minutes before</option>
                    <option value="15">15 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                    <option value="1440">1 day before</option>
                  </select>
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
                    Scheduling...
                  </>
                ) : (
                  <>
                    <i className="bi bi-calendar-plus me-2"></i>
                    Schedule Call
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
