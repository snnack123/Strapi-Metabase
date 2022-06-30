import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddCategory = () => {
  const { jwt } = useSelector((state) => state.user_store);

  const [final, setFinal] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function addCategory(values) {
    let data = JSON.parse(values);

    let new_category = {
      data: {
        name: data.name,
      },
    };

    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_category),
      redirect: "follow",
    };

    fetch(`http://localhost:1337/api/categories`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setMsg("Category successfully created");
          setFinal(true);
          dispatch({ type: "categories/clearCategories" });
        }

        if (res.error) {
          setMsg(res.error.message);
          setFinal(true);
        }
      });
  }

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(28, "Must be 20 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      addCategory(JSON.stringify(values, null, 2));
    },
  });

  function goToCategoriesList() {
    navigate("/categories");
  }

  return (
    <div>
      <div className="allData">
        <h1 className="newOrder">Add a new Category</h1>
        <div className="editProduct">
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control
                id="name"
                name="name"
                type="text"
                placeholder="Enter name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                disabled={final ? true : false}
              />
              {formik.touched.name && formik.errors.name ? (
                <div>{formik.errors.name}</div>
              ) : null}
            </Form.Group>

            {!final ? (
              <div>
                <Button variant="success" type="submit">
                  Add the Category
                </Button>
                <Button
                  variant="danger"
                  onClick={() => goToCategoriesList()}
                  style={{ marginLeft: "5px" }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => goToCategoriesList()}
                style={{ marginLeft: "5px" }}
              >
                Back to Categories List
              </Button>
            )}
          </Form>
          {final ? <p>{msg}</p> : <p></p>}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
