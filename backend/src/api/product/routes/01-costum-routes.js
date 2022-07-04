module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/product-update/:id",
      handler: "product.updateProduct",
    },
    {
      method: "POST",
      path: "/view-product/:id",
      handler: "product.updateCounter",
    },
  ],
};
