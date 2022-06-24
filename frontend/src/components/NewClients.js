import { useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";

const NewClients = () => {
  const [error, setError] = useState(false);
  const [noOfUsers, setNoOfUsers] = useState(0);
  const { jwt } = useSelector((state) => state.user_store);

  async function addClients(e) {
    e.preventDefault();
    setError(false);

    let formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);

    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
      redirect: "follow",
    };

    fetch("http://localhost:1337/api/new-users", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          setNoOfUsers(res.length);
        } else {
          setError(true);
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <div>
      <div className="allData">
        <h1 className="newOrder">New Clients</h1>
        <form>
          <div className="uploadCSV">
            <Form.Group controlId="formFile" className="mb-3" accept=".csv">
              <Form.Label>Upload CSV with new clients</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  e.target.files[0].type === "text/csv"
                    ? addClients(e)
                    : setError(true)
                }
              />
            </Form.Group>
          </div>
        </form>
        {error ? <p>Wrong type of file</p> : <p></p>}
        {noOfUsers !== 0 ? (
          <p>
            <b>{noOfUsers}</b> users successfully added
          </p>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default NewClients;
