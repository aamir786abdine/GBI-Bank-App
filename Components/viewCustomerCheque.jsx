import React, { Component } from "react";
import queryString from "query-string";
import http from "./services/httpService";
import auth from "./services/authService";

class ViewCustomerCheque extends Component {
  state = {
    customers: {},
  };

  async fetchData() {
    let user = auth.getUser();
    let queryParams = queryString.parse(this.props.location.search);
    let { page } = queryParams;
    let response = await http.get(`/getChequeByName/${user.name}?page=${page}`);
    let { data } = response;
    this.setState({ customers: data });
  }
  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) this.fetchData();
  }
  handlePage = (inc) => {
    let queryParams = queryString.parse(this.props.location.search);
    let { page } = queryParams;
    let newPage = +page + inc;
    this.props.history.push(`viewCheque?page=${newPage}`);
  };

  render() {
    let { customers } = this.state;
    let { items = [], page = "", totalItems = "", totalNum = "" } = customers;
    let x = Math.ceil(parseInt(totalNum) / 5);
    return (
      <div className="container py-4">
        <div className="row">
          <h4>All Cheque Details</h4>
        </div>
        {items.length === 0 ? (
          <h5 className="text-danger">No Transactions to show</h5>
        ) : (
          <React.Fragment>
            <label>
              {page > 1 ? 5 * (page - 1) + 1 : page} -{" "}
              {totalItems == 5 ? totalItems * page : totalNum} of {totalNum}
            </label>
            <div className="row border-top h6 py-2 fw-bold text-center">
              <div className="col-3">Cheque Number</div>
              <div className="col-3">Bank Name</div>
              <div className="col-3">Branch</div>
              <div className="col-3">Amount</div>
            </div>
            {items.map((ele, index) => (
              <div
                className={
                  index % 2 === 0
                    ? "row border-top border-bottom h6 py-3 bg-light text-center"
                    : "row h6 py-2 text-center"
                }
                key={index}
              >
                <div className="col-3">{ele.chequeNumber}</div>
                <div className="col-3">{ele.bankName}</div>
                <div className="col-3">{ele.branch}</div>
                <div className="col-3">{ele.amount}</div>
              </div>
            ))}
            <div className="row pt-1">
              <div className="col-2">
                {page > 1 ? (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => this.handlePage(-1)}
                  >
                    prev
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div className="col-8"></div>
              <div className="col-2 text-end">
                {page < x ? (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => this.handlePage(1)}
                  >
                    Next
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
export default ViewCustomerCheque;
