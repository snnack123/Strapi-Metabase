import { useEffect, useState } from "react";
import { makeFetch } from "../utils/Api";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import Categories from "./tables/Categories";
import Products from "./tables/Products";

const ShowData = () => {
  const { loggedIn, tryLogin, jwt } = useSelector((state) => state.user_store);
  const { collection, data, newOrder, categories } = useSelector(
    (state) => state.products_store
  );
  const [coll, setColl] = useState("");

  const dispatch = useDispatch();

  const setCollection = (data) => {
    dispatch({ type: "products/collection", payload: data });
  };

  useEffect(() => {
    if (newOrder === true) {
      dispatch({ type: "products/newOrder", payload: false });
    }

    try {
      if (localStorage.getItem("jwt")) {
        dispatch({ type: "user/jwt", payload: localStorage.getItem("jwt") });
        dispatch({ type: "user/tryLogin", payload: true });
        dispatch({ type: "user/loggedIn", payload: true });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  function checkLoggedIn() {
    if (localStorage.getItem("jwt")) {
      return true;
    }
    return false;
  }

  function getData(e) {
    if (checkLoggedIn() === true) {
      dispatch({ type: "products/clearData" });
      setCollection(coll);

      makeFetch.method = "POST";
      makeFetch.headers.Authorization = jwt;
      if (makeFetch.body) delete makeFetch.body;

      let populate = "";

      if (coll === "categories") {
        populate = "products";
      } else {
        populate = "categories";
      }

      fetch(`http://localhost:1337/api/${coll}?populate[0]=${populate}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.data !== null && res.data.length > 0) {
            if (coll === "products") {
              dispatch({ type: "products/setData", payload: res.data });
            } else if (coll === "categories") {
              dispatch({ type: "products/setCategories", payload: res.data });
            }
          }

          if (res.error) {
            throw new Error("Something went wrong!");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      logout(e);
    }
  }

  function logout(e) {
    e.preventDefault();

    dispatch({ type: "user/tryLogin", payload: false });
    dispatch({ type: "user/loggedIn", payload: false });
    dispatch({ type: "products/clearData" });
    dispatch({ type: "user/username", payload: "" });
    dispatch({ type: "user/password", payload: "" });
    dispatch({ type: "user/jwt", payload: "" });
    dispatch({ type: "products/collection", payload: "" });
    if (localStorage.getItem("jwt")) {
      localStorage.removeItem("jwt");
    }
  }

  return (
    <div>
      <div className="allData">
        {!tryLogin ? (
          <p></p>
        ) : loggedIn ? (
          <div>
            <div className="coll_name">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicUser">
                  <Form.Label>Collection name</Form.Label>

                  <select
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setColl(e.target.value);
                      } else {
                        setColl("");
                        dispatch({
                          type: "products/collection",
                          payload: e.target.value,
                        });
                      }
                    }}
                  >
                    <option />
                    <option value="products">Products</option>
                    <option value="categories">Categories</option>
                  </select>
                </Form.Group>

                <Button
                  variant="secondary"
                  onClick={(e) => {
                    if (coll !== "") getData(e);
                  }}
                >
                  Search
                </Button>
              </Form>
            </div>
            <div>
              {/* {data.length > 0 && collection === "categories" ? (
                <Categories />
              ) : data.length > 0 && collection === "products" ? (
                <Products />
              ) : (
                <p></p>
              )} */}

              {categories.length > 0 && collection === "categories" ? (
                <Categories />
              ) : (
                <p></p>
              )}

              {data.length > 0 && collection === "products" ? (
                <Products />
              ) : (
                <p></p>
              )}
            </div>
          </div>
        ) : (
          <p>Oh, no!</p>
        )}
      </div>
    </div>
  );
};

export default ShowData;
