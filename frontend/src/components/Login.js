import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { makeFetch } from "../utils/Api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const Login = () => {
  const { username, password } = useSelector((state) => state.user_store);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setUsername = (data) => {
    dispatch({ type: "user/username", payload: data });
  };

  const setPassword = (data) => {
    dispatch({ type: "user/password", payload: data });
  };

  const login = async (e) => {
    e.preventDefault();

    const account = {
      identifier: username,
      password: password,
    };

    makeFetch.method = "POST";
    makeFetch.body = JSON.stringify(account);
    makeFetch.headers.Authorization = "";

    fetch(`http://localhost:1337/api/auth/local`, makeFetch)
      .then((res) => res.json())
      .then((res) => {
        if (res.jwt) {
          dispatch({ type: "user/tryLogin", payload: true });
          dispatch({ type: "user/loggedIn", payload: true });
          dispatch({ type: "user/jwt", payload: res.jwt });
          localStorage.setItem("jwt", res.jwt);
          localStorage.setItem("user", username);
          setUsername(username);
          navigate("/all-data");
        }

        if (res.error) {
          throw new Error("Incorrect credentials");
        }
      })
      .catch(() => {
        dispatch({ type: "user/tryLogin", payload: true });
        dispatch({ type: "user/loggedIn", payload: false });
      });
  };

  return (
    <div className="allData">
      <div className="login_form">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicUser">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="user"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={(e) => login(e)}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
