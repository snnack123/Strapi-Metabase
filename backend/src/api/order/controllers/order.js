"use strict";

/**
 *  order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
var jwt = require("jsonwebtoken");

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async createOrder(ctx) {
    try {
      const { id } = await strapi.plugins[
        "users-permissions"
      ].services.jwt.getToken(ctx);

      if (id) {
        let data_to_send = ctx.request.body;
        data_to_send.users_permissions_user = id;

        console.log(data_to_send);

        return await strapi
          .service("api::order.order")
          .create({ data: data_to_send });
      }
    } catch (err) {
      ctx.body = err;
      console.log(err);
    }
  },

  async getDashboard() {
    let METABASE_SITE_URL = "https://gdm.metabaseapp.com";
    const METABASE_SECRET_KEY =
      "99e0264729ca6e62f2bee7db898d17ba8d65bb6dfc970c8cd32326abe6f16945";

    let payload = {
      resource: { dashboard: 4 },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };
    let token = jwt.sign(payload, METABASE_SECRET_KEY);

    let iframeUrl =
      METABASE_SITE_URL +
      "/embed/dashboard/" +
      token +
      "#bordered=true&titled=true";
    return { iframeUrl, token };
  },

  async checkToken(ctx) {
    const METABASE_SECRET_KEY =
      "99e0264729ca6e62f2bee7db898d17ba8d65bb6dfc970c8cd32326abe6f16945";

    return new Promise((resolve, rejected) => {
      jwt.verify(
        ctx.request.body.token,
        METABASE_SECRET_KEY,
        (err, decoded) => {
          if (err) {
            console.log(err);
            if (err.expiredAt) {
              rejected({ message: "Your token expired!" });
            } else {
              rejected({ message: "Decoding error!" });
            }
          } else {
            resolve({ result: decoded });
          }
        }
      );
    });
  },
}));
