import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";

class AddPayeeForm extends Component {
  state = {
    form: {
      payeeName: "",
      IFSC: "",
      accNumber: "",
      bank: "",
      otherBank: "",
    },
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
    let { payeeName, IFSC, accNumber, bank, otherBank } = this.state.form;
    let errors = {};
    errors.payeeName = this.validatePayee(payeeName);
    errors.accNumber = this.validateAccount(accNumber);
    errors.bank = this.validateBankRadio(bank);
    if (bank === "other") {
      errors.IFSC = this.validateIFSC(IFSC);
      errors.otherBank = this.validateBankName(otherBank);
    }
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
      case "accNumber":
        errors.accNumber = this.validateAccount(input.value);
        break;
      case "bank":
        errors.bank = this.validateBankRadio(input.value);
        break;
      case "IFSC":
        errors.IFSC = this.validateIFSC(input.value);
        break;
      case "otherBank":
        errors.otherBank = this.validateBankName(input.value);
        break;
      default:
        break;
    }
    this.setState(s1);
  };

  validatePayee = (name) => (!name ? "Payee name is required" : "");
  validateAccount = (acc) => (!acc ? "Account number is required" : "");
  validateBankRadio = (bank) => (!bank ? "Choose any one option" : "");
  validateBankName = (bank) => (!bank ? "Select any one Bank" : "");
  validateIFSC = (ifsc) => (!ifsc ? "IFSC code is required" : "");

  async postData(url, obj) {
    let response = await http.post(url, obj);
    alert("Payee added to your list = " + obj.payeeName);
    this.props.history.push("/customer");
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      let user = auth.getUser();
      let { payeeName, IFSC, accNumber, bank, otherBank } = this.state.form;
      let data = {
        name: user.name,
        payeeName: payeeName,
        IFSC: IFSC,
        accNumber: accNumber,
        bankName: bank === "GBI" ? bank : otherBank,
      };
      this.postData("/addPayee", data);
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
    let { form, bankList, errors } = this.state;
    return (
      <div className="container">
        <h4 className="pt-4"> Add Payee</h4>
        <form>
          {this.makeTextField(
            "Payee Name",
            "payeeName",
            form.payeeName,
            "Enter Payee Name"
          )}
          {this.makeTextField(
            "Account Number",
            "accNumber",
            form.accNumber,
            "Enter Payee Account Number"
          )}
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="bank"
              id="bank"
              value="GBI"
              checked={form.bank === "GBI" || false}
              onChange={this.handleChange}
            />
            <label class="form-check-label">Same Bank</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="bank"
              id="bank"
              value="other"
              checked={form.bank === "other" || false}
              onChange={this.handleChange}
            />
            <label class="form-check-label">Other Bank</label>
          </div>
          {errors.bank ? (
            <div className="alert alert-danger p-2" role="alert">
              {errors.bank}
            </div>
          ) : (
            ""
          )}
          {form.bank === "other" ? (
            <React.Fragment>
              <div className="mob-3 py-3">
                <select
                  class="form-select form-select-sm"
                  id="otherBank"
                  name="otherBank"
                  value={form.otherBank}
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
                {errors.otherBank ? (
                  <div className="alert alert-danger p-2" role="alert">
                    {errors.otherBank}
                  </div>
                ) : (
                  ""
                )}
              </div>
              {this.makeTextField(
                "IFSC Code",
                "IFSC",
                form.IFSC,
                "Enter IFSC Code"
              )}
            </React.Fragment>
          ) : (
            ""
          )}
          <button
            type="submit"
            class="btn btn-primary btn-sm my-1"
            onClick={this.handleSubmit}
          >
            Add Payee
          </button>
        </form>
      </div>
    );
  }
}
export default AddPayeeForm;
