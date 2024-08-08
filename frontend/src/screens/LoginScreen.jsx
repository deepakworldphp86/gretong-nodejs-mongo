import React from 'react';
import Navigation from '../components/common/Navigation';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import homePageCss from '../public/styles/home.module.css'
import LoginForm from '../components/customers/LoginForm'; // Adjust the import path as needed

const LoginScreen = () => {
  return (
    <div className={homePageCss.wrapper}>
      <div className={homePageCss.content}>
        <Navigation />
        <div className="login-page">
          <LoginForm />
        </div>
      </div>
      <Footer className={homePageCss.footer} />
    </div>
  );
};

export default LoginScreen;