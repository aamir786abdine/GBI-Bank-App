import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";

class CustomerDetails extends Component {
  state = {
    form: {
      gender: "",
      addressLine1: "",
      addressLine2: "",
      state1: "",
      city: "",
      dobYear: "",
      dobMonth: "",
      dobDay: "",
      pan: "",
    },
    edit: false,
    errors: {},
    months: [
      "Jan",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    stateCity: [],
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.form[input.name] = input.value;
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
    let { gender, dobYear, dobMonth, dobDay, state1, city, pan } =
      this.state.form;
    let errors = {};
    errors.gender = this.validateGender(gender);
    errors.dobYear = this.validateDate(dobYear);
    errors.dobMonth = this.validateDate(dobMonth);
    errors.dobDay = this.validateDate(dobDay);
    errors.state1 = this.validateState(state1);
    errors.city = this.validateCity(city);
    errors.pan = this.validatePan(pan);
    this.setState({ errors: errors });
    return errors;
  };

  validateGender = (gender) => (!gender ? "Choose any one gender option" : "");
  validateDate = (date) => (!date ? "Select Date" : "");
  validateState = (s1) => (!s1 ? "Please Select State" : "");
  validateCity = (c1) => (!c1 ? "Please Select City" : "");
  validatePan = (pan) => (!pan ? "Please enter PAN number" : "");

  async fetchData() {
    let user = auth.getUser();
    let response = await http.get(`/getCustomer/${user.name}`);
    let { data } = response;
    console.log("Details", data);
    if (data.PAN) {
      let date = data.dob;
      let day = date[2] === "-" ? date.substring(0, 2) : date.substring(0, 1);
      let month =
        date[2] === "-"
          ? date.substring(3, date.length - 5)
          : date.substring(2, date.length - 5);
      let year = date.substring(date.length - 4);
      let form = {
        gender: data.gender,
        dobYear: year,
        dobMonth: month,
        dobDay: day,
        pan: data.PAN,
        addressLine1: data.addressLine1,
        state1: data.state,
        city: data.city,
      };
      this.setState({ form: form, edit: true });
    }
  }

  async componentDidMount() {
    this.fetchData();
    let response2 = await http.get("/statecity");
    let { data } = response2;
    this.setState({ stateCity: data });
  }

  async postData(url, obj) {
    let response = await http.post(url, obj);
    alert(obj.name + " details have been added successfully.");
    this.props.history.push("/customer");
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      let user = auth.getUser();
      let {
        gender,
        dobYear,
        dobMonth,
        dobDay,
        pan,
        addressLine1,
        addressLine2,
        state1,
        city,
      } = this.state.form;
      let DOB = dobDay + "-" + dobMonth + "-" + dobYear;
      let address = addressLine1 + " " + addressLine2;
      let data = {
        name: user.name,
        gender: gender,
        addressLine1: address,
        state: state1,
        city: city,
        dob: DOB,
        PAN: pan,
      };
      this.postData("/customerDetails", data);
    }
  };

