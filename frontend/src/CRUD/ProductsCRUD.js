import { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getCategories } from "../components/functions/Functions";
import { useNavigate } from "react-router-dom";
import { makeFetch } from "../utils/Api";

const ProductsCRUD = () => {
  const { data, categories } = useSelector((state) => state.products_store);
  const { jwt } = useSelector((state) => state.user_store);

  const [show, setShow] = useState(false);
  const [idDelete, setIdDelete] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data.length === 0) {
      getProductsList();
    }
  }, []);

  async function getProductsList() {
    let result = await getProducts(jwt);

    if (result !== "error" && result !== "") {
      dispatch({ type: "products/setData", payload: result.data });
    }

    if (categories.length === 0) {
      let categ = await getCategories(jwt);

      if (categ !== "error" && categ !== "") {
        dispatch({ type: "products/setCategories", payload: categ.data });
      }
    }
  }

  function editProduct(e, product) {
    e.preventDefault();
    navigate(`/edit-product/${product.id}`);
  }

  function showDelete(e, id) {
    e.preventDefault();
    handleShow();
    setIdDelete(id);
  }

  function deleteProduct(e) {
    e.preventDefault();

    makeFetch.method = "DELETE";
    makeFetch.headers.Authorization = "Bearer " + jwt;
    delete makeFetch.authorization;
    delete makeFetch.headers.authorization;
    delete makeFetch.body;

    fetch(`http://localhost:1337/api/products/${idDelete}`, makeFetch)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          dispatch({ type: "products/deleteProduct", payload: idDelete });
          handleClose();
        }

        if (res.error) {
          console.log(res.error.message);
        }
      });
  }

  return (
    <div>
      <div className="allData">
        <h1 className="newOrder">List of Products</h1>
        {data.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td style={{ textAlign: "center" }}>{d.id}</td>
                  <td>{d.attributes.title}</td>
                  <td>{d.attributes.description}</td>
                  <td>{d.attributes.price}</td>
                  <td>{d.attributes.qty}</td>
                  {d.attributes.categories.data.length > 0 ? (
                    <td>{d.attributes.categories.data[0].attributes.name}</td>
                  ) : (
                    <td></td>
                  )}
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="warning"
                      onClick={(e) => editProduct(e, d)}
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
        ) : (
          <p></p>
        )}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete the product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={(e) => deleteProduct(e)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductsCRUD;
