import React, { Component } from "react";
import queryString from "query-string";
import http from "./services/httpService";

class ViewAllCustomers extends Component {
  state = {
    customers: {},
  };

  async fetchData() {
    let queryParams = queryString.parse(this.props.location.search);
    let { page } = queryParams;
    let response = await http.get(`/getCustomers?page=${page}`);
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
    this.props.history.push(`allCustomers?page=${newPage}`);
  };
  render() {
    let { customers } = this.state;
    let { items = [], page = "", totalItems = "", totalNum = "" } = customers;
    let x = Math.ceil(parseInt(totalNum) / 5);
    return (
      <div className="container py-3">
        <h4>All Customers</h4>
        <label>
          {page > 1 ? 5 * (page - 1) + 1 : page} -{" "}
          {totalItems == 5 ? totalItems * page : totalNum} of {totalNum}
        </label>
        <div className="row border-top h6 py-2 fw-bold">
          <div className="col-2">Name</div>
          <div className="col-3">State</div>
          <div className="col-2">City</div>
          <div className="col-3">PAN</div>
          <div className="col-2">DOB</div>
        </div>
        {items.map((ele, index) => (
          <div
            className={
              index % 2 === 0
                ? "row border-top border-bottom h6 py-3 bg-light"
                : "row h6 py-2"
            }
            key={index}
          >
            <div className="col-2">{ele.name}</div>
            <div className="col-3">{ele.state}</div>
            <div className="col-2">{ele.city}</div>
            <div className="col-3">{ele.PAN}</div>
            <div className="col-2">{ele.dob}</div>
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
      </div>
    );
  }
}
export default ViewAllCustomers;
