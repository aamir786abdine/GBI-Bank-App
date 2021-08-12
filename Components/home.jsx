import React, { Component } from "react";
import auth from "./services/authService";

class Home extends Component {
  render() {
    let user = auth.getUser();
    return (
      <div className="container">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-6 text-center py-4">
            <h4 className="text-danger">
              {user.role === "manager"
                ? "Welcome to GBI BANK"
                : "Welcome to GBI BANK customer portal"}
            </h4>
            <img
              src="https://img.freepik.com/free-vector/cartoon-retro-bank-building-courthouse-with-columns-illustration-isolated-white_53562-8133.jpg?size=626&ext=jpg"
              alt="Image not found"
              style={{ width: "70%" }}
            />
          </div>
          <div className="col-3"></div>
        </div>
      </div>
    );
  }
}
export default Home;
