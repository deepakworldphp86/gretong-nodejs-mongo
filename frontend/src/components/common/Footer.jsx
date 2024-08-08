import React from "react";
import { Grid, Container, Typography, Box, Link } from '@mui/material';


const Footer = () => {
  return (
    <div>
      {
        <footer className="bg-dark text-center text-white mt-5">
          <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
            <Box sx={{ me: 5, display: { xs: 'none', lg: 'block' } }}>
              <Typography variant="body1">Get connected with us on social networks:</Typography>
            </Box>

            <Box>
              <Link href="#" color="inherit" className="me-4">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link href="#" color="inherit" className="me-4">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link href="#" color="inherit" className="me-4">
                <i className="fab fa-google"></i>
              </Link>
              <Link href="#" color="inherit" className="me-4">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link href="#" color="inherit" className="me-4">
                <i className="fab fa-linkedin"></i>
              </Link>
              <Link href="#" color="inherit" className="me-4">
                <i className="fab fa-github"></i>
              </Link>
            </Box>
          </section>

          <section>
            <Container maxWidth="lg" className="text-center text-md-start mt-5">
              <Grid container spacing={4}>
                <Grid item xs={12} md={3} lg={4}>
                  <Typography variant="h6" gutterBottom>
                    <i className="fas fa-gem me-3"></i>Company name
                  </Typography>
                  <Typography variant="body2">
                    Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet,
                    consectetur adipisicing elit.
                  </Typography>
                </Grid>

                <Grid item xs={6} md={2} lg={2}>
                  <Typography variant="h6" gutterBottom>
                    Products
                  </Typography>
                  <Typography variant="body2">
                    <Link href="#" color="inherit" underline="hover">Angular</Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link href="#" color="inherit" underline="hover">React</Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link href="#" color="inherit" underline="hover">Vue</Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link href="#" color="inherit" underline="hover">Laravel</Link>
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3} lg={2}>
                  <Typography variant="h6" gutterBottom>
                    Useful links
                  </Typography>
                  <Typography variant="body2">
                    <Link href="#" color="inherit" underline="hover">Pricing</Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link href="#" color="inherit" underline="hover">Settings</Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link href="#" color="inherit" underline="hover">Orders</Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link href="#" color="inherit" underline="hover">Help</Link>
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                  <Typography variant="h6" gutterBottom>
                    Contact
                  </Typography>
                  <Typography variant="body2">
                    <i className="fas fa-home me-3"></i> New York, NY 10012, US
                  </Typography>
                  <Typography variant="body2">
                    <i className="fas fa-envelope me-3"></i> info@example.com
                  </Typography>
                  <Typography variant="body2">
                    <i className="fas fa-phone me-3"></i> + 01 234 567 88
                  </Typography>
                  <Typography variant="body2">
                    <i className="fas fa-print me-3"></i> + 01 234 567 89
                  </Typography>
                </Grid>
              </Grid>
            </Container>
          </section>

          <Box className="text-center p-4 footer-copyrigh">
            <Typography variant="body2">
              © {new Date().getFullYear()} Copyright:
              <Link href="https://mdbootstrap.com/" color="inherit" underline="hover" className="fw-bold">MDBootstrap.com</Link>
            </Typography>
          </Box>
        </footer>


      }
    </div>
  );
};
export default Footer;