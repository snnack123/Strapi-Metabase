// const qs = require("qs");

const makeFetch = {
  method: "GET",

  headers: {
    Accept: "application/json",

    "Content-Type": "application/json",
  },
};

// const queryAll = qs.stringify(
//   {
//     populate: ["categories"],
//   },
//   {
//     encodeValuesOnly: true,
//   }
// );

// export { makeFetch, queryAll };
export { makeFetch };
