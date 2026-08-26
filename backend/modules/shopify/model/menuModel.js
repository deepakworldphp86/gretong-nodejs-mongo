const shopifyClient = require("../helper/shopifyClient");
const { MENU_QUERY } = require("../graphql/menu");

const getShopifyMenu = async (handle = "main-menu") => {
  try {
    const { data, errors } = await shopifyClient.request(MENU_QUERY, {
      variables: {
        handle,
      },
    });

    if (errors?.length) {
      console.error("Shopify GraphQL errors:", errors);

      throw new Error("Failed to fetch Shopify menu");
    }

    return data?.menu || null;
  } catch (error) {
    console.error("getShopifyMenu error:", error);
    throw error;
  }
};

module.exports = {
  getShopifyMenu,
};
