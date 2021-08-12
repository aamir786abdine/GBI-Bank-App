import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "./services/authService";

class NavBar extends Component {
  render() {
    let user = auth.getUser();
    console.log(user);
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-sm navbar-light bg-warning">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Home
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarText"
              aria-controls="navbarText"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {!user && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/Login">
                      Login
                    </Link>
                  </li>
                )}
                {user && user.role === "manager" && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Customers
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/addCustomer">
                          Add Customer
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/allCustomers?page=1"
                        >
                          View All Customers
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {user && user.role === "manager" && (
                  <li class="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Transactions
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link
                          className="dropdown-item blue"
                          to="/allCheque?page=1"
                        >
                          Cheques
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/allNet?page=1">
                          Net Banking
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {user && user.role === "customer" && (
                  <li class="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      View
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link
                          className="dropdown-item blue"
                          to="/viewCheque?page=1"
                        >
                          Cheque
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/viewNet?page=1">
                          Net Banking
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {user && user.role === "customer" && (
                  <li class="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Details
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link
                          className="dropdown-item blue"
                          to="/customerDetails"
                        >
                          Customer
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/nomineeDetails">
                          Nominee
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {user && user.role === "customer" && (
                  <li class="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Transaction
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link className="dropdown-item blue" to="/addPayee">
                          Add Payee
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item blue" to="/cheque">
                          Cheque
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/netBanking">
                          NetBanking
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
              <span className="nav-item" style={{ marginRight: "0.8rem" }}>
                <Link to="/" className="link">
                  {user ? "Welcome " + user.name : ""}
                </Link>
              </span>
              {user && (
                <span className="navbar-link">
                  <Link to="/logout" className="link">
                    Logout
                  </Link>
                </span>
              )}
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
export default NavBar;
