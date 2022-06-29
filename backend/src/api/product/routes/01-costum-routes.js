module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/product-update/:id",
      handler: "product.updateProduct",
    },
  ],
};
