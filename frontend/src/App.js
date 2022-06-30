import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ShowData from "./components/ShowData";
import NavbarMenu from "./components/NavbarMenu";
import Login from "./components/Login";
import MyOrders from "./components/tables/MyOrders";
import NewOrder from "./components/NewOrder";
import { useEffect } from "react";
import { getMyOrders } from "./components/functions/Functions";
import Dashboard from "./components/Dashboard";
import NewClients from "./components/NewClients";
import ProductsCRUD from "./CrudProducts/ProductsCRUD";
import EditProduct from "./CrudProducts/EditProduct";
import AddProduct from "./CrudProducts/AddProduct";
import CategoriesCRUD from "./CrudCategories/CategoriesCRUD";
import AddCategory from "./CrudCategories/AddCategory";
import EditCategory from "./CrudCategories/EditCategory";

function App() {
  const { loggedIn, username } = useSelector((state) => state.user_store);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      username === "" &&
      localStorage.getItem("jwt") &&
      localStorage.getItem("user")
    ) {
      dispatch({
        type: "user/username",
        payload: localStorage.getItem("user"),
      });
      dispatch({
        type: "user/jwt",
        payload: localStorage.getItem("jwt"),
      });
      getOrders();
    }
  }, []);

  async function getOrders() {
    let result = "";

    try {
      result = await getMyOrders(
        localStorage.getItem("jwt"),
        localStorage.getItem("user")
      );

      if (result !== "error" && result !== "") {
        dispatch({ type: "orders/clearOrders" });
        dispatch({ type: "orders/setOrders", payload: result.data });
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="App">
      <NavbarMenu />
      {loggedIn ? (
        <Routes>
          <Route path="/all-data" element={<ShowData />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/login" element={<ShowData />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-clients" element={<NewClients />} />
          <Route path="/products" element={<ProductsCRUD />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/categories" element={<CategoriesCRUD />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/edit-category/:id" element={<EditCategory />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/all-data" element={<Login />} />
          <Route path="/my-orders" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-order" element={<Login />} />
          <Route path="/dashboard" element={<Login />} />
          <Route path="/new-clients" element={<Login />} />
          <Route path="/products" element={<Login />} />
          <Route path="/edit-product/:id" element={<Login />} />
          <Route path="/add-product" element={<Login />} />
          <Route path="/categories" element={<Login />} />
          <Route path="/add-category" element={<Login />} />
          <Route path="/edit-category/:id" element={<Login />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
