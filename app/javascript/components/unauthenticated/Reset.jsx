/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Link } from 'react-router-dom';
import RestClient from '../../services/RestClient';

const Reset = () => {
  const submit = (e) => {
    const emailOrUsername = e.target.email;
    if (!emailOrUsername || emailOrUsername === '') return;
    RestClient.fetchPasswordReset(emailOrUsername)
      .then((result) => {
        console.log(`woohoo.  successfully reset sent in ${result.msg}`);
      })
      .catch((result) => {
        console.log(`seems like there was an error, matey (${result.msg})`);
      });
  };

  return (
    <div className="container-fluid splash-div min-vh-100 w-100">
      <div className="row min-vh-100 align-items-center">
        <div className="login-div col-sm-10 offset-sm-1 col-lg-6 offset-lg-4 col-xl-4 offset-xl-6">
          <form onSubmit={submit}>
            <div className="row">
              <div className="col">
                <label htmlFor="username" className="w-100">
                  Email or username
                  <input
                    type="text"
                    id="email"
                    className="form-control"
                  />
                </label>
              </div>
            </div>
            <div id="buttons" className="row">
              <div className="col text-center">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
          <hr />
          <div className="row">
            <div className="col text-center">
              <Link className="btn btn-sm btn-outline-success" to="/register" title="I can haz account?">
                Sign me up!
              </Link>
            </div>
            <div className="col text-center" title="Arrrgh, log me in, ye scurvy scallywag!">
              <Link className="btn btn-sm btn-outline-success" to="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset;
