import React from 'react';
import { Carousel } from 'react-bootstrap';
import { useQuery, gql } from '@apollo/client';
import { GET_SLIDER_IMAGES } from '../../services/graphql/query/slider';


const GretongCarousel = () => {
  const { loading, error, data } = useQuery(GET_SLIDER_IMAGES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Carousel fade>
      {data.listSliderImages.map((image) => (
        <Carousel.Item key={image.id}>
          <img
            className="d-block w-100"
            src={image.childSliderImage}
            alt={image.sliderTitle || 'Slide Image'}
          />
          <Carousel.Caption>
            <h5>{image.sliderTitle || 'Slide Title'}</h5>
            <p>{image.sliderText || 'Slide Description'}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default GretongCarousel;
