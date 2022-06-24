import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { setDate } from "../functions/Functions";

const Categories = () => {
  const { categories } = useSelector((state) => state.products_store);

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>No. of Products</th>
            <th>Date Created</th>
            <th>Date Updated</th>
            <th>Date Published</th>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Categories;
