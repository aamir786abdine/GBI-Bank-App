import React, { Component } from "react";
import queryString from "query-string";
import http from "./services/httpService";
import LeftPanelOptions from "./leftPanelOptions";

class AllNetBanking extends Component {
  state = {
    customers: {},
  };

  async fetchData() {
    let queryParams = queryString.parse(this.props.location.search);
    let searchStr = this.makeSearchString(queryParams);
    let response = await http.get(`/getAllNetBankings?${searchStr}`);
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
    queryParams.page = newPage;
    this.callURL("/allNet", queryParams);
  };
  handleOptionChange = (options) => {
    options.page = "1";
    this.callURL("/allNet", options);
  };

  callURL = (url, options) => {
    let searchString = this.makeSearchString(options);
    this.props.history.push({
      pathname: url,
      search: searchString,
    });
  };

  makeSearchString = (options) => {
    let { page = "1", bank, amount } = options;
    let searchStr = "";
    searchStr = this.addToQueryString(searchStr, "page", page);
    searchStr = this.addToQueryString(searchStr, "bank", bank);
    searchStr = this.addToQueryString(searchStr, "amount", amount);
    return searchStr;
  };

  addToQueryString = (str, paramName, paramValue) =>
    paramValue
      ? str
        ? `${str}&${paramName}=${paramValue}`
        : `${paramName}=${paramValue}`
      : str;
  render() {
    let { customers } = this.state;
    let { items = [], page = "", totalItems = "", totalNum = "" } = customers;
    let x = Math.ceil(parseInt(totalNum) / 5);
    let queryParams = queryString.parse(this.props.location.search);
    return (
      <div className="container py-3">
        <div className="row">
          <h4>All Net Banking Transactions</h4>
        </div>
        <div className="row">
          <div className="col-2">
            <LeftPanelOptions
              options={queryParams}
              handleOptionChange={this.handleOptionChange}
            />
          </div>
          <div className="col-10" style={{ paddingLeft: "3rem" }}>
            <label>
              {page > 1 ? 5 * (page - 1) + 1 : page} -{" "}
              {totalItems == 5 ? totalItems * page : totalNum} of {totalNum}
            </label>
            <div className="row border-top h6 py-2 fw-bold">
              <div className="col-2">Name</div>
              <div className="col-3">Payee Name</div>
              <div className="col-2">Amount</div>
              <div className="col-3">Bank Name</div>
              <div className="col-2">Comment</div>
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
                <div className="col-3">{ele.payeeName}</div>
                <div className="col-2">{ele.amount}</div>
                <div className="col-3">{ele.bankName}</div>
                <div className="col-2">{ele.comment}</div>
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
        </div>
      </div>
    );
  }
}
export default AllNetBanking;
