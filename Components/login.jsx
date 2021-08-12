import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";

class Login extends Component {
  state = {
    form: { name: "", password: "" },
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
    let { name, password } = this.state.form;
    let errors = {};
    errors.name = this.validateUsername(name);
    errors.password = this.validatePassword(password);

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
      default:
        break;
    }
    this.setState(s1);
  };

  validateUsername = (name) => (!name ? "Username is required" : "");
  validatePassword = (password) =>
    !password
      ? "Password is required"
      : password.length < 7
      ? "Password must be of 7 characters"
      : "";

  async login(url, obj) {
    try {
      let response = await http.post(url, obj);
      let { data } = response;
      console.log("DATA", data);
      auth.login(data);
      data.role === "manager"
        ? (window.location = "/admin")
        : (window.location = "/customer");
    } catch (ex) {
      if (ex.response && ex.response.status === 500) {
        let invalid = "Login Failed!!. Check the username and password";
        this.setState({ invalid: invalid });
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.login("/login", this.state.form);
  };

  render() {
    let { form, errors, invalid = null } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-5 text-center py-5">
            <h4 className="pb-4">Welcome to GBI Bank</h4>
            {invalid ? <span className="text-danger">{invalid}</span> : ""}
            <form>
              <div className="mb-3">
                <label className="form-label">User Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter user name"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={this.handleChange}
                  onBlur={this.handleValidate}
                />
                <span className="form-text text-muted">
                  We'all never share your user name with anyone else.
                </span>
                {errors.name ? (
                  <React.Fragment>
                    {" "}
                    <br />
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
              <button
                type="submit"
                class="btn btn-primary btn-sm"
                disabled={!this.isFormValid()}
                onClick={this.handleSubmit}
              >
                Login
              </button>
            </form>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    );
  }
}
export default Login;
