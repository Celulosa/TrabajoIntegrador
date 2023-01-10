import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Api from '../components/Api';
function App() {
  return (
    <BrowserRouter>
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Api />
    </Switch>
    </BrowserRouter>
  );
}

export default App;
