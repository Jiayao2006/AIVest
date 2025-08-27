import React, { useState, useEffect } from 'react';

export default function CallCalendar({ scheduledCalls, onCallSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get first day of the month and number of days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // Generate calendar days
  const calendarDays = [];
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 42); // 6 weeks

  for (let day = new Date(startDate); day < endDate; day.setDate(day.getDate() + 1)) {
    calendarDays.push(new Date(day));
  }

  // Get calls for a specific date
  const getCallsForDate = (date) => {
    const dateString = date.toDateString();
    return scheduledCalls.filter(call => 
      call.type === 'scheduled' && 
      new Date(call.scheduledTime).toDateString() === dateString
    );
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const calls = getCallsForDate(date);
    if (calls.length > 0 && onCallSelect) {
      onCallSelect(calls);
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <i className="bi bi-calendar3 me-2"></i>
            Call Calendar
          </h5>
          <button className="btn btn-light btn-sm" onClick={goToToday}>
            Today
          </button>
        </div>
      </div>
      <div className="card-body p-0">
        {/* Calendar Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <button className="btn btn-outline-secondary btn-sm" onClick={goToPreviousMonth}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <h6 className="mb-0 fw-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h6>
          <button className="btn btn-outline-secondary btn-sm" onClick={goToNextMonth}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="row g-0 bg-light">
          {daysOfWeek.map(day => (
            <div key={day} className="col text-center py-2 border-end">
              <small className="fw-semibold text-muted">{day}</small>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {Array.from({ length: 6 }, (_, week) => (
            <div key={week} className="row g-0">
              {Array.from({ length: 7 }, (_, day) => {
                const dateIndex = week * 7 + day;
                const date = calendarDays[dateIndex];
                const calls = getCallsForDate(date);
                const hasCallsToday = calls.length > 0;

                return (
                  <div
                    key={dateIndex}
                    className={`col calendar-day border-end border-bottom p-2 ${
                      !isCurrentMonth(date) ? 'bg-light' : ''
                    } ${isSelected(date) ? 'bg-primary text-white' : ''} ${
                      hasCallsToday ? 'border-primary border-2' : ''
                    }`}
                    style={{ 
                      height: '80px', 
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className={`d-flex justify-content-between align-items-start h-100`}>
                      <span
                        className={`fw-semibold ${
                          isToday(date) ? 'bg-warning rounded-circle px-2 py-1 text-dark' : ''
                        } ${!isCurrentMonth(date) ? 'text-muted' : ''} ${
                          isSelected(date) ? 'text-white' : ''
                        }`}
                        style={{ fontSize: '14px' }}
                      >
                        {date.getDate()}
                      </span>
                      {hasCallsToday && (
                        <span className="badge bg-danger rounded-pill" style={{ fontSize: '10px' }}>
                          {calls.length}
                        </span>
                      )}
                    </div>
                    
                    {/* Call indicators */}
                    {hasCallsToday && (
                      <div className="position-absolute bottom-0 start-0 end-0 p-1">
                        {calls.slice(0, 2).map((call, index) => (
                          <div
                            key={call.id}
                            className="bg-primary text-white rounded small px-1 mb-1"
                            style={{ fontSize: '9px', lineHeight: '1.2' }}
                            title={`${call.clientName} - ${new Date(call.scheduledTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}`}
                          >
                            {call.clientName.split(' ')[0]}
                          </div>
                        ))}
                        {calls.length > 2 && (
                          <div className="text-center small text-muted" style={{ fontSize: '9px' }}>
                            +{calls.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="border-top p-3">
            <h6 className="mb-2">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h6>
            {getCallsForDate(selectedDate).length === 0 ? (
              <p className="text-muted mb-0 small">No calls scheduled</p>
            ) : (
              <div>
                {getCallsForDate(selectedDate).map((call) => (
                  <div
                    key={call.id}
                    className="d-flex justify-content-between align-items-center py-2 border-bottom"
                  >
                    <div>
                      <div className="fw-semibold">{call.clientName}</div>
                      <div className="small text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(call.scheduledTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        <span className="ms-2">
                          <i className="bi bi-tag me-1"></i>
                          {call.purpose}
                        </span>
                      </div>
                    </div>
                    <span className="badge bg-warning">Scheduled</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
