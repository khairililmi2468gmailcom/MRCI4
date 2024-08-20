import React from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

function MainLayout({ children }) {
  return (
    <div>
      <Menu />
      <div className="wrapper d-flex flex-column min-vh-100">
        <Header />
        <div className="body flex-grow-1" style={{background:'transparent'}}>
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;