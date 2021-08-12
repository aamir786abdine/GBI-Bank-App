import React, { Component } from "react";
import http from "./services/httpService";

class AddCustomer extends Component {
  state = {
    form: { name: "", password: "", rePassword: "" },
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
    let { name, password, rePassword } = this.state.form;
    let errors = {};
    errors.name = this.validateUsername(name);
    errors.password = this.validatePassword(password);
    errors.rePassword = this.validateRePassword(rePassword);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;

    switch (input.name) {
      case "name":
        errors.name = this.validateUsername(input.value);
        break;
      case "password":
        errors.password = this.validatePassword(input.value);
        break;
      case "rePassword":
        errors.rePassword = this.validateRePassword(input.value);
        break;
      default:
        break;
    }
    this.setState(s1);
  };

  validateUsername = (name) => (!name ? "Username is required" : "");
  validatePassword = (password) =>
    !password
      ? "password can not be blank. Minimum length should be 7 characters."
      : password.length < 7
      ? "password can not be blank. Minimum length should be 7 characters."
      : "";

  validateRePassword = (password) =>
    !password || password !== this.state.form.password
      ? "Password do not match."
      : "";

  async register(url, obj) {
    let response = await http.post(url, obj);
    alert("Customer added successfully");
    window.location = "/admin";
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let { name, password } = this.state.form;
    let data = { name: name, password: password };
    this.register("/register", data);
  };

  render() {
    let { form, errors } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="py-3">
            <h4 className="pb-1">New Customer</h4>
            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Customer name"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                />
                {errors.name ? (
                  <React.Fragment>
                    {" "}
                    <span className="text-danger">{errors.name}</span>
                  </React.Fragment>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                />
                {errors.password ? (
                  <span className="text-danger">{errors.password}</span>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Confirm Password"
                  id="rePassword"
                  name="rePassword"
                  value={form.rePassword}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                />
                {errors.rePassword ? (
                  <span className="text-danger">{errors.rePassword}</span>
                ) : (
                  ""
                )}
              </div>
              <button
                type="submit"
                class="btn btn-primary btn-sm"
                disabled={!this.isFormValid()}
                onClick={this.handleSubmit}
              >
                Create
              </button>
            </form>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    );
  }
}
export default AddCustomer;
