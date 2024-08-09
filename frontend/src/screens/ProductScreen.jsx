import React from 'react';
import Navigation from '../components/common/Navigation';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import homePageCss from '../public/styles/home.module.css'
import ProductDetailPage from '../components/product/ProductDetailPage'; // Adjust the import path as needed

const ProductListScreen = () => {
  return (
    <div className={homePageCss.wrapper}>
      <div className={homePageCss.content}>
        <Navigation />
        <div className="product-detail">
          <ProductDetailPage />
        </div>
      </div>
      <Footer className={homePageCss.footer} />
    </div>
  );
};

export default ProductListScreen;