import React, { Component } from 'react';
// import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './Main';
// import Error from './Error';
// import CategoryGroups from './CategoryGroups';
// import AllTransactions from './AllTransactions';

class App extends React.Component {
  render() {
    return (
      <Main />
      // <main>
      //   <Switch>
      //     <Route path='/' component={Main} exact />
      //     <Route path='/analysis' component={CategoryGroups} />
      //     <Route path='/all' component={AllTransactions} />
      //     <Route component={Error} />
      //   </Switch>
      // </main>
    )
  }
}

export default App;