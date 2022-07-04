module.exports = {
  // * 0 */2 * * - 48 HOURS
  //*/10 * * * * * - 10 SEC

  "* 0 12 * *": async ({ strapi }) => {
    let findProducts;
    let msBetweenDates;
    let hoursBetweenDates;
    let dataThen = "";
    let dataNow = new Date();
    let results;
    let updateProduct;
    let data;

    try {
      findProducts = await strapi.service("api::product.product").find();
    } catch (e) {
      return console.log(e);
    }

    findProducts.results.forEach(async (product) => {
      if (product.counter > 0 && product.viewCounter !== null) {
        product.viewCounter.data.forEach(async (el) => {
          dataThen = new Date(el.attributes.timestamp);
          msBetweenDates = Math.abs(dataThen.getTime() - dataNow.getTime());
          hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

          if (hoursBetweenDates > 48) {
            results = product.viewCounter.data.filter(
              (view) => view.id !== el.id
            );

            try {
              if (JSON.stringify(results) === "[]") {
                data = {
                  counter: 0,
                  viewCounter: null,
                };

                updateProduct = await strapi
                  .service("api::product.product")
                  .update(product.id, { data: data });
              } else {
                data = {
                  counter: product.counter - 1,
                  viewCounter: {
                    data: results,
                  },
                };

                updateProduct = await strapi
                  .service("api::product.product")
                  .update(product.id, { data: data });
              }
            } catch (e) {
              return console.log(e);
            }
          }
        });
      }
    });
  },
};
