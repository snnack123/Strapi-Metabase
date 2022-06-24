import { makeFetch } from "../../utils/Api";

export function getMyOrders(jwt, username) {
  makeFetch.method = "GET";
  makeFetch.headers.Authorization = "Bearer " + jwt;

  delete makeFetch.body;
  delete makeFetch.authorization;
  delete makeFetch.headers.authorization;

  return fetch(
    `http://localhost:1337/api/orders?filters[users_permissions_user][username][$eq]=${username}&populate[0]=products&populate[1]=users_permissions_user`,
    makeFetch
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        return "error";
      } else {
        return res;
      }
    });
}

export function setDate(date) {
  let day = new Date(date).getDay();
  let month = new Date(date).getMonth();
  let year = new Date(date).getFullYear();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  let new_date = day + "." + month + "." + year;

  return new_date;
}

export function setDataPOST(date) {
  let day = new Date(date).getDay();
  let month = new Date(date).getMonth();
  let year = new Date(date).getFullYear();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  let new_date = year + "-" + month + "-" + day;

  return new_date;
}
