import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";

class NetBankingForm extends Component {
  state = {
    form: { payeeName: "", amount: "", comment: "" },
    errors: {},
    payeeList: [],
    payeeData: [],
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
    let { payeeName, amount } = this.state.form;
    let errors = {};
    errors.payeeName = this.validatePayee(payeeName);
    errors.amount = this.validateAmount(amount);
    this.setState({ errors: errors });
    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;
    switch (input.name) {
      case "payeeName":
        errors.payeeName = this.validatePayee(input.value);
        break;
      case "amount":
        errors.amount = this.validateAmount(input.value);

      default:
        break;
    }
    this.setState(s1);
  };

  validateAmount = (amt) => (!amt ? "Please Enter Amount" : "");
  validatePayee = (name) => (!name ? "Select Payee Name" : "");

  async postData(url, obj) {
    let response = await http.post(url, obj);
    alert("Details added successfully");
    this.props.history.push("/customer");
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      let user = auth.getUser();
      let { payeeName, amount, comment } = this.state.form;
      let { payeeData } = this.state;
      let payee = payeeData.find((ele) => ele.payeeName === payeeName);
      let data = {
        name: user.name,
        payeeName: payeeName,
        comment: comment,
        amount: amount,
        bankName: payee.bankName,
      };
      this.postData("/postNet", data);
    } else this.validateAll();
  };

  async componentDidMount() {
    let user = auth.getUser();
    let response = await http.get(`/getPayees/${user.name}`);
    let { data } = response;
    let payeeList = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        payeeList.push(data[i].payeeName);
      }
      this.setState({ payeeList: payeeList, payeeData: data });
    }
  }

  makeTextField(label, name, val, placeHolder) {
    let { errors } = this.state;
    return (
      <div class="mb-3">
        <label class={name === "amount" ? "form-label required" : "form-label"}>
          {label}
        </label>
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
    let { form, errors, payeeList, payeeData } = this.state;

    const myStyle = {
      backgroundColor: "#ccc",
    };
    return (
      <div className="container py-4">
        <h4>Net Banking Details</h4>
        <form>
          <div className="mob-3">
            <label class="form-label required">Payee Name</label>
            <select
              class="form-select form-select-sm"
              id="payeeName"
              name="payeeName"
              value={form.payeeName}
              onChange={this.handleChange}
              onBlur={this.handleValidate}
            >
              <option selected value="">
                Select Payee
              </option>
              {payeeList.map((ele) => (
                <option value={ele} key={ele}>
                  {ele}
                </option>
              ))}
            </select>
            {errors.payeeName ? (
              <div className="alert alert-danger p-2" role="alert">
                {errors.payeeName}
              </div>
            ) : (
              ""
            )}
          </div>
          {this.makeTextField("Amount", "amount", form.amount, "Enter Amount")}
          <hr style={myStyle} />
          {this.makeTextField(
            "Comment",
            "comment",
            form.comment,
            "Enter Comment"
          )}
          <button
            type="submit"
            class="btn btn-primary btn-sm"
            onClick={this.handleSubmit}
          >
            Add Transactions
          </button>
        </form>
      </div>
    );
  }
}
export default NetBankingForm;
