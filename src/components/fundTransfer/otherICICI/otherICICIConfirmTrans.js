import React from "react";
import * as axios from "axios";
import { withRouter } from "react-router-dom";

import AccountSelection from "../accountSelection";
import Tabs from "./tabs";
import Utilities from "../../../services/utilities";

class OtherICICIConfirmTrans extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accountToTransfer: {},
            error: ""
        }

        this.goBack = this.goBack.bind(this);
        this.confirmPay = this.confirmPay.bind(this);
    }

    componentDidMount() {
        let otherICICIBeneficiaryAccs = JSON.parse(sessionStorage.getItem("otherICICIBeneficiaryAccs")) || [];

        let accountToTransfer = {};

        otherICICIBeneficiaryAccs.map((account) => {
            if (account.selectedForTrans === true) {
                accountToTransfer = account;
            }
        })

        this.setState({
            "accountToTransfer": accountToTransfer
        });
    }

    goBack() {
        this.props.history.push("/fundTransfer/otherICICI/initTrans");
    }

    confirmPay() {
        const fundTransParams = {
            params: {
                "fromAcct": sessionStorage.getItem("accountNoFromTransfer"),
                "toAccnt": this.state.accountToTransfer.accountNumber,
                "trfAmnt": this.state.accountToTransfer.transAmt || 0,
                "header": sessionStorage.getItem("accessHeader")
            }
        }

        const params = {
            params: {
                "name": sessionStorage.getItem("userName"),
                "header": sessionStorage.getItem("accessHeader"),
            }
        }

        axios.post('/fundTransfer', fundTransParams).then(response => {
            console.log("fundTransfer", response);

            // if (response.data.isSuccessful === false) {
            axios.post('/getAllAccountsOfUser', params).then(accounts => {
                console.log("getAllAccountsOfUser", accounts);

                if (accounts || accounts.data || accounts.data.array) {
                    let savingsAccounts = [];
                    let currentAccounts = [];

                    accounts.data.array.map((account) => {
                        if (account.accountType === "Savings") {
                            savingsAccounts.push(account);
                        } else if (account.accountType === "Credit") {
                            currentAccounts.push(account);
                        }
                    })

                    var utils = new Utilities();
                    utils.resetAccounts();

                    sessionStorage.setItem("savingsAccounts", JSON.stringify(savingsAccounts))
                    sessionStorage.setItem("currentAccounts", JSON.stringify(currentAccounts));

                    this.props.history.push("/fundTransfer/otherICICI/successTrans");
                }
            }).catch(error => {
                this.setState({ "error": "Unable to get User Accounts" })
                console.log("ERROR", error);
            });
            // } else {
            //     this.setState("error", "Transaction faild.");
            // }
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="text-left">
                            <span style={{ font: "Helvetica Neue", fontWeight: "medium", fontSize: "18px", color: "#000000" }}>Fund Transfer</span>
                        </div>
                    </div>
                    <Tabs></Tabs>
                    <div className="rightPanel" style={{ paddingLeft: 0, paddingRight: 0, maxWidth: "85.66%", marginLeft: "-1.4em" }}>
                        <div style={{ border: '1px solid #707070', backgroundColor: "#F8F8F8", paddingTop: "20px", paddingLeft: "40px", paddingBottom: "20px" }}>
                            <div className="backBtn">
                                <span onClick={this.goBack}>&larr; Back</span>
                            </div>
                            <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} >
                                From Account
                                </div>
                            <AccountSelection></AccountSelection>
                        </div>
                        <div style={{ border: '1px solid #B9B9B9', boxShadow: "#000000", backgroundColor: "#FFFFFF", paddingTop: "20px", paddingLeft: "40px", paddingBottom: "30px" }}>
                            <div style={{ display: 'flex', flexDirection: 'row' }} className="m20">
                                <div style={{ flex: "0 0 35%", marginRight: "5%" }}>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        To Account
                                    </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }} className="m30">
                                        {this.state.accountToTransfer.accountOwner}
                                    </div>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Amount
                                    </div>
                                    <div style={{ paddingBottom: "10px", font: "Roboto", color: "#000000", fontSize: "14px" }} className="m20">
                                        ₹{this.state.accountToTransfer.transAmt}
                                    </div>
                                </div>
                                <div style={{ flex: "0 0 35%", marginRight: "5%" }}>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        IFSC Code
                                    </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }} className="m30">
                                        xxxxxxx1931
                                    </div>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Remark
                                    </div>
                                    <div style={{ paddingBottom: "10px", font: "Roboto", color: "#000000", fontSize: "14px" }} className="m20">
                                        {this.state.accountToTransfer.remarks}
                                    </div>
                                </div>
                                <div style={{ flex: "0 0 20%" }}>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Branch
                                    </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }} className="m30">
                                        Nagpur, MS
                                    </div>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Charges and Fees
                                    </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }} className="m20">
                                        ₹0.00
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{ font: "Roboto", color: "##454545", fontSize: "10px", paddingBottom: "5px" }}>
                                    OTP has been sent to your registered mobile number
                                </div>
                                <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px", paddingBottom: "5px" }}>
                                    Enter OTP
                                </div>
                                <div style={{ width: "400px" }}>
                                    <div style={{ paddingBottom: "10px", borderBottom: '1.5px solid #193E6C', font: "Roboto", color: "#000000", fontSize: "14px" }}>
                                        <input style={{ border: "none" }} type="password"></input>
                                    </div>
                                    <div style={{ font: "Roboto", color: "#F18324", fontSize: "12px", textAlign: "right" }} className="m30">
                                        Resend OTP
                                    </div>
                                </div>
                            </div>
                            <div class="m-10">
                                <button onClick={this.goBack} className="btn btn-primary" style={{ border: "1px solid #D9D9D9", background: "#D9D9D9", font: "Roboto", fontWeight: "medium", fontSize: "14px", borderRadius: "10px", color: "#727374", marginRight: "20px" }}>CANCEL</button>
                                <button onClick={this.confirmPay} className="btn btn-primary" style={{ border: "1px solid #F18324", background: "#F18324", font: "Roboto", fontWeight: "medium", fontSize: "14px", borderRadius: "10px", color: "##FFFFFF" }}>CONFIRM</button>
                            </div>
                            <div style={{ font: "Roboto", color: "#CB4919", fontSize: "10px", textAlign: "right", paddingRight: "20px" }}>
                                <span>More than ₹1 lakh transaction would take 4 hours to complete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(OtherICICIConfirmTrans)