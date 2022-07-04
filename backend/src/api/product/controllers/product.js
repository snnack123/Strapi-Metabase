"use strict";

/**
 *  product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async updateProduct(ctx) {
    let productId = ctx.params.id;
    let data;
    let updateProduct;
    let updateError = false;

    if (JSON.stringify(ctx.request.body.data) !== "{}") {
      data = JSON.parse(ctx.request.body.data);
    } else {
      data = {};
    }

    if (ctx.request.files["files.Photo"] !== undefined) {
      let photo = ctx.request.files;

      let savedPhoto;
      try {
        savedPhoto = await strapi.plugins["upload"].services.upload.upload({
          data: {},
          files: photo["files.Photo"],
        });
      } catch (e) {
        updateError = true;
        console.log(e);
        return ctx.response.badRequest(
          "Problems while adding the photo",
          e.message
        );
      }

      if (savedPhoto !== undefined) {
        data.Photo = [savedPhoto[0].id];
      }
    }

    if (!updateError) {
      try {
        updateProduct = await strapi
          .service("api::product.product")
          .update(productId, { data: data });
      } catch (e) {
        return ctx.response.badRequest("Problems while updating the data", e);
      }

      if (updateProduct.id) {
        return updateProduct;
      }
    }
  },
  async updateCounter(ctx) {
    let productId = ctx.params.id;
    let counter = Number(ctx.request.body.counter);
    let timestamp = ctx.request.body.timestamp;
    let clientIP = ctx.request.ip;
    let toUpdate = false;

    let updateProduct;
    let findProduct;
    let data;

    try {
      findProduct = await strapi
        .service("api::product.product")
        .findOne(productId);
    } catch (e) {
      return ctx.response.badRequest("Problems while finding the data", e);
    }

    if (findProduct.viewCounter !== null) {
      findProduct.viewCounter.data.forEach((el) => {
        if (el.attributes.ip === clientIP) {
          const then = new Date(timestamp);
          const now = new Date();

          const msBetweenDates = Math.abs(then.getTime() - now.getTime());
          const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

          if (hoursBetweenDates < 24) {
            return ctx.response.badRequest(
              `You already saw this product. You must wait ${hoursBetweenDates} hours.`
            );
          } else {
            toUpdate = true;
            data = {
              counter: counter + 1,
              viewCounter: {
                data: [
                  ...findProduct.viewCounter.data,
                  {
                    id: counter + 1,
                    attributes: { timestamp: timestamp, ip: clientIP },
                  },
                ],
              },
            };
          }
        }
      });
    } else {
      toUpdate = true;
      data = {
        counter: counter + 1,
        viewCounter: {
          data: [
            {
              id: counter + 1,
              attributes: { timestamp: timestamp, ip: clientIP },
            },
          ],
        },
      };
    }

    if (toUpdate) {
      try {
        updateProduct = await strapi
          .service("api::product.product")
          .update(productId, { data: data });
      } catch (e) {
        return ctx.response.badRequest("Problems while updating the data", e);
      }

      return updateProduct;
    }
  },
}));
