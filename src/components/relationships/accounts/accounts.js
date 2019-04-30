import React from "react";
import { withRouter } from "react-router-dom";

import Tabs from "./tabs";
import Savings from "./savings";
import Current from "./current";

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            savingsAccounts: [],
            currentAccounts: [],
            error: ""
        }
    }

    componentDidMount() {
        let savingsAccounts = JSON.parse(sessionStorage.getItem("savingsAccounts"));
        let currentAccounts = JSON.parse(sessionStorage.getItem("currentAccounts"));

        this.setState({
            "savingsAccounts": savingsAccounts,
            "currentAccounts": currentAccounts
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="text-left">
                            <span style={{ font: "Helvetica Neue", fontWeight: "medium", fontSize: "18px", color: "#000000" }}>My Relationships testing</span>
                        </div>
                    </div>
                    <Tabs></Tabs>
                    <div className="rightPanel" style={{ paddingLeft: 0, paddingRight: 0, maxWidth: "85.67%", marginLeft: "-1.5em" }}>
                        <div style={{ border: '1px solid #707070', boxShadow: "#000000", backgroundColor: "#F5F5F5", paddingTop: "0px", paddingLeft: "0px", paddingBottom: "50px" }}>
                            {
                                this.state.savingsAccounts ? this.state.savingsAccounts.map((account) => {
                                    return <Savings account={account}></Savings>
                                }) : null
                            }
                            {
                                // this.state.currentAccounts ? this.state.currentAccounts.map((account) => {
                                    this.state.savingsAccounts ? this.state.savingsAccounts.map((account) => {
                                    return <Current account={account}></Current>
                                }) : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Account)