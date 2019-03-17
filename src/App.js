import React from 'react';

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