import React from "react";
import { withRouter } from "react-router-dom";
// import { axiosInstance as axios } from "../../../lib";

import AccountSelection from "../accountSelection";
import Tabs from "./tabs";
import Utilities from "../../../services/utilities";

class OtherBankInitTrans extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accountToTransfer: {},
            error: ""
        }

        this.handleTransAmtChange = this.handleTransAmtChange.bind(this);
        this.handleRemarksChange = this.handleRemarksChange.bind(this);
        this.goBack = this.goBack.bind(this);
        this.cancelTrans = this.cancelTrans.bind(this);
        this.goForward = this.goForward.bind(this);
    }


    componentDidMount() {
        let otherBankBeneficiaryAccs = JSON.parse(sessionStorage.getItem("otherBankBeneficiaryAccs")) || [];

        let accountToTransfer = {};

        otherBankBeneficiaryAccs.map((account) => {
            if (account.selectedForTrans === true) {
                accountToTransfer = account;
            }
        })

        this.setState({
            "accountToTransfer": accountToTransfer
        });
    }

    handleTransAmtChange = (evt) => {
        this.state.accountToTransfer.transAmt = evt.target.value;
        this.setState({ "accountToTransfer": this.state.accountToTransfer });
    }

    handleRemarksChange = (evt) => {
        this.state.accountToTransfer.remarks = evt.target.value;
        this.setState({ "accountToTransfer": this.state.accountToTransfer });
    }

    goBack() {
        this.props.history.push("/fundTransfer/otherBank/");
    }

    cancelTrans() {
        var utils = new Utilities();

        utils.resetAccounts();
        this.props.history.push("/");
    }

    goForward() {
        let otherBankBeneficiaryAccs = JSON.parse(sessionStorage.getItem("otherBankBeneficiaryAccs")) || [];

        if (Number(this.state.accountToTransfer.transAmt) <= 0) {
            alert("Please enter the amount to transfer!");
            return;
        }

        if (this.checkSufficientFunds() == false) {
            alert("Insufficient funds to transfer!");
            return;
        }

        otherBankBeneficiaryAccs.map((account) => {
            if (account) {
                if (account.accountNumber === this.state.accountToTransfer.accountNumber) {
                    account.transAmt = this.state.accountToTransfer.transAmt;
                    account.remarks = this.state.accountToTransfer.remarks;
                }
            }
        });

        sessionStorage.setItem("otherBankBeneficiaryAccs", JSON.stringify(otherBankBeneficiaryAccs));

        this.props.history.push("/fundTransfer/otherBank/confirmTrans");
    }

    checkSufficientFunds() {
        let ret = false;
        const savingsAccounts = JSON.parse(sessionStorage.getItem("savingsAccounts"));
        const currentAccounts = JSON.parse(sessionStorage.getItem("currentAccounts"));

        let ownICICIAccs = [...savingsAccounts, ...currentAccounts];

        ownICICIAccs.map((ownAccount) => {
            console.log("ownAccount", ownAccount.accountType, ownAccount.accountNumber, ownAccount.currentBalance);

            if (ownAccount.accountNumber === sessionStorage.getItem("accountNoFromTransfer")) {
                if (Number(ownAccount.currentBalance) >= Number(this.state.accountToTransfer.transAmt)) {
                    ret = true;
                }
            }
        })

        return ret;
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="text-left">
                            <span style={{ font: "Helvetica Neue", fontWeight: "medium", fontSize: "18px", color: "#000000" }} className="m20">Fund Transfer</span>
                        </div>
                    </div>
                    <Tabs></Tabs>
                    <div className="rightPanel" style={{ paddingLeft: 0, paddingRight: 0, maxWidth: "85.66%", marginLeft: "-2.4em" }}>
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
                            <div style={{ display: 'flex', flexDirection: 'row' }} className="m50">
                                <div style={{ flex: "0 0 35%", marginRight: "5%" }}>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        To Account
                                </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }} className="m30">
                                        {this.state.accountToTransfer.accountOwner}
                                    </div>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Enter the Amount
                                </div>
                                    <div style={{ paddingBottom: "10px", borderBottom: '1.5px solid #193E6C', font: "Roboto", color: "#000000", fontSize: "14px" }}>
                                        <input style={{ border: "none" }} onChange={this.handleTransAmtChange} value={this.state.accountToTransfer.transAmt}></input>
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
                                    <div style={{ paddingBottom: "10px", borderBottom: '1.5px solid #193E6C', font: "Roboto", color: "#000000", fontSize: "14px" }}>
                                        <input style={{ border: "none" }} onChange={this.handleRemarksChange} value={this.state.accountToTransfer.remarks}></input>
                                    </div>
                                </div>
                                <div style={{ flex: "0 0 20%" }}>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Branch
                                </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }}>
                                        Nagpur, MH
                                </div>
                                </div>
                            </div>
                            <div class="m-10">
                                <button onClick={this.cancelTrans} className="btn btn-primary" style={{ border: "1px solid #D9D9D9", background: "#D9D9D9", font: "Roboto", fontWeight: "medium", fontSize: "14px", borderRadius: "10px", color: "#727374", marginRight: "20px" }}>CANCEL</button>
                                <button onClick={this.goForward} className="btn btn-primary" style={{ border: "1px solid #F18324", background: "#F18324", font: "Roboto", fontWeight: "medium", fontSize: "14px", borderRadius: "10px", color: "##FFFFFF" }}>PROCEED TO PAY</button>
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

export default withRouter(OtherBankInitTrans)