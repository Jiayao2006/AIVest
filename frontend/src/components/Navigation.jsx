import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    {
      path: '/',
      icon: 'bi-house-fill',
      label: 'Home',
      description: 'Client Dashboard'
    },
    {
      path: '/calls',
      icon: 'bi-telephone-fill',
      label: 'Calls',
      description: 'Call Management'
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="mb-4">
      <div className="bg-white rounded-3 shadow-sm border">
        {/* Desktop Navigation */}
        <div className="d-none d-lg-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-circle p-2 me-3">
              <i className="bi bi-briefcase-fill text-white fs-5"></i>
            </div>
            <div>
              <h1 className="h4 fw-bold text-dark mb-0">AIVest</h1>
              <p className="text-muted small mb-0">Relationship Manager Platform</p>
            </div>
          </div>
          
          <div className="d-flex gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`btn d-flex align-items-center gap-2 px-3 py-2 ${
                    isActive 
                      ? 'btn-primary' 
                      : 'btn-outline-secondary'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  <i className={`${item.icon} ${isActive ? 'text-white' : 'text-primary'}`}></i>
                  <div className="text-start">
                    <div className={`fw-semibold ${isActive ? 'text-white' : 'text-dark'}`}>
                      {item.label}
                    </div>
                    <div className={`small ${isActive ? 'text-white-50' : 'text-muted'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="d-lg-none">
          {/* Mobile Header */}
          <div className="d-flex align-items-center justify-content-between p-3">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle p-2 me-3">
                <i className="bi bi-briefcase-fill text-white fs-6"></i>
              </div>
              <div>
                <h1 className="h5 fw-bold text-dark mb-0">AIVest</h1>
                <p className="text-muted small mb-0">RM Platform</p>
              </div>
            </div>
            
            {/* Hamburger Menu Button */}
            <button
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
              onClick={toggleMenu}
              style={{ width: '44px', height: '44px' }}
            >
              <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                style={{ zIndex: 1040 }}
                onClick={closeMenu}
              ></div>
              
              {/* Menu Panel */}
              <div 
                className="position-fixed top-0 end-0 h-100 bg-white shadow-lg border-start"
                style={{ width: '280px', zIndex: 1050 }}
              >
                <div className="p-3 border-bottom bg-primary text-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-briefcase-fill me-2 fs-5"></i>
                      <div>
                        <div className="fw-bold">AIVest</div>
                        <small className="opacity-75">Navigation Menu</small>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="d-grid gap-2">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`btn text-start p-3 ${
                            isActive 
                              ? 'btn-primary' 
                              : 'btn-outline-secondary'
                          }`}
                          style={{ textDecoration: 'none' }}
                          onClick={closeMenu}
                        >
                          <div className="d-flex align-items-center">
                            <i className={`${item.icon} me-3 fs-5 ${isActive ? 'text-white' : 'text-primary'}`}></i>
                            <div>
                              <div className={`fw-semibold ${isActive ? 'text-white' : 'text-dark'}`}>
                                {item.label}
                              </div>
                              <div className={`small ${isActive ? 'text-white-50' : 'text-muted'}`}>
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  
                  <hr className="my-4" />
                  
                  {/* Additional Menu Items */}
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-secondary text-start p-3">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-gear me-3 fs-5 text-secondary"></i>
                        <div>
                          <div className="fw-semibold text-dark">Settings</div>
                          <div className="small text-muted">App preferences</div>
                        </div>
                      </div>
                    </button>
                    
                    <button className="btn btn-outline-secondary text-start p-3">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-question-circle me-3 fs-5 text-secondary"></i>
                        <div>
                          <div className="fw-semibold text-dark">Help</div>
                          <div className="small text-muted">Support & guides</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="position-absolute bottom-0 start-0 end-0 p-3 border-top bg-light">
                  <div className="text-center small text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    Secure Banking Platform
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
