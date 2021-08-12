import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";

class NomineeDetails extends Component {
  state = {
    form: {
      nomineeName: "",
      gender: "",
      year: "",
      month: "",
      day: "",
      relation: "",
      jointSignatory: "",
    },
    errors: {},
    edit: false,
    months: [
      "Jan",
      "Feb",
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
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    input.type === "checkbox"
      ? (s1.form[input.name] = input.checked)
      : (s1.form[input.name] = input.value);
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
    let { nomineeName, gender, year, month, day, relation } = this.state.form;
    let errors = {};
    errors.nomineeName = this.validateNominee(nomineeName);
    errors.gender = this.validateGender(gender);
    errors.year = this.validateDate(year);
    errors.month = this.validateDate(month);
    errors.day = this.validateDate(day);
    errors.relation = this.validateRelation(relation);
    this.setState({ errors: errors });
    return errors;
  };

  validateNominee = (name) => (!name ? "Please enter Nominee Name" : "");
  validateGender = (gender) => (!gender ? "Choose any one gender option" : "");
  validateDate = (date) => (!date ? "Select Date" : "");
  validateRelation = (relation) =>
    !relation ? "Please enter Relationship" : "";

  async fetchData() {
    let user = auth.getUser();
    let response = await http.get(`/getNominee/${user.name}`);
    let { data } = response;
    console.log("Nominee ", data);
    if (data.nomineeName) {
      console.log(data.jointsignatory);
      let date = data.dob;
      let day = date[2] === "-" ? date.substring(0, 2) : date.substring(0, 1);
      let month =
        date[2] === "-"
          ? date.substring(3, date.length - 5)
          : date.substring(2, date.length - 5);
      let year = date.substring(date.length - 4);
      let form = {
        gender: data.gender,
        year: year,
        month: month,
        day: day,
        nomineeName: data.nomineeName,
        relation: data.relationship,
        jointSignatory: data.jointsignatory,
      };
      this.setState({ form: form, edit: true });
    }
  }

  async componentDidMount() {
    this.fetchData();
  }

  async postData(url, obj) {
    console.log("obj", obj);
    let response = await http.post(url, obj);
    alert(obj.name + " Your nominee :: " + obj.nomineeName);
    this.props.history.push("/customer");
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      let user = auth.getUser();
      let { nomineeName, gender, year, month, day, relation, jointSignatory } =
        this.state.form;
      let DOB = day + "-" + month + "-" + year;
      let data = {
        name: user.name,
        nomineeName: nomineeName,
        gender: gender,
        dob: DOB,
        relationship: relation,
        jointsignatory: jointSignatory,
      };
      this.postData("/nomineeDetails", data);
    }
  };

  makeTextField(label, name, val) {
    let { errors } = this.state;
    return (
      <div class="mb-3">
        <label className="form-label required fw-bold">{label}</label>
        <input
          class="form-control form-control-sm"
          type="text"
          id={name}
          name={name}
          value={val}
          onChange={this.handleChange}
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
      if (form.month === months[i]) month = i + 1;
    }

    let days =
      form.year && form.month ? this.getDaysInMonth(month, form.year) : "";
    let daysArr = [];
    for (let i = 1; i <= days; i++) {
      daysArr.push(i);
    }
    return (
      <select
        className="form-select form-select-sm"
        id="day"
        name="day"
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

  render() {
    let { form, errors, months, edit } = this.state;
    let year = [];
    for (let i = 1960; i <= 2020; i++) {
      year.push(i);
    }
    return (
      <div className="container py-3">
        <h4>Nominee Details</h4>
        <form>
          {this.makeTextField("Name", "nomineeName", form.nomineeName)}
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
          <div className="row pb-3">
            <div class="col-4">
              <select
                class="form-select form-select-sm"
                id="year"
                name="year"
                value={form.year}
                onChange={this.handleChange}
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
                id="month"
                name="month"
                value={form.month}
                onChange={this.handleChange}
              >
                <option selected value="">
                  Select Month
                </option>
                {months.map((ele) => (
                  <option key={ele}>{ele}</option>
                ))}
              </select>
            </div>
            <div class="col-4">{this.daysDropDown(form.day)}</div>
            {errors.year || errors.month || errors.day ? (
              <div className="alert alert-danger p-2" role="alert">
                {errors.year || errors.month || errors.day}
              </div>
            ) : (
              ""
            )}
          </div>
          <hr style={{ backgroundColor: "#ccc" }} />
          {this.makeTextField("Relationship", "relation", form.relation)}
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              name="jointSignatory"
              id="jointSignatory"
              value={form.jointSignatory}
              checked={form.jointSignatory}
              onChange={this.handleChange}
            />
            <label class="form-check-label">Joint Signatory</label>
          </div>
          {!edit ? (
            <button
              type="submit"
              className="btn btn-primary btn-sm mt-3"
              onClick={this.handleSubmit}
            >
              Add Nominee
            </button>
          ) : (
            ""
          )}
        </form>
      </div>
    );
  }
}
export default NomineeDetails;
