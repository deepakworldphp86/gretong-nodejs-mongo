// utils/getToken.js
export const getToken = () => {
    // Retrieve and parse userInfo from localStorage
    const userInfoString = localStorage.getItem('userInfo');
    let userInfo = null;
  
    // Parse the string into an object if it exists
    if (userInfoString) {
      try {
        userInfo = JSON.parse(userInfoString);
      } catch (error) {
        console.error('Error parsing userInfo from localStorage:', error);
      }
    }
  
    // Return the token if it exists, or an empty string otherwise
    return userInfo && userInfo.loginUser ? userInfo.loginUser.token || '' : '';
  };
  