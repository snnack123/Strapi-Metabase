import React, { useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "./functions/Functions";

export default function NavbarMenu() {
  const { loggedIn, jwt, username } = useSelector((state) => state.user_store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
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
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
    }
    if (localStorage.getItem("dash-token")) {
      localStorage.removeItem("dash-token");
    }
    navigate("/");
  }

  async function getOrders(e) {
    e.preventDefault();

    let result = "";

    try {
      result = await getMyOrders(jwt, username);

      if (result !== "error" && result !== "") {
        dispatch({ type: "orders/clearOrders" });
        dispatch({ type: "orders/setOrders", payload: result.data });
        navigate("/my-orders");
      }
    } catch (e) {
      console.log(e);
    }
  }

  function login() {
    navigate("/login");
  }

  function getAllData() {
    navigate("/all-data");
  }

  function newOrder() {
    navigate("/new-order");
  }

  function getDashboard() {
    navigate("/dashboard");
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Strapi Project</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {loggedIn ? (
                <Nav.Link onClick={() => getAllData()}>All Data</Nav.Link>
              ) : (
                <p></p>
              )}

              {loggedIn ? (
                <Nav.Link onClick={(e) => getOrders(e)}>My Orders</Nav.Link>
              ) : (
                <p></p>
              )}

              {loggedIn ? (
                <Nav.Link onClick={(e) => newOrder(e)}>New Order</Nav.Link>
              ) : (
                <p></p>
              )}

              {loggedIn ? (
                <Nav.Link onClick={(e) => getDashboard(e)}>Dashboard</Nav.Link>
              ) : (
                <p></p>
              )}
            </Nav>
            <Nav>
              {loggedIn ? (
                <Nav.Link onClick={(e) => logout(e)}>Logout</Nav.Link>
              ) : (
                <Nav.Link onClick={() => login()}>Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
