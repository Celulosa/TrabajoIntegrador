import React, {useState, useEffect} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
/* import Api from '../components/Api'; */


function App() {
  const url = 'https://khalo.onrender.com/api/totalventas'
  const [todos, setTodos] = useState()
  const fetchApi = async () => {
    const response = await fetch(url)
    console.log(response.status)
    const responseJSON = await response.json()
    setTodos(responseJSON)
    console.log(responseJSON)
  }
  useEffect(() => {
    fetchApi()
  }, [])
  return (
    <BrowserRouter>
    <Switch>
      <Route path="/" component={Dashboard}/>
     {/*  <Api /> */}
    </Switch>
    </BrowserRouter>
  );
}

export default App;