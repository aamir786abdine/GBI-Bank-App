import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";

class ChequeForm extends Component {
  state = {
    form: { chequeNumber: "", bankName: "", branch: "", amount: "" },
    bankList: [],
    errors: {},
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.form[input.name] = input.value;
    this.handleValidate(e);
    this.setState(s1);
  };

  isFormValid = () => {
    let errors = this.validateAll();
    return this.isValid(errors);
  };

  isValid = (errors) => {
    let keys = Object.keys(errors);
    let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0);
    return count === 0;
  };

  validateAll = () => {
    let { chequeNumber, bankName, branch, amount } = this.state.form;
    let errors = {};
    errors.chequeNumber = this.validateChequeNum(chequeNumber);
    errors.bankName = this.validateBankName(bankName);
    errors.branch = this.validateBranch(branch);
    errors.amount = this.validateAmount(amount);
    this.setState({ errors: errors });
    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;
    switch (input.name) {
      case "chequeNumber":
        errors.chequeNumber = this.validateChequeNum(input.value);
        break;
      case "bankName":
        errors.bankName = this.validateBankName(input.value);
        break;
      case "branch":
        errors.branch = this.validateBranch(input.value);
        break;
      case "amount":
        errors.amount = this.validateAmount(input.value);

      default:
        break;
    }
    this.setState(s1);
  };

  validateChequeNum = (cNum) =>
    cNum.length < 11 ? "Enter Your 11 digit Cheque Number" : "";

  validateBankName = (bank) => (!bank ? "Please Select Bank Name" : "");

  validateBranch = (branch) =>
    branch.length < 4 ? "Enter 4 digit code of branch" : "";

  validateAmount = (amt) => (!amt ? "Please Enter Amount" : "");

  async postData(url, obj) {
    let response = await http.post(url, obj);
    alert("Details added successfully");
    this.props.history.push("/customer");
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      let user = auth.getUser();
      let { chequeNumber, bankName, branch, amount } = this.state.form;
      let data = {
        name: user.name,
        chequeNumber: chequeNumber,
        bankName: bankName,
        branch: branch,
        amount: amount,
      };
      this.postData("/postCheque", data);
    } else this.validateAll();
  };

  async componentDidMount() {
    let response = await http.get("/getBanks");
    let { data } = response;
    this.setState({ bankList: data });
  }

  makeTextField(label, name, val, placeHolder) {
    let { errors } = this.state;
    return (
      <div class="mb-3">
        <label class="form-label required">{label}</label>
        <input
          class="form-control form-control-sm"
          type="text"
          id={name}
          name={name}
          value={val}
          placeholder={placeHolder}
          onChange={this.handleChange}
          onBlur={this.handleValidate}
        />
        {errors[name] ? (
          <div className="alert alert-danger p-2" role="alert">
            {errors[name]}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  render() {
    let { chequeNumber, bankName, branch, amount } = this.state.form;
    let { bankList, errors } = this.state;
    const myStyle = {
      backgroundColor: "#ccc",
    };
    return (
      <div className="container py-4">
        <h4>Deposit Cheque</h4>
        <form>
          {this.makeTextField(
            "Cheque Number",
            "chequeNumber",
            chequeNumber,
            "Enter Cheque Number"
          )}
          <hr style={myStyle} />
          <div className="mob-3">
            <label class="form-label required">Bank Name</label>
            <select
              class="form-select form-select-sm"
              id="bankName"
              name="bankName"
              value={bankName}
              onChange={this.handleChange}
              onBlur={this.handleValidate}
            >
              <option selected value="">
                Select Bank
              </option>
              {bankList.map((ele) => (
                <option value={ele} key={ele}>
                  {ele}
                </option>
              ))}
            </select>
            {errors.bankName ? (
              <div className="alert alert-danger p-2" role="alert">
                {errors.bankName}
              </div>
            ) : (
              ""
            )}
          </div>
          <hr style={myStyle} />
          {this.makeTextField("Branch", "branch", branch, "Enter Branch Code")}
          <hr style={myStyle} />
          {this.makeTextField("Amount", "amount", amount, "Enter Amount")}
          <hr style={myStyle} />
          <button
            type="submit"
            class="btn btn-primary btn-sm"
            onClick={this.handleSubmit}
          >
            Add Cheque
          </button>
        </form>
      </div>
    );
  }
}
export default ChequeForm;
