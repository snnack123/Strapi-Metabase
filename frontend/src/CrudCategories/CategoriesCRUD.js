import { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../components/functions/Functions";
import { setDate } from "../components/functions/Functions";
import { Nav } from "react-bootstrap";

const CategoriesCRUD = () => {
  const { categories } = useSelector((state) => state.categories_store);
  const { jwt } = useSelector((state) => state.user_store);

  const [show, setShow] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [categoryToDelete, setCategoryTotDelete] = useState("");
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const [productsToEdit, setProductToEdit] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setShowDeleteButton(false);
    setCategoryTotDelete("");
    setShow(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (categories.length === 0) {
      getCategoriesList();
    }
  }, []);

  async function getCategoriesList() {
    let result = await getCategories(jwt);

    if (result !== "error" && result !== "") {
      dispatch({ type: "categories/setCategories", payload: result.data });
    }
  }

  function gotoAddPage() {
    navigate("/add-category");
  }

  function showDelete(e, id) {
    e.preventDefault();
    handleShow();
    setIdDelete(id);

    categories.forEach((item) => {
      if (item.id === id) {
        if (item.attributes.products.data.length !== 0) {
          setProductToEdit(item.attributes.products.data);
          setCategoryTotDelete(item);
          setShowDeleteButton(false);
        } else {
          setProductToEdit("");
          setCategoryTotDelete("");
          setShowDeleteButton(true);
        }
      }
    });
  }

  function editCategory(e, category) {
    e.preventDefault();
    navigate(`/edit-category/${category.id}`);
  }

  // function seeMore() {}

  function deleteCategory() {
    var requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      redirect: "follow",
    };

    fetch(`http://localhost:1337/api/categories/${idDelete}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          dispatch({ type: "categories/deleteCategory", payload: idDelete });
          handleClose();
        }

        if (res.error) {
          console.log(res.error.message);
        }
      });
  }

  function editProduct(id) {
    console.log(id);
    navigate(`/edit-product/${id}`);
    dispatch({ type: "categories/clearCategories" });
  }

  return (
    <div>
      <div className="allData">
        <h1 className="newOrder">List of Categories</h1>
        <div style={{ textAlign: "right", marginBottom: "10px" }}>
          <Button variant="success" onClick={() => gotoAddPage()}>
            Add a new Category
          </Button>
        </div>
        {categories.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>ID</th>
                <th>Name</th>
                <th>No. of Products</th>
                <th>Date created</th>
                <th>Date updated</th>
                <th>Date published</th>
                {/* <th>See more</th> */}
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((d, i) => (
                <tr key={i}>
                  <td>{d.id}</td>
                  <td>{d.attributes.name}</td>
                  <td>{d.attributes.products.data.length}</td>
                  <td>{setDate(d.attributes.createdAt)}</td>
                  <td>{setDate(d.attributes.updatedAt)}</td>
                  <td>{setDate(d.attributes.publishedAt)}</td>
                  {/* <td style={{ textAlign: "center" }}>
                    <Button variant="info" onClick={(e) => seeMore(e, d)}>
                      View Data
                    </Button>
                  </td> */}
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="warning"
                      onClick={(e) => editCategory(e, d)}
                    >
                      Edit
                    </Button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="danger"
                      onClick={(e) => showDelete(e, d.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete the category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showDeleteButton ? (
              <div>Are you sure you want to delete this category?</div>
            ) : (
              <div>
                <div style={{ fontWeight: "bold" }}>
                  You have to change the category for this products before you
                  can delete the category:
                </div>
                <div>
                  {productsToEdit !== ""
                    ? productsToEdit.map((item, index) => (
                        <div key={index}>
                          <Nav.Link onClick={() => editProduct(item.id)}>
                            {item.attributes.title}
                          </Nav.Link>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {showDeleteButton ? (
              <Button variant="danger" onClick={(e) => deleteCategory(e)}>
                Delete
              </Button>
            ) : null}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CategoriesCRUD;
