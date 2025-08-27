import React, { useState } from 'react';

export default function SendMessageModal({ show, onHide, client, onSend }) {
  const [formData, setFormData] = useState({
    messageType: 'email',
    priority: 'normal',
    subject: '',
    message: '',
    attachments: '',
    sendCopy: true,
    scheduleFor: '',
    template: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messageTemplates = {
    'portfolio-update': {
      subject: 'Portfolio Performance Update',
      message: 'Dear {{clientName}},\n\nI hope this message finds you well. I wanted to provide you with an update on your portfolio performance...\n\nBest regards,\n[Your Name]'
    },
    'market-insights': {
      subject: 'Market Insights and Opportunities',
      message: 'Dear {{clientName}},\n\nI wanted to share some important market insights that may be relevant to your investment strategy...\n\nBest regards,\n[Your Name]'
    },
    'meeting-followup': {
      subject: 'Follow-up from Our Recent Meeting',
      message: 'Dear {{clientName}},\n\nThank you for taking the time to meet with me. As discussed, I wanted to follow up on...\n\nBest regards,\n[Your Name]'
    },
    'appointment-reminder': {
      subject: 'Upcoming Appointment Reminder',
      message: 'Dear {{clientName}},\n\nThis is a friendly reminder about our upcoming appointment scheduled for...\n\nBest regards,\n[Your Name]'
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTemplateChange = (e) => {
    const templateKey = e.target.value;
    if (templateKey && messageTemplates[templateKey]) {
      const template = messageTemplates[templateKey];
      setFormData(prev => ({
        ...prev,
        template: templateKey,
        subject: template.subject,
        message: template.message.replace('{{clientName}}', client.name)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        template: '',
        subject: '',
        message: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const messageData = {
        ...formData,
        clientId: client.id,
        clientName: client.name,
        sentAt: new Date().toISOString(),
        status: formData.scheduleFor ? 'scheduled' : 'sent'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSend(messageData);
      
      // Reset form
      setFormData({
        messageType: 'email',
        priority: 'normal',
        subject: '',
        message: '',
        attachments: '',
        sendCopy: true,
        scheduleFor: '',
        template: ''
      });
      
      onHide();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show || !client) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-chat-dots-fill me-2 text-info"></i>
              Send Message to {client.name}
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Message Type</label>
                  <select
                    className="form-select"
                    name="messageType"
                    value={formData.messageType}
                    onChange={handleChange}
                  >
                    <option value="email">📧 Email</option>
                    <option value="sms">📱 SMS</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="internal">📝 Internal Note</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="normal">🟡 Normal</option>
                    <option value="high">🟠 High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
                
                <div className="col-12">
                  <label className="form-label">Template (Optional)</label>
                  <select
                    className="form-select"
                    value={formData.template}
                    onChange={handleTemplateChange}
                  >
                    <option value="">Select a template...</option>
                    <option value="portfolio-update">Portfolio Update</option>
                    <option value="market-insights">Market Insights</option>
                    <option value="meeting-followup">Meeting Follow-up</option>
                    <option value="appointment-reminder">Appointment Reminder</option>
                  </select>
                </div>
                
                {formData.messageType === 'email' && (
                  <div className="col-12">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter email subject"
                      required
                    />
                  </div>
                )}
                
                <div className="col-12">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-control"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Type your message here..."
                    required
                  />
                  <div className="form-text">
                    Characters: {formData.message.length}
                    {formData.messageType === 'sms' && formData.message.length > 160 && 
                      <span className="text-warning"> (SMS messages over 160 characters may be split)</span>
                    }
                  </div>
                </div>
                
                {formData.messageType === 'email' && (
                  <div className="col-12">
                    <label className="form-label">Attachments</label>
                    <input
                      type="text"
                      className="form-control"
                      name="attachments"
                      value={formData.attachments}
                      onChange={handleChange}
                      placeholder="portfolio.pdf, market_report.xlsx (comma separated)"
                    />
                  </div>
                )}
                
                <div className="col-md-6">
                  <label className="form-label">Schedule for Later (Optional)</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="scheduleFor"
                    value={formData.scheduleFor}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                
                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="sendCopy"
                      checked={formData.sendCopy}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Send copy to myself
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-info"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    {formData.scheduleFor ? 'Schedule Message' : 'Send Message'}
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
