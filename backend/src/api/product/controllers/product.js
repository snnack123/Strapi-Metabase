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
}));
