module.exports = {
  routes: [
    {
      method: "POST",
      path: "/order",
      handler: "order.createOrder",
    },
    {
      method: "GET",
      path: "/dashboard",
      handler: "order.getDashboard",
    },
    {
      method: "POST",
      path: "/order/checkToken",
      handler: "order.checkToken",
    },
  ],
};
