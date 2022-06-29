"use strict";

/**
 *  order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const csv = require("csv-parser");
const fs = require("fs");
const csvToJson = require("csvtojson");

var jwt = require("jsonwebtoken");

const readCsvToJson = async (filePath) => {
  const csvData = await csvToJson().fromFile(filePath);
  return csvData;
};

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

  async addUsers(ctx) {
    // let csv_data = [];

    // fs.createReadStream(ctx.request.files.file.path)
    //   .pipe(csv())
    //   .on("data", async (data) => {
    //     csv_data.push(data);

    //     let new_user = {
    //       username: data.email.split("@")[0],
    //       password: "strapi",
    //       email: data.email,
    //       Age: data.Age,
    //       Name: data.Name,
    //     };

    //     const entity = await strapi.entityService.create(
    //       "plugin::users-permissions.user",
    //       { data: new_user }
    //     );

    //     results.push(entity);
    //   })
    //   .on("end", () => {
    //     console.log(results, "results");
    //   });
    const csvDataArray = await readCsvToJson(ctx.request.files.file.path);
    const results = await Promise.all(
      csvDataArray.map(async (data) => {
        let new_user = {
          username: data.email.split("@")[0],
          password: "strapi",
          email: data.email,
          Age: data.Age,
          Name: data.Name,
        };

        const entity = await strapi.entityService.create(
          "plugin::users-permissions.user",
          { data: new_user }
        );

        return entity;
      })
    );

    return results;
  },
}));
