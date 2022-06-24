import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Tables.css";
import { setDate } from "../functions/Functions";

const MyOrders = () => {
  const { orders } = useSelector((state) => state.orders_store);

  return (
    <div className="allData">
      <h1>My orders</h1>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>TotalPrice</th>
            <th>Order Date</th>
            <th>Delivery Date</th>
            <th>No. of Products</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {orders ? (
            orders.map((d, i) => (
              <tr key={i}>
                <td>{d.id}</td>
                <td>{d.attributes.TotalPrice}</td>
                <td>{setDate(d.attributes.OrderDate)}</td>
                <td>{setDate(d.attributes.DeliveryDate)}</td>
                <td>{d.attributes.products.data.length}</td>
                <td>{d.attributes.Address}</td>
              </tr>
            ))
          ) : (
            <div></div>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default MyOrders;
