import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import NavBar from "./navBar";
import Login from "./login";
import Logout from "./logout";
import Home from "./home";
import ViewAllCustomers from "./viewAllCustomers";
import AddCustomer from "./addCustomer";
import ViewAllCheque from "./viewAllChequeTransactions";
import AllNetBanking from "./viewAllNetTransactions";
import ViewCustomerCheque from "./viewCustomerCheque";
import ViewCustomerNetBanking from "./viewCustomerNetBanking";
import ChequeForm from "./chequeForm";
import AddPayeeForm from "./addPayeeForm";
import NetBankingForm from "./netBankingForm";
import CustomerDetails from "./customerDetails";
import NomineeDetails from "./nomineeDetails";
import NotAllowed from "./notAllowed";
import auth from "./services/authService";

class MainComponents extends Component {
  render() {
    let user = auth.getUser();
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route
            path="/admin"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <Home {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/customer"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <Home {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/cheque"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <ChequeForm {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/netBanking"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <NetBankingForm {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/addPayee"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <AddPayeeForm {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/allCustomers"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <ViewAllCustomers {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/addCustomer"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <AddCustomer {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/customerDetails"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <CustomerDetails {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/nomineeDetails"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <NomineeDetails {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/allNet"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <AllNetBanking {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/allCheque"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <ViewAllCheque {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/viewCheque"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <ViewCustomerCheque {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/viewNet"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <ViewCustomerNetBanking {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route path="/notAllowed" component={NotAllowed} />
          <Route
            path="/"
            render={(props) =>
              user && user.role === "manager" ? (
                <Redirect to="/admin" />
              ) : user && user.role === "customer" ? (
                <Redirect to="/customer" />
              ) : (
                <Login {...props} />
              )
            }
          />
        </Switch>
      </React.Fragment>
    );
  }
}
export default MainComponents;
