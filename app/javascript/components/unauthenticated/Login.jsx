/* eslint-disable react/prefer-stateless-function */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RestClient from '../../services/RestClient';
// import { Settings, KEYS } from '../services/settings';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');

  const submit = () => {
    RestClient.fetchLogin(username, password)
      .then((result) => {
        if (result.ok) {
          // console.log(`woohoo.  successfully logged in ${result.msg}`);
          // Settings.set(KEYS.TOKENS.AUTH, result.token);
          // Settings.set(KEYS.TOKENS.REFRESH, result.refreshToken);
          window.location.replace(window.location.origin);
        } else {
          console.log(`FUCK! ${result.statusMessage}`);
        }
      });
  };

  return (
    <div className="container-fluid splash-div min-vh-100 w-100">
      <div className="row min-vh-100 align-items-center">
        <div className="login-div col-sm-10 offset-sm-1 col-lg-6 offset-lg-4 col-xl-4 offset-xl-6">
          <div className="row">
            <div className="col">
              <label htmlFor="username" className="w-100">
                Email or username
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label htmlFor="password" className="w-100">
                Password
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="row">
            <div id="errorMessage" />
          </div>
          <div id="buttons" className="row">
            <div className="col text-center">
              <button type="button" className="btn btn-primary" onClick={submit}>
                Submit
              </button>
            </div>
          </div>
          <hr />
          <div id="loginOptions" className="row">
            <div className="col text-center">
              <Link className="btn btn-sm btn-outline-success" to="/register">
                Sign me up!
              </Link>
            </div>
            <div className="col text-center">
              <Link className="btn btn-sm btn-outline-success" to="/reset">
                Halp!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
