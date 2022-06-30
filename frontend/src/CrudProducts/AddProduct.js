import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { getCategories } from "../components/functions/Functions";

const AddProduct = () => {
  const { categories } = useSelector((state) => state.products_store);
  const { jwt } = useSelector((state) => state.user_store);

  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");
  const [final, setFinal] = useState(false);
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  function addProduct(values) {
    let data = JSON.parse(values);

    let formData = new FormData();

    let new_product = {
      title: data.title,
      description: data.description,
      price: data.price,
      qty: data.qty,
    };

    categories.forEach((item) => {
      if (item.attributes.name === category) {
        new_product.categories = [item.id];
      }
    });

    formData.append("data", JSON.stringify(new_product));
    if (photo !== "") {
      formData.append("files.Photo", photo[0]);
    }

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
      addProduct(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <div className="allData">
        <h1 className="newOrder">Add a new Product</h1>
        <div className="editProduct">
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="title">Title</Form.Label>
              <Form.Control
                id="title"
                name="title"
                type="text"
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
                id="price"
                name="price"
                type="number"
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
                id="qty"
                name="qty"
                type="number"
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

            {final ? null : (
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
            )}

            {!final ? (
              <div>
                <Button variant="success" type="submit">
                  Add the Product
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
