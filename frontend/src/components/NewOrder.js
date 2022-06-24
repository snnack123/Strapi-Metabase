import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../App.css";
import Products from "./tables/Products";
import { Button, Form } from "react-bootstrap";
import { makeFetch } from "../utils/Api";
import { setDataPOST } from "./functions/Functions";

const NewOrder = () => {
  const { data, newOrder, collection, cart, cartPrice } = useSelector(
    (state) => state.products_store
  );
  const { jwt } = useSelector((state) => state.user_store);
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (newOrder === false) {
      dispatch({ type: "products/newOrder", payload: true });
    }

    if (data.length < 1) {
      makeFetch.method = "GET";
      makeFetch.headers.authorization = `Bearer ${jwt}`;

      if (makeFetch.body) delete makeFetch.body;
      delete makeFetch.headers.Authorization;

      fetch(
        `http://localhost:1337/api/products?populate[0]=categories`,
        makeFetch
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.data !== null && res.data.length > 0) {
            dispatch({ type: "products/setData", payload: res.data });
            dispatch({ type: "products/collection", payload: "products" });
          }

          if (res.error) {
            throw new Error("Something went wrong!");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  function createOrder(e) {
    e.preventDefault();

    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let data_to_add = {
      Address: address,
      TotalPrice: cartPrice,
      OrderDate: setDataPOST(today),
      DeliveryDate: setDataPOST(tomorrow),
      products: cart,
    };

    console.log(data_to_add);

    makeFetch.method = "POST";
    makeFetch.body = JSON.stringify(data_to_add);
    makeFetch.headers.authorization = `Bearer ${jwt}`;

    if (makeFetch.headers.Authorization) delete makeFetch.headers.Authorization;

    console.log(makeFetch);

    fetch("http://localhost:1337/api/order", makeFetch)
      .then((res) => res.json())
      .then((res) => {
        if (res.data === null) {
          console.log(res);
        } else if (res.id) {
          console.log(res);
          dispatch({ type: "orders/newOrder", payload: res });
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <div className="allData">
        <h1 className="newOrder">Place a New Order</h1>
        <p style={{ fontWeight: "bold" }}>
          Choose what products you want to add to the cart:
        </p>
        {data && collection === "products" ? (
          <div>
            <div>
              <Products />
            </div>

            <Form>
              <Form.Group className="mb-3" controlId="formBasicUser">
                <Form.Label>Delivery Address</Form.Label>
                <Form.Control
                  type="address"
                  placeholder="Street Name, Floor number, Country, City etc. "
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
            </Form>

            <p>
              <span style={{ fontWeight: "bold" }}>Cart:</span> {cart.length}{" "}
              products
            </p>
            <p>Cost: {cartPrice} $</p>
            <Button
              variant="success"
              onClick={(e) => {
                createOrder(e);
              }}
            >
              Place the order
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default NewOrder;
