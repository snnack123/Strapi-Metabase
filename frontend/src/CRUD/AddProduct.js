import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { getCategories } from "../components/functions/Functions";

const AddProduct = () => {
  const { categories } = useSelector((state) => state.products_store);
  const { jwt } = useSelector((state) => state.user_store);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState("");
  const [final, setFinal] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getCategoriesList();
  }, []);

  async function getCategoriesList() {
    if (categories.length === 0) {
      let categ = await getCategories(jwt);

      if (categ !== "error" && categ !== "") {
        dispatch({ type: "products/setCategories", payload: categ.data });
      }
    }
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function addProduct(e) {
    e.preventDefault();

    let formData = new FormData();

    let new_product = {
      title,
      description,
      price,
      qty,
    };

    categories.forEach((item) => {
      if (item.attributes.name === category) {
        new_product.categories = [item.id];
      }
    });

    formData.append("data", JSON.stringify(new_product));
    formData.append("files.Photo", photo[0]);

    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
      redirect: "follow",
    };

    fetch(`http://localhost:1337/api/products`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setMsg("Product successfully created");
          setFinal(true);
          dispatch({ type: "products/clearData" });
        }

        if (res.error) {
          setMsg(res.error.message);
          setFinal(true);
        }
      });
  }

  function goToProductsList() {
    navigate("/products");
  }

  return (
    <div>
      <div className="allData">
        <h1 className="newOrder">Add a new Product</h1>
        <div className="editProduct">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Quantity"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <select
                  style={{ marginLeft: "5px" }}
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setCategory(e.target.value);
                    } else {
                      setCategory("");
                    }
                  }}
                  value={category}
                >
                  <option />
                  {categories ? (
                    categories.map((item, i) => (
                      <option value={item.attributes.id} key={i}>
                        {item.attributes.name}
                      </option>
                    ))
                  ) : (
                    <option></option>
                  )}
                </select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Photo</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setPhoto(e.target.files)}
                />
                {(photo || {}).src}
                {photo?.[0] ? (
                  <img
                    src={URL.createObjectURL(photo[0])}
                    alt=""
                    width="500px"
                    height="auto"
                  />
                ) : null}
              </Form.Group>
            </Form.Group>

            {!final ? (
              <div>
                <Button variant="success" onClick={(e) => addProduct(e)}>
                  Add the Product
                </Button>
                <Button
                  variant="danger"
                  type="submit"
                  onClick={() => goToProductsList()}
                  style={{ marginLeft: "5px" }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                type="submit"
                onClick={() => goToProductsList()}
                style={{ marginLeft: "5px" }}
              >
                Back to Products List
              </Button>
            )}
          </Form>
          {final ? <p>{msg}</p> : <p></p>}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