  makeTextField(label, name, val, placeHolder) {
    let { errors } = this.state;
    return (
      <div className="mb-3">
        {name === "addressLine1" || name === "addressLine2" ? (
          ""
        ) : (
          <label className="form-label required fw-bold">{label}</label>
        )}
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

  getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  daysDropDown = (value) => {
    let { form, months } = this.state;
    let month = 0;
    for (let i = 0; i < months.length; i++) {
      if (form.dobMonth === months[i]) month = i + 1;
    }

    let days =
      form.dobYear && form.dobMonth
        ? this.getDaysInMonth(month, form.dobYear)
        : "";
    let daysArr = [];
    for (let i = 1; i <= days; i++) {
      daysArr.push(i);
    }
    return (
      <select
        className="form-select form-select-sm"
        name="dobDay"
        value={value}
        onChange={this.handleChange}
      >
        <option selected value="">
          Select Date
        </option>
        {daysArr.map((opt) => (
          <option value={opt} key={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  };

  makeCityOption = () => {
    let { stateCity = [], form } = this.state;
    if (stateCity.length > 0 && form.state1) {
      let s1 = stateCity.find((ele) => ele.stateName === form.state1);
      let { cityArr = [] } = s1;
      return cityArr.map((ele) => <option key={ele}>{ele}</option>);
    }
  };

  render() {
    let { form, errors, months, stateCity = [], edit } = this.state;
    let year = [];
    for (let i = 1980; i <= 2020; i++) {
      year.push(i);
    }
    let states = [];
    if (stateCity.length > 0) {
      for (let i = 0; i <= 34; i++) {
        states.push(stateCity[i].stateName);
      }
    }

    return (
      <div className="container py-3">
        <h4 className="pb-3">Customer Details</h4>
        <form>
          <fieldset class="row mb-1">
            <legend class="col-form-label col-sm-2 pt-0 fw-bold required">
              Gender
            </legend>
            <div class="col-sm-10">
              <div
                class="form-check form-check-inline"
                style={{ paddingRight: "7rem", paddingLeft: "0" }}
              >
                <input
                  class="form-check-input mx-2"
                  type="radio"
                  name="gender"
                  id="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={this.handleChange}
                />
                <label class="form-check-label">Male</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="gender"
                  id="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={this.handleChange}
                />
                <label class="form-check-label">Female</label>
              </div>
              {errors.gender ? (
                <div className="alert alert-danger p-2" role="alert">
                  {errors.gender}
                </div>
              ) : (
                ""
              )}
            </div>
          </fieldset>
          <hr style={{ backgroundColor: "#ccc" }} />
          <label className="form-label required fw-bold">Date of Birth</label>
          <div className="row">
            <div class="col-4">
              <select
                class="form-select form-select-sm"
                id="dobYear"
                name="dobYear"
                value={form.dobYear}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
              >
                <option selected value="">
                  Select Year
                </option>
                {year.map((ele) => (
                  <option key={ele}>{ele}</option>
                ))}
              </select>
            </div>
            <div class="col-4">
              <select
                class="form-select form-select-sm"
                id="dobMonth"
                name="dobMonth"
                value={form.dobMonth}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
              >
                <option selected value="">
                  Select Month
                </option>
                {months.map((ele) => (
                  <option key={ele}>{ele}</option>
                ))}
              </select>
            </div>
            <div class="col-4">{this.daysDropDown(form.dobDay)}</div>
            {errors.dobYear || errors.dobMonth || errors.dobDay ? (
              <div className="alert alert-danger p-2" role="alert">
                {errors.dobYear || errors.dobMonth || errors.dobDay}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="row pt-3">
            {this.makeTextField("PAN", "pan", form.pan, "")}
          </div>
          <div className="row">
            <label className="form-label fw-bold">Address</label>
            <div className="col-5" style={{ marginRight: "0.5rem" }}>
              {this.makeTextField(
                "",
                "addressLine1",
                form.addressLine1,
                "Line 1"
              )}
            </div>
            <div className="col-5" style={{ marginLeft: "0.5rem" }}>
              {this.makeTextField(
                "",
                "addressLine2",
                form.addressLine2,
                "Line 2"
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <label className="form-label required fw-bold">State</label>
              <select
                class="form-select form-select-sm"
                id="state1"
                name="state1"
                value={form.state1}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
              >
                <option selected value="">
                  Select State
                </option>
                {states.map((ele) => (
                  <option key={ele}>{ele}</option>
                ))}
              </select>
              {errors.state1 ? (
                <div className="alert alert-danger p-2" role="alert">
                  {errors.state1}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="col-6">
              <label className="form-label required fw-bold">City</label>
              <select
                class="form-select form-select-sm"
                id="city"
                name="city"
                value={form.city}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
              >
                {!edit && (
                  <option selected value="">
                    Select City
                  </option>
                )}
                {!edit ? (
                  this.makeCityOption()
                ) : (
                  <option selected>{form.city}</option>
                )}
              </select>
              {errors.city ? (
                <div className="alert alert-danger p-2" role="alert">
                  {errors.city}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          {!edit ? (
            <button
              type="submit"
              className="btn btn-primary btn-sm mt-3"
              onClick={this.handleSubmit}
            >
              Add Details
            </button>
          ) : (
            ""
          )}
        </form>
      </div>
    );
  }
}
export default CustomerDetails;
