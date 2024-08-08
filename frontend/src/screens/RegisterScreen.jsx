import React from 'react';
import Navigation from '../components/common/Navigation';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import homePageCss from '../public/styles/home.module.css'
import RegisterForm from '../components/customers/RegisterForm'; // Adjust the import path as needed

const RegisterScreen = () => {
  return (
    <div className={homePageCss.wrapper}>
      <div className={homePageCss.content}>
        <Navigation />
        <div className="register-page">
          <RegisterForm />
        </div>
      </div>
      <Footer className={homePageCss.footer} />
    </div>
  );
};

export default RegisterScreen;