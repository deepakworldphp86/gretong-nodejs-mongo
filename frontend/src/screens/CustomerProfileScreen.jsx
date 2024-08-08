import React from 'react';
import Navigation from '../components/common/Navigation';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import homePageCss from '../public/styles/home.module.css'
import ProfilePage from '../components/customers/ProfilePage'; // Adjust the import path as needed

const CustomerProfileScreen = () => {
  return (
    <div className={homePageCss.wrapper}>
      <div className={homePageCss.content}>
        <Navigation />
        <div className="login-page">
          <ProfilePage />
        </div>
      </div>
      <Footer className={homePageCss.footer} />
    </div>
  );
};

export default CustomerProfileScreen;