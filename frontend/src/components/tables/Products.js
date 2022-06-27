import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { useState } from "react";

const Products = () => {
  const { data, newOrder } = useSelector((state) => state.products_store);
  const [products] = useState([]);

  const dispatch = useDispatch();

  function addProduct(id, price) {
    if (!products.includes(id)) {
      products.push(id);
      dispatch({ type: "products/addToCart", payload: { id, price } });
    } else {
      products.splice(products.indexOf(id), 1);
      dispatch({ type: "products/removeFromCart", payload: { id, price } });
    }
  }

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {newOrder === true ? <th>Select</th> : <th>ID</th>}
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              {newOrder ? (
                <td>
                  <input
                    type="checkbox"
                    className="chkBox"
                    value={d.id}
                    onClick={(e) =>
                      addProduct(e.target.value, d.attributes.price)
                    }
                  />
                </td>
              ) : (
                <td>{d.id}</td>
              )}
              <td>{d.attributes.title}</td>
              <td>{d.attributes.description}</td>
              <td>{d.attributes.price}</td>
              <td>{d.attributes.qty}</td>
              {d.attributes.categories.data.length > 0 ? (
                <td>{d.attributes.categories.data[0].attributes.name}</td>
              ) : (
                <td></td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Products;
