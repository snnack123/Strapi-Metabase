import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../components/functions/Functions";
import { makeFetch } from "../utils/Api";

const ViewProduct = () => {
  let { id } = useParams();
  const { jwt } = useSelector((state) => state.user_store);
  const { categories } = useSelector((state) => state.products_store);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [product, setProduct] = useState();
  const [category, setCategory] = useState("");
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      console.log(id);
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

  function incrementCounter(id, counter) {
    let timestamp = new Date().getTime();

    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ counter, timestamp }),
      redirect: "follow",
    };

    fetch(`http://localhost:1337/api/view-product/${id}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setMsg(res.error.message);
        }

        if (res.data) {
          setMsg("Counter updated");
        }
      })
      .catch((e) => console.log(e));
  }

  function getProduct() {
    makeFetch.method = "GET";
    makeFetch.headers.Authorization = "Bearer " + jwt;

    delete makeFetch.body;
    delete makeFetch.authorization;
    delete makeFetch.headers.authorization;

    fetch(
      `http://localhost:1337/api/products/${id}?populate[0]=categories&populate[1]=Photo`,
      makeFetch
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

          incrementCounter(id, res.data.attributes.counter);
        }

        if (res.error) {
          setMsg(res.error.message);
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
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                  type="text"
                  id="title"
                  name="title"
                  placeholder="title"
                  value={title}
                  disabled={true}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={description}
                  disabled={true}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="price">Price</Form.Label>
                <Form.Control
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={price}
                  disabled={true}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="qty">Quantity</Form.Label>
                <Form.Control
                  type="number"
                  id="qty"
                  name="qty"
                  placeholder="Quantity"
                  value={qty}
                  disabled={true}
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
                  disabled={true}
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
                        width: `500px`,
                      }}
                      alt="no_image"
                    />
                  </div>
                ) : (
                  <div>No image to show</div>
                )}
              </Form.Group>

              <Button
                variant="secondary"
                type="submit"
                onClick={() => goToProductsList()}
                style={{ marginLeft: "5px" }}
              >
                Back to Products List
              </Button>
            </Form>
          ) : null}
          {msg ? <p>{msg}</p> : <p></p>}
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
