import React from "react";
import { Link, withRouter } from "react-router-dom";

import icn_transfeerfunds from "../../../images/icn_transfeerfunds.png";
import icn_fixeddeposit from "../../../images/icn_fixeddeposit.png";
import icn_investinshares from "../../../images/icn_investinshares.png";
import icn_recurringdeposit from "../../../images/icn_recurringdeposit.png";

class Savings extends React.Component {
    constructor(props) {
        super(props);

        this.transferFund = this.transferFund.bind(this);
    }

    formatDate() {
        let date = new Date();
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
    }

    transferFund(e) {
        e.preventDefault();

        sessionStorage.setItem("accountNoFromTransfer", this.props.account.accountNumber);

        this.props.history.push("/fundTransfer");
    }

    render() {
        return (
            <div style={{ border: '1px solid #707070', boxShadow: "#000000", backgroundColor: "#FFFFFF", paddingTop: "20px", paddingLeft: "40px", paddingBottom: "30px",height:"207px" }}>
                <div style={{display:"flex",flexDirection:"row"}}>
                    <div style={{ font: "Roboto, Regular", color: "#000000", fontSize: "14px", flex:"0 0 61%", font: "Roboto, Regular", color: "#000000", fontSize: "14px" }} className="m10">
                        Savings Account {this.props.account.accountNumber}
                    </div>
                    <div style={{ font: "Roboto, Regular", color: "#000000", fontSize: "12px" }} className="m10">
                        Current withdrawal Balance as on {this.formatDate()}
                    </div>
                </div>
                <div style={{ font: "Roboto, Regular", color: "#193E6C", fontWeight: "bold", fontSize: "40px",paddingBottom:"30px" }}>
                    {/* &#x20b9; {this.props.account.currentBalance} */}
                    &#x20b9; {Number(this.props.account.currentBalance || 0).toLocaleString('en-IN')}
                </div>
                {/* <div style={{ font: "Roboto, Regular", color: "#193E6C", fontSize: "14px" }} className="m10">
                    Current withdrawal Balance as on {this.formatDate()}
                </div> */}
                <div style={{ display: 'flex', flexDirection: 'row' }} >
                    <div style={{ flex: "0 0 19%", marginRight: "5%" }}>
                        <div>
                            <a onClick={this.transferFund} style={{ cursor: "pointer" }}>
                                <img src={icn_transfeerfunds}></img>
                                <span style={{ font: "Roboto", color: "#193E6C", fontSize: "12px", paddingLeft: "10px" }}>
                                    Transfer Funds
                                </span>
                            </a>
                        </div>
                    </div>
                    <div style={{ flex: "0 0 25%", marginRight: "5%" }}>
                        <div>
                            <img src={icn_recurringdeposit}></img>
                            <span style={{ font: "Roboto", color: "#193E6C", fontSize: "12px", paddingLeft: "10px" }}>
                                Open Recurring Deposit
                            </span>
                        </div>
                    </div>
                    <div style={{ flex: "0 0 18%", marginRight: "5%" }}>
                        <div>
                            <img src={icn_investinshares}></img>
                            <span style={{ font: "Roboto", color: "#193E6C", fontSize: "12px", paddingLeft: "10px" }}>
                                Invest in Shares
                            </span>
                        </div>
                    </div>
                    <div style={{ flex: "0 0 25%", marginRight: "5%" }}>
                        <div>
                            <img src={icn_fixeddeposit}></img>
                            <span style={{ font: "Roboto", color: "#193E6C", fontSize: "12px", paddingLeft: "10px" }}>
                                Open Fixed Deposit
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Savings);