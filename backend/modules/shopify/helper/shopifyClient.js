const { createStorefrontApiClient } = require("@shopify/storefront-api-client");

const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.SHOPIFY_API_VERSION,
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
});

module.exports = shopifyClient;
