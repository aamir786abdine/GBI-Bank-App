import React, { Component } from "react";
import http from "./services/httpService";

class LeftPanelOptions extends Component {
  state = {
    bankList: [],
    amounts: ["<10000", ">=10000"],
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let options = { ...this.props.options };
    options[input.name] = input.value;
    this.props.handleOptionChange(options);
  };

  async componentDidMount() {
    let response = await http.get("/getBanks");
    let { data } = response;
    console.log(data);
    this.setState({ bankList: data });
  }

  render() {
    let { bankList, amounts } = this.state;
    let { options } = this.props;
    return (
      <React.Fragment>
        <div className="row" style={{ paddingLeft: "2rem" }}>
          <div className="col-12  py-2 border-top border-end border-start bg-light fw-bold">
            Bank
          </div>
          {bankList.map((ele, index) => (
            <div
              className={
                index % 2 === 0
                  ? "col-12 border py-2"
                  : index === bankList.length - 1
                  ? "col-12 py-2 border-start border-end border-bottom"
                  : "col-12 py-2 border-start border-end"
              }
              key={index}
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="bank"
                  id="bank"
                  value={ele}
                  checked={options.bank === ele || false}
                  onChange={this.handleChange}
                />
                <label class="form-check-label">{ele}</label>
              </div>
            </div>
          ))}
        </div>
        <div className="row" style={{ marginLeft: "1rem" }}>
          <div style={{ padding: "0" }}>
            <hr />
          </div>
        </div>
        <div className="row" style={{ paddingLeft: "2rem" }}>
          <div className="col-12  py-2 border-top border-end border-start bg-light fw-bold">
            Amount
          </div>
          {amounts.map((ele, index) => (
            <div
              className={
                index === 0
                  ? "col-12 border py-2"
                  : "col-12 py-2 border-start border-end border-bottom"
              }
              key={index}
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="amount"
                  id="amount"
                  value={ele}
                  checked={options.amount === ele || false}
                  onChange={this.handleChange}
                />
                <label class="form-check-label">{ele}</label>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
export default LeftPanelOptions;
