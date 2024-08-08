import React from 'react';
import Navigation from '../components/common/Navigation';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import homePageCss from '../public/styles/home.module.css'
import GretongCarousel from '../components/common/Carousel'; // Adjust the path based on where you saved the component
import GretongProductCrossSellCarousel from '../components/product/ProductSliderCrossSell'; // Adjust the path based on where you saved the component
import GretongNewProductCarousel from '../components/product/ProductSliderNew'; // Adjust the path based on where you saved the component
import GretongBestSellerProductCarousel from '../components/product/ProductSliderBestSeller'; // Adjust the path based on where you saved the component


const Layout = ({ children, home }) => {
  return (
    <div className={homePageCss.wrapper}>
      <div className={homePageCss.content}>
        <Navigation />
        <Header home={home} />
        <GretongCarousel />
        <GretongNewProductCarousel />
        <GretongProductCrossSellCarousel />
        <GretongBestSellerProductCarousel />

        <main className={homePageCss.main}>
          {children}
        </main>
        {!home && (
          <div className={homePageCss.backToHome}>

          </div>
        )}
      </div>
      <Footer className={homePageCss.footer} />
    </div>
  );
};

export default Layout;
