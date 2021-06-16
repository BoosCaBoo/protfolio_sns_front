import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter } from "react-router-dom";
import { Auth } from './components/organisms/layout/Auth';


ReactDOM.render(
  
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path="/" component={Auth} />   
      <Route exact path="/home" component={App} />   
    </BrowserRouter>
  </Provider>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
