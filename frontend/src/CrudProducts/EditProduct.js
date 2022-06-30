import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../components/functions/Functions";
import { makeFetch } from "../utils/Api";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditProduct = () => {
  let { id } = useParams();
  const { jwt } = useSelector((state) => state.user_store);
  const { categories } = useSelector((state) => state.products_store);

  const [product, setProduct] = useState();
  const [category, setCategory] = useState("");
  const [final, setFinal] = useState(false);
  const [photo, setPhoto] = useState("");
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
      `http://localhost:1337/api/products/${id}?populate[0]=categories&populate[1]=Photo`,
      makeFetch
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setProduct(res.data);
          formik.values.title = res.data.attributes.title;
          formik.values.description = res.data.attributes.description;
          formik.values.price = res.data.attributes.price;
          formik.values.qty = res.data.attributes.qty;
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

  function saveProduct(values) {
    let data = JSON.parse(values);

    let formData = new FormData();
    let fetchData = false;

    let myProduct = {};

    if (product.attributes.title !== data.title) {
      myProduct.title = data.title;
    }

    if (product.attributes.description !== data.description) {
      myProduct.description = data.description;
    }

    if (product.attributes.price !== data.price) {
      myProduct.price = data.price;
    }

    if (product.attributes.qty !== data.qty) {
      myProduct.qty = data.qty;
    }

    if (product.attributes.categories.data[0].attributes.name !== category) {
      if (category === "") {
        myProduct.categories = [];
      } else {
        categories.forEach((item) => {
          if (item.attributes.name === category) {
            myProduct.categories = [item.id];
          }
        });
      }
    }

    if (JSON.stringify(myProduct) !== "{}") {
      fetchData = true;
      formData.append("data", JSON.stringify(myProduct));
    }

    if (photo !== "") {
      if (fetchData === false) {
        fetchData = true;
      }
      formData.append("files.Photo", photo[0]);
      if (JSON.stringify(myProduct) === "{}")
        formData.append("data", JSON.stringify({}));
    }

    if (fetchData) {
      var requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
        redirect: "follow",
      };

      fetch(`http://localhost:1337/api/product-update/${id}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          if (res.id) {
            dispatch({ type: "categories/clearCategories" });
            setMsg("Product successfully updated");
            setFinal(true);
            dispatch({ type: "products/clearData" });
          }

          if (res.error) {
            setMsg(res.error.message);
          }
        });
    } else {
      setMsg("Nothing to update");
    }
  }

  function goToProductsList() {
    navigate("/products");
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      qty: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(28, "Must be 28 characters or less")
        .required("Required"),
      description: Yup.string().required("Required"),
      price: Yup.number("Price must be a number").required("Required"),
      qty: Yup.number("Quantity must be a number").required("Required"),
    }),
    onSubmit: (values) => {
      saveProduct(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <div className="allData">
        <div className="editProduct">
          {product ? (
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter title"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                  disabled={final ? true : false}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div>{formik.errors.title}</div>
                ) : null}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  disabled={final ? true : false}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div>{formik.errors.description}</div>
                ) : null}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="price">Price</Form.Label>
                <Form.Control
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                  disabled={final ? true : false}
                />
                {formik.touched.price && formik.errors.price ? (
                  <div>{formik.errors.price}</div>
                ) : null}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="qty">Quantity</Form.Label>
                <Form.Control
                  type="number"
                  id="qty"
                  name="qty"
                  placeholder="Quantity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.qty}
                  disabled={final ? true : false}
                />
                {formik.touched.qty && formik.errors.qty ? (
                  <div>{formik.errors.qty}</div>
                ) : null}
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
                  disabled={final ? true : false}
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

                {photo?.[0] ? (
                  <img
                    src={URL.createObjectURL(photo[0])}
                    alt=""
                    width="500px"
                    height="auto"
                  />
                ) : product.attributes.Photo.data !== null ? (
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

              {final ? null : (
                <Form.Group className="mb-3">
                  <Form.Label>Change the photo</Form.Label>
                  <div style={{ display: "inline-block" }}>
                    <Form.Control
                      type="file"
                      id="photo"
                      onChange={(e) => {
                        if (e.target.files[0].type === "image/jpeg") {
                          setPhoto(e.target.files);
                        }
                      }}
                    />
                  </div>
                  {photo?.[0] ? (
                    <div
                      style={{ display: "inline-block", marginLeft: "15px" }}
                    >
                      <Button
                        variant="warning"
                        onClick={() => {
                          document.getElementById("photo").value = "";
                          setPhoto("");
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  ) : null}
                </Form.Group>
              )}

              {!final ? (
                <div>
                  <Button
                    variant="success"
                    type="submit"
                    // onClick={(e) => saveProduct(e)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="danger"
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
          ) : null}
          {msg ? <p>{msg}</p> : <p></p>}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
