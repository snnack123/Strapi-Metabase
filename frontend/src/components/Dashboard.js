import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeFetch } from "../utils/Api";

const Dashboard = () => {
  const [iframeUrl, setIFrameUrl] = useState("");
  const [error, setError] = useState(false);
  const { jwt } = useSelector((state) => state.user_store);

  useEffect(() => {
    if (localStorage.getItem("dash-token") && localStorage.getItem("jwt")) {
      let fetchData = makeFetch;

      fetchData.method = "POST";
      fetchData.headers.authorization = `Bearer ${jwt}`;
      fetchData.body = JSON.stringify({
        token: localStorage.getItem("dash-token"),
      });

      delete makeFetch.headers.Authorization;

      fetch("http://localhost:1337/api/order/checkToken", fetchData)
        .then((res) => res.json())
        .then((res) => {
          if (res.message === "Your token expired!") {
            awaitSetDashToken();
          }
        });
    }

    if (localStorage.getItem("jwt") && iframeUrl === "") {
      awaitSetDashToken();
    }
  }, []);

  function awaitSetDashToken() {
    makeFetch.method = "GET";
    makeFetch.headers.authorization = `Bearer ${jwt}`;

    if (makeFetch.body) delete makeFetch.body;
    delete makeFetch.headers.Authorization;

    fetch(`http://localhost:1337/api/dashboard`, makeFetch)
      .then((res) => res.json())
      .then((res) => {
        if (res.iframeUrl) {
          setIFrameUrl(res.iframeUrl);
          setError(false);
          localStorage.setItem("dash-token", res.token);
        } else {
          setError(true);
          localStorage.removeItem("dash-token");
        }
      });
  }

  return (
    <div>
      <div className="allData">
        {iframeUrl !== "" ? (
          <iframe
            src={iframeUrl}
            frameBorder="0"
            width="800"
            height="600"
            allowtransparency="true"
            title="myDashboard"
          ></iframe>
        ) : error ? (
          <div>Error loading the dashboard</div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
