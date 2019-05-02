import React from 'react';
import ReactDOM from 'react-dom';
// import require from "requirejs";

import App from './App';
import './bootstrap.css';
// import './bootstrap.bundle.js';
import './index.css';
console.log(process.env.NODE_ENV)

ReactDOM.render(<App />, document.getElementById('root'));