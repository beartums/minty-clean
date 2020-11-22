import React from 'react';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Login from './unauthenticated/Login';
import Register from './unauthenticated/Register';
import Reset from './unauthenticated/Reset';
import AppRouter from './AppRouter';

import { KEYS, Settings } from '../services/settings';

const Router = () => {
  const isLoggedIn = () => Settings.get(KEYS.TOKENS.AUTH);

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/reset">
            <Reset />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">
            {isLoggedIn() ? <AppRouter /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </BrowserRouter>
      <ToastContainer positions="bottom-center" autoClose={5000} closeOnClick pauseOnFocusLoss pauseOnHover />
    </div>
  );
};

export default Router;
