import React from 'react';
import { Link } from 'react-router-dom';

const SimpleMessage = (message) => (
  <div className="container-fluid splash-div min-vh-100 w-100">
    <div className="row min-vh-100 align-items-center">
      <div className="login-div col-sm-10 offset-sm-1 col-lg-6 offset-lg-4 col-xl-4 offset-xl-6">
        <div className="message-div">
          {message}
        </div>
        <div className="row">
          <div className="col text-center" titel="Arrrgh, log me in, ye scurvy scallywag!">
            <Link className="btn btn-sm btn-outline-success" to="/login">
              Login
            </Link>
          </div>
          <div className="col text-center">
            <Link className="btn btn-sm btn-outline-success" to="/register" title="I can haz account?">
              Sign me up!
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SimpleMessage;
