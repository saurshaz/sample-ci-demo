import React from "react";
import { withRouter } from "react-router-dom";

import Utilities from "../../../services/utilities";
import icn_success from "../../../images/icn_success.png";

class OwnICICISuccessTrans extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accountFromTransfer: {},
            accountToTransfer: {},
            error: ""
        }

        this.makeAnotherTranscation = this.makeAnotherTranscation.bind(this);
        this.done = this.done.bind(this);
    }


    componentDidMount() {
        let savingsAccounts = JSON.parse(sessionStorage.getItem("savingsAccounts")) || [];
        let currentAccounts = JSON.parse(sessionStorage.getItem("currentAccounts")) || [];
        let accountNoFromTransfer = sessionStorage.getItem("accountNoFromTransfer") || -1;

        // let frequentBeneficiaryAccs = JSON.parse(sessionStorage.getItem("frequentBeneficiaryAccs")) || [];

        let accountFromTransfer = {};
        let accountToTransfer = {};

        savingsAccounts.map((account) => {
            if (account.accountNumber === accountNoFromTransfer) {
                accountFromTransfer = account;
            }
        })

        currentAccounts.map((account) => {
            if (account.accountNumber === accountNoFromTransfer) {
                accountFromTransfer = account;
            }
        })

        this.mergeOwnICICAccountsFromSession().map((account) => {
            if (account.selectedForTrans === true) {
                accountToTransfer = account;
            }
        })

        this.setState({
            "accountFromTransfer": accountFromTransfer,
            "accountToTransfer": accountToTransfer
        });
    }


    mergeOwnICICAccountsFromSession() {
        const savingsAccounts = JSON.parse(sessionStorage.getItem("savingsAccounts"));
        const currentAccounts = JSON.parse(sessionStorage.getItem("currentAccounts"));

        const ownICICIAccs = [...savingsAccounts, ...currentAccounts];

        return ownICICIAccs;
    }

    makeAnotherTranscation() {
        var utils = new Utilities();

        utils.resetAccounts();
        this.props.history.push("/fundTransfer/ownICICI");
    }

    done() {
        var utils = new Utilities();

        utils.resetAccounts();
        this.props.history.push("/");
    }

    formatDate() {
        let date = new Date();
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
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
                    <div className="col-12 m40" style={{ border: '1px solid #707070', backgroundColor: "#FFFFFF" }}>
                        <div style={{ paddingTop: "20px", paddingLeft: "40px", paddingBottom: "20px" }}>
                            <div style={{ textAlign: "center" }} className="m10">
                                <img src={icn_success}></img>
                            </div>
                            <div style={{ font: "Roboto", color: "#193E6C", fontSize: "24px", textAlign: "center" }} className="m10">
                                Transcation Successful
                            </div>
                            <div style={{ font: "Roboto", color: "#00040A", fontSize: "20px", textAlign: "center" }}>
                                {/* Amount <span style={{ fontWeight: "bold" }}>₹{this.state.accountToTransfer.transAmt}</span> */}
                                Amount <span style={{ fontWeight: "bold" }}>&#x20B9;{Number(this.state.accountToTransfer.transAmt || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ font: "Roboto", color: "#00040A", fontSize: "14px", textAlign: "center" }}>
                                from {this.state.accountFromTransfer.accountNumber} has been sent to the
                            </div>
                            <div style={{ font: "Roboto", color: "#00040A", fontSize: "14px", fontWeight: "bold", textAlign: "center" }}>
                                {this.state.accountToTransfer.accountOwner}
                            </div>
                            <div style={{ font: "Roboto", color: "#00040A", fontSize: "14px", textAlign: "center" }}>
                                {this.state.accountToTransfer.bank + " " + this.state.accountToTransfer.accountNumber}
                            </div>

                        </div>
                        <div style={{ paddingTop: "20px", paddingLeft: "40px", paddingBottom: "30px" }}>
                            <div style={{ display: 'flex', flexDirection: 'row' }} className="m20">
                                <div style={{ flex: "0 0 30%", marginRight: "5%" }}>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Transaction Reference No.
                                    </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }} className="m30">
                                        898351232134
                                    </div>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        IFSC Code
                                    </div>
                                    <div style={{ paddingBottom: "10px", font: "Roboto", color: "#000000", fontSize: "14px" }} className="m20">
                                        HDFC235255
                                    </div>
                                </div>
                                <div style={{ flex: "0 0 30%", marginRight: "5%" }}>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Transaction Date and Time
                                    </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }} className="m30">
                                        {this.formatDate()}
                                    </div>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Branch
                                    </div>
                                    <div style={{ paddingBottom: "10px", font: "Roboto", color: "#000000", fontSize: "14px" }} className="m20">
                                        Nagpur, MS
                                    </div>
                                </div>
                                <div style={{ flex: "0 0 30%" }}>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        From Account
                                    </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }} className="m30">
                                        {this.state.accountFromTransfer.accountType + " " + this.state.accountFromTransfer.accountNumber}
                                    </div>
                                    <div style={{ font: "Roboto", color: "#193E6C", fontSize: "12px" }} className="m10">
                                        Remarks
                                    </div>
                                    <div style={{ font: "Roboto", color: "#000000", fontSize: "14px" }} className="m20">
                                        {this.state.accountToTransfer.remarks}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center" }} className="m20">
                                <button onClick={this.makeAnotherTranscation} className="btn btn-primary" style={{ width: "250px", border: "1px solid #D9D9D9", background: "#D9D9D9", font: "Roboto", fontWeight: "medium", fontSize: "14px", borderRadius: "10px", color: "#727374", marginRight: "20px" }}>MAKE ANOTHER TRANSACTION</button>
                                <button onClick={this.done} className="btn btn-primary" style={{ border: "1px solid #F18324", background: "#F18324", font: "Roboto", fontWeight: "medium", fontSize: "14px", borderRadius: "10px", color: "##FFFFFF" }}>DONE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(OwnICICISuccessTrans)