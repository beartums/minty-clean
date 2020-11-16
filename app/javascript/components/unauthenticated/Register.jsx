/* eslint-disable react/prefer-stateless-function */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RestClient from '../../services/RestClient';
// import { Settings, KEYS } from '../services/settings';

const Register = () => {
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailsMatch, setEmailsMatch] = useState(true);
  const [isValidUsername, setisValidUsername] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch || !emailsMatch || !isValidUsername) return;

    const user = {
      username: e.target.form.username.value,
      password: e.target.form.password.value,
      passwordConfirmation: e.target.form.passwordConfirm.value,
      firstName: e.target.form.firstName.value,
      lastName: e.target.form.lastName.value,
      email: e.target.form.email.value,
    };

    RestClient.postUser(user)
      .then((response) => {
        if (response.ok) {
          console.log(`woohoo.  successfully logged in ${response.data.message}`);
          RestClient.setTokens(response.data);
          window.location.replace(window.location.origin);
        } else {
          console.log(`Fuck!  ${response.statusMessage}`);
          // setError(response.msg);
        }
      });
  };

  const validatePasswords = (e) => {
    setPasswordsMatch(e.target.form.password.value === e.target.form.passwordConfirm.value);
  };

  const validateEmails = (e) => {
    setEmailsMatch(e.target.form.email.value === e.target.form.emailConfirm.value);
  };

  const validateUsername = () => {
    setisValidUsername(true);
  };

  return (
    <div className="container-fluid splash-div min-vh-100 w-100">
      <div className="row min-vh-100 align-items-center">
        <div className="login-div col-sm-10 offset-sm-1 col-lg-6 offset-lg-4 col-xl-4 offset-xl-6">
          <div className="row">
            <div className="col">
              <form>
                <div className="row">
                  <div className="col">
                    <label htmlFor="username" className="w-100">
                      Username
                      <input
                        type="text"
                        name="username"
                        className={`form-control ${isValidUsername ? '' : 'error'}`}
                        onChange={(e) => validateUsername(e.target.value)}
                      />
                    </label>
                    <label htmlFor="email" className="w-100">
                      Email
                      <input
                        type="text"
                        name="email"
                        className={`form-control ${emailsMatch ? '' : 'error'}`}
                        onChange={(e) => validateEmails(e)}
                      />
                    </label>
                    <label htmlFor="emailConfirm" className="w-100">
                      Email Confirmation
                      <input
                        type="text"
                        name="emailConfirm"
                        className={`form-control ${emailsMatch ? '' : 'error'}`}
                        onChange={(e) => validateEmails(e)}
                      />
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="firstName" className="w-100">
                      First Name
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                      />
                    </label>
                  </div>
                  <div className="col">
                    <label htmlFor="lastName" className="w-100">
                      Last Name
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                      />
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="password" className="w-100">
                      Password
                      <input
                        type="password"
                        name="password"
                        className={`form-control ${passwordsMatch ? '' : 'error'}`}
                        onChange={(e) => validatePasswords(e)}
                      />
                    </label>
                    <label htmlFor="passwordConfirm" className="w-100">
                      Confirm Password
                      <input
                        type="password"
                        name="passwordConfirm"
                        className={`form-control ${passwordsMatch ? '' : 'error'}`}
                        onChange={(e) => validatePasswords(e)}
                      />
                    </label>
                  </div>
                </div>
                <button type="button" onClick={onSubmit} className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div id="loginOptions" className="row">
            <div className="col text-center">
              <Link className="btn btn-sm btn-outline-success" to="/login" title="What the hell am I doing on this page?  I already have an account!">
                Login
              </Link>
            </div>
            <div className="col text-center">
              <Link className="btn btn-sm btn-outline-success" to="/reset" title="I can haz passwurd reset?">
                Halp!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
