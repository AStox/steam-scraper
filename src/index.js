import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloProvider} from 'react-apollo';
import 'bootstrap/dist/css/bootstrap.min.css';

import WebFont from 'webfontloader';
import App from './App';
import * as serviceWorker from './serviceWorker';

import client from './apollo';


WebFont.load({
  google: {
    families: ['Montserrat:100,300,500', 'sans-serif'],
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
if (module.hot) module.hot.accept();
