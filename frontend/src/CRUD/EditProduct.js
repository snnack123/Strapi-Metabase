import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../components/functions/Functions";
import { makeFetch } from "../utils/Api";

const EditProduct = () => {
  let { id } = useParams();
  const { jwt } = useSelector((state) => state.user_store);
  const { categories } = useSelector((state) => state.products_store);

  const [product, setProduct] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [category, setCategory] = useState("");
  const [final, setFinal] = useState(false);
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getProduct();
    }

    if (categories.length === 0) {
      getAllCategories();
    }
  }, []);

  async function getAllCategories() {
    let categ = await getCategories(jwt);

    if (categ !== "error" && categ !== "") {
      dispatch({ type: "products/setCategories", payload: categ.data });
    }
  }

  function getProduct() {
    makeFetch.method = "GET";
    makeFetch.headers.Authorization = "Bearer " + jwt;

    delete makeFetch.body;
    delete makeFetch.authorization;
    delete makeFetch.headers.authorization;

    fetch(
      `http://localhost:1337/api/products/${id}?populate[0]=categories&populate[1]=Photo`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setProduct(res.data);
          setTitle(res.data.attributes.title);
          setDescription(res.data.attributes.description);
          setPrice(res.data.attributes.price);
          setQty(res.data.attributes.qty);
          if (res.data.attributes.categories.data.length > 0) {
            setCategory(res.data.attributes.categories.data[0].attributes.name);
          }
        }

        if (res.error) {
          setMsg(res.error.message);
          setFinal(true);
        }
      });
  }

  function saveProduct(e) {
    e.preventDefault();

    makeFetch.method = "PUT";
    makeFetch.headers.Authorization = "Bearer " + jwt;
    delete makeFetch.authorization;
    delete makeFetch.headers.authorization;

    let myProduct = {
      data: {
        title,
        description,
        price,
        qty,
      },
    };

    if (product.attributes.categories.data.length > 0) {
      let productCategory =
        product.attributes.categories.data[0].attributes.name;
      if (productCategory === category) {
        if (productCategory === "") {
          delete myProduct.data.categories;
        } else {
          categories.forEach((item) => {
            if (item.attributes.name === category) {
              myProduct.data.categories = [item.id];
            }
          });
        }
      } else {
        categories.forEach((item) => {
          if (item.attributes.name === category) {
            myProduct.data.categories = [item.id];
          }
        });
      }
    } else {
      categories.forEach((item) => {
        if (item.attributes.name === category) {
          myProduct.data.categories = [item.id];
        }
      });
    }

    console.log(categories);

    console.log(myProduct);

    makeFetch.body = JSON.stringify(myProduct);

    fetch(`http://localhost:1337/api/products/${id}`, makeFetch)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setMsg("Product successfully updated");
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
        <div className="editProduct">
          {product ? (
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
              </Form.Group>

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
                {product.attributes.Photo.data !== null ? (
                  <div>
                    <img
                      src={`http://localhost:1337${product.attributes.Photo.data.attributes.url}`}
                      style={{
                        width: `${product.attributes.Photo.data.attributes.formats.small.width}px`,
                        height: `${product.attributes.Photo.data.attributes.formats.small.height}px`,
                      }}
                      alt="no_image"
                    />
                  </div>
                ) : (
                  <div>No image</div>
                )}
              </Form.Group>

              {!final ? (
                <div>
                  {" "}
                  <Button
                    variant="success"
                    type="submit"
                    onClick={(e) => saveProduct(e)}
                  >
                    Save
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
          ) : (
            <p></p>
          )}
          {final ? <p>{msg}</p> : <p></p>}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
