import React from 'react';
// import { WL } from "ibm-mfp-web-sdk";
// import * as a from "ibmmfpfanalytics"
import * as mfp from "ibm-mfp-web-sdk";
// import { WL } from "ibm-mfp-web-sdk/ibmmfpf";
// var ibmmfpfanalytics = require("ibm-mfp-web-sdk/lib/analytics/ibmmfpfanalytics");
// import { WL } from "ibm-mfp-web-sdk/ibmmfpf";

import './App.css';
import './Main.css';
import './Tabs.css';
import './Login.css';

import Login from "./components/login/login";
import Bank from "./components/bank";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loggedIn: false }

    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);

    var wlInitOptions = {
      mfpContextRoot: '/mfp',
      applicationId: 'com.demo.icicibank',
      sessionMode: true
    };

    mfp.WL.Client.init(wlInitOptions).then(
      function () {
        mfp.ibmmfpfanalytics.logger.config({ analyticsCapture: true });

        console.log("Analytics for applicaiton: com.data.icicibank, intialized.");

        // ibmmfpfanalytics.addEvent({ 'Application initialized': 'Analytics for applicaiton: com.data.icicibank, intialized.' });
        // ibmmfpfanalytics.send();
      });
  }

  logIn() {
    this.setState({ loggedIn: true })
  }

  logOut() {
    sessionStorage.clear();
    this.setState({ loggedIn: false })
  }

  render() {
    return (
      <div>
        {this.state.loggedIn ? <Bank logOut={this.logOut}></Bank> : <Login logIn={this.logIn}></Login>}
      </div>
    )
  }
}