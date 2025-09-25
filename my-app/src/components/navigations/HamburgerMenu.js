import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavigation = (path, state = null) => {
    if (state) {
      history.push(path, state);
    } else {
      history.push(path);
    }
    closeMenu();
  };

  // Styles
  const hamburgerStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1001,
    width: '50px',
    height: '50px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  };

  const lineStyle = {
    width: '25px',
    height: '3px',
    backgroundColor: 'white',
    borderRadius: '1.5px',
    transition: 'all 0.3s ease'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isOpen ? 'block' : 'none',
    zIndex: 998
  };

  const menuStyle = {
    position: 'fixed',
    top: 0,
    left: isOpen ? '0' : '-300px',
    width: '280px',
    height: '100vh',
    backgroundColor: 'white',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
    transition: 'left 0.3s ease',
    zIndex: 1000,
    overflowY: 'auto'
  };

  const menuHeaderStyle = {
    padding: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    width: '30px',
    height: '30px'
  };

  const menuItemStyle = {
    display: 'block',
    padding: '15px 20px',
    color: '#333',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.3s ease'
  };

  return (
    <>
      {/* Hamburger Button */}
      <button style={hamburgerStyle} onClick={toggleMenu}>
        <span style={lineStyle}></span>
        <span style={lineStyle}></span>
        <span style={lineStyle}></span>
      </button>

      {/* Overlay */}
      <div style={overlayStyle} onClick={closeMenu}></div>
      
      {/* Menu */}
      <nav style={menuStyle}>
        <div style={menuHeaderStyle}>
          <h3 style={{margin: 0, fontSize: '18px'}}>Risk Assessment</h3>
          <button style={closeButtonStyle} onClick={closeMenu}>&times;</button>
        </div>
        
        <div style={{padding: '20px 0'}}>
          <div 
            style={menuItemStyle}
            onClick={() => handleNavigation('/risk-assessment/')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            📁 Risk Assessment
          </div>
          <div 
            style={menuItemStyle}
            onClick={() => handleNavigation('/documentation')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            📚 Documentation
          </div>
          
          <div 
            style={menuItemStyle}
            onClick={() => handleNavigation('/gap-assessment')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            📈 Gap Assessment
          </div>
        </div>
      </nav>
    </>
  );
};

export default HamburgerMenu;
