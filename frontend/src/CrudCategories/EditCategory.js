import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditCategory = () => {
  let { id } = useParams();
  const { jwt } = useSelector((state) => state.user_store);

  const [category, setCategory] = useState();
  const [final, setFinal] = useState(false);
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getCategory();
    }
  }, []);

  function getCategory() {
    var requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      redirect: "follow",
    };

    fetch(
      `http://localhost:1337/api/categories/${id}?populate[0]=products`,
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setCategory(res.data);
          formik.values.name = res.data.attributes.name;
        }

        if (res.error) {
          setMsg(res.error.message);
          setFinal(true);
        }
      });
  }

  function saveCategory(values) {
    let data = JSON.parse(values);
    let fetchData = false;

    let myCategory = {
      data: {},
    };

    if (category.attributes.name !== data.name) {
      fetchData = true;
      myCategory.data.name = data.name;
    }

    if (fetchData) {
      setMsg("");

      var requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(myCategory),
        redirect: "follow",
      };

      fetch(`http://localhost:1337/api/categories/${id}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          if (res.data) {
            dispatch({ type: "categories/clearCategories" });
            setMsg("Category successfully updated");
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

  function goToCategoriesList() {
    navigate("/categories");
  }

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      saveCategory(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <div className="allData">
        <div className="editProduct">
          {category ? (
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="title">Name</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  name="name"
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
                  <Button
                    variant="success"
                    type="submit"
                    // onClick={(e) => saveProduct(e)}
                  >
                    Save
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
                  type="submit"
                  onClick={() => goToCategoriesList()}
                  style={{ marginLeft: "5px" }}
                >
                  Back to Categories List
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

export default EditCategory;
