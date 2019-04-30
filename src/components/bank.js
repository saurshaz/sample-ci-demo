import React from 'react';
import { Route, Switch, BrowserRouter as Router, withRouter } from "react-router-dom";
import Modal from 'react-modal';
import { axiosInstance as axios } from "../lib";


import ibmmfpfanalytics from "ibm-mfp-web-sdk/lib/analytics/ibmmfpfanalytics";

import logo from "../images/logo-new.png";
import sidebarTop from "../images/sidebar-top.png"
import sidebarMiddle from "../images/sidebar-middle.png"
import sidebarBottom from "../images/sidebar-bottom.png"
import bell from "../images/bell-32.png"

import '../App.css';
import '../Main.css';
import '../Tabs.css';

import LoggedInUser from "./loggedInUser";
import Accounts from "./relationships/accounts/accounts";

import FrequentPayeeSelAcc from './fundTransfer/frequentPayee/frequentPayeeSelAcc';
import FrequentPayeeInitTrans from "./fundTransfer/frequentPayee/frequentPayeeInitTrans";
import FrequentPayeeConfirmTrans from "./fundTransfer/frequentPayee/frequentPayeeConfirmTrans";
import FrequentPayeeSuccessTrans from "./fundTransfer/frequentPayee/frequentPayeeSuccessTrans";

import OwnICICISelAcc from './fundTransfer/ownICICI/ownICICISelAcc';
import OwnICICIInitTrans from "./fundTransfer/ownICICI/ownICICIInitTrans";
import OwnICICIConfirmTrans from "./fundTransfer/ownICICI/ownICICIConfirmTrans";
import OwnICICISuccessTrans from "./fundTransfer/ownICICI/ownICICISuccessTrans";

import OtherICICISelAcc from './fundTransfer/otherICICI/otherICICISelAcc';
import OtherICICIInitTrans from "./fundTransfer/otherICICI/otherICICIInitTrans";
import OtherICICIConfirmTrans from "./fundTransfer/otherICICI/otherICICIConfirmTrans";
import OtherICICISuccessTrans from "./fundTransfer/otherICICI/otherICICISuccessTrans";

import OtherBankSelAcc from './fundTransfer/otherBank/otherBankSelAcc';
import OtherBankInitTrans from "./fundTransfer/otherBank/otherBankInitTrans";
import OtherBankConfirmTrans from "./fundTransfer/otherBank/otherBankConfirmTrans";
import OtherBankSuccessTrans from "./fundTransfer/otherBank/otherBankSuccessTrans";


export default class Bank extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false
        }

        this.logOut = this.logOut.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this)
        this.closeModalOk = this.closeModalOk.bind(this)
        this.closeModalCancel = this.closeModalCancel.bind(this);
    }

    logOut() {
        if (window.location.pathname.indexOf("/confirmTrans") > 0) {
            console.log("Show popup!!!");
            this.openModal();
        } else {
            window.location = "/";
            this.props.logOut();
        }
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        ibmmfpfanalytics.addEvent({ 'buttonClick-WEB': 'Logout' });
        ibmmfpfanalytics.send();

        console.log("Model Close");
        this.setState({ modalIsOpen: false });
    }

    closeModalOk() {
        console.log("Model Close - Ok");

        let accountFromTransfer = this.getAccountFromTransfer();
        let accountToTransfer = {};
        let data = {};

        if (window.location.pathname.indexOf("frequentPayee/confirmTrans") > 0) {
            const frequentBeneficiaryAccs = JSON.parse(sessionStorage.getItem("frequentBeneficiaryAccs")) || [];

            frequentBeneficiaryAccs.map((account) => {
                if (account.selectedForTrans === true) {
                    accountToTransfer = account;
                }
            })

            data = this.createRequestPacket(accountFromTransfer, accountToTransfer);
        } else if (window.location.pathname.indexOf("ownICICI/confirmTrans") > 0) {
            this.mergeOwnICICAccountsFromSession().map((account) => {
                if (account.selectedForTrans === true) {
                    accountToTransfer = account;
                }
            })

            data = this.createRequestPacket(accountFromTransfer, accountToTransfer);
        } else if (window.location.pathname.indexOf("otherICICI/confirmTrans") > 0) {
            const otherICICIBeneficiaryAccs = JSON.parse(sessionStorage.getItem("otherICICIBeneficiaryAccs")) || [];

            otherICICIBeneficiaryAccs.map((account) => {
                if (account.selectedForTrans === true) {
                    accountToTransfer = account;
                }
            })

            data = this.createRequestPacket(accountFromTransfer, accountToTransfer);
        } else if (window.location.pathname.indexOf("otherBank/confirmTrans") > 0) {
            const otherBankBeneficiaryAccs = JSON.parse(sessionStorage.getItem("otherBankBeneficiaryAccs")) || [];

            otherBankBeneficiaryAccs.map((account) => {
                if (account.selectedForTrans === true) {
                    accountToTransfer = account;
                }
            })

            data = this.createRequestPacket(accountFromTransfer, accountToTransfer);
        }

        console.log(data);

        axios.post('/saveTransaction', data).then(response => {
            console.log("saveTransaction", response);

            this.setState({ modalIsOpen: false });
            // ibmmfpfanalytics.addEvent({ 'ICICI-Demo-Model Closed, Logging out': 'Logout' });
            ibmmfpfanalytics.addEvent({ "fromPage-WEB": "Model" });
            ibmmfpfanalytics.addEvent({ "toPage-WEB": "Login" });
            ibmmfpfanalytics.send();

            window.location = "/";
            this.props.logOut();
        }).catch(error => {
            this.setState({ loginDisabled: false, "error": "Unable to save transaction" })
            console.log("ERROR", error);
        });
    }

    closeModalCancel() {
        console.log("Model Close - Cancel");
        this.setState({ modalIsOpen: false });

        window.location = "/";
        this.props.logOut();
    }

    createRequestPacket(accountFromTransfer, accountToTransfer) {
        const data = {
            "userId": sessionStorage.getItem("userName"),
            "fromAccount": accountFromTransfer.accountNumber,
            "toAccount": accountToTransfer.accountNumber,
            "toAccountType": accountToTransfer.accountType,
            "fromAccountType": accountFromTransfer.accountType,
            "beneficiaryName": accountToTransfer.accountOwner,
            "transferAmount": accountToTransfer.transAmt,
            "remarks": accountToTransfer.remarks,
            "header": sessionStorage.getItem("accessHeader")
        }

        return data;
    }

    mergeOwnICICAccountsFromSession() {
        const savingsAccounts = JSON.parse(sessionStorage.getItem("savingsAccounts"));
        const currentAccounts = JSON.parse(sessionStorage.getItem("currentAccounts"));

        const ownICICIAccs = [...savingsAccounts, ...currentAccounts];

        return ownICICIAccs;
    }

    getAccountFromTransfer() {
        const accountNoFromTransfer = sessionStorage.getItem("accountNoFromTransfer")
        let accountFromTransfer = {};

        const ownICICIAccs = this.mergeOwnICICAccountsFromSession();

        ownICICIAccs.map(account => {
            if (account.accountNumber == accountNoFromTransfer) {
                accountFromTransfer = account;
            }
        })

        return accountFromTransfer;
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div id="header">
                        <div id="header-main" className="header-main">
                            <div id="wrapper1">
                                <div id="headerouter" className="headerouter_r">
                                    <div id="TopNavigation_ThreeColumns_1" className="TopNavigation_ThreeColumns">
                                        <div id="NavigationLinksContainerGlobal" className="NavigationLinksContainer SmallGrey_TopNav">
                                            <a target="_blank" id="About Us" className="SmallGrey_TopNav" title="About Us"
                                                href="http://www.icicibank.com/aboutus/about-us.html">About Us</a>
                                        </div>
                                        <div id="" className="ShareLinksContainer SmallGrey_TopNav">
                                            <a target="_blank" id="FindBranch" className="SmallGrey_TopNav" title="Find ATM/Branch"
                                                href="http://www.icicibank.com/find-atm-branch.html">Find ATM/Branch</a>
                                        </div>
                                        <div id="" className="ShareLinksContainer SmallGrey_TopNav">
                                            <div id="" className="ShareLinksContainer SmallGrey_TopNav">
                                                <div className="" id="PageHeader">
                                                    <p id="PageHeader.Ra1">
                                                        <span id="PageHeader.Ra1.C1">
                                                            <span className="OrangeButtonForRet1" id="span_HREF_Logout" title="Customer Care">
                                                                <button style={{ background: "#EB6C18", margin: "0px", height: "100%", width: "100%", paddingTop: "2px", paddingBottom: "2px", paddingLeft: "3px", paddingRight: "3px" }}>CUSTOMER CARE</button>
                                                            </span>
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="" className="ShareLinksContainer SmallGrey_TopNav">
                                            <div id="" className="ShareLinksContainer SmallGrey_TopNav">
                                                <div className="" id="PageHeader">
                                                    <p id="PageHeader.Ra1">
                                                        <span id="PageHeader.Ra1.C1">
                                                            <span className="BlackButtonClass1" id="span_HREF_Logout" title="Log Out">
                                                                <button onClick={this.logOut} style={{ background: "#463F3F", margin: "0px", height: "100%", width: "100%", paddingTop: "2px", paddingBottom: "2px", paddingLeft: "3px", paddingRight: "3px" }}>LOG OUT</button>
                                                            </span>
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="logo_1" className="logo_1" role="banner">
                                        <a><img src={logo}></img></a>
                                    </div>
                                    <div className="txt_boxnew" id="">
                                        <div id="background" style={{ backgroundColor: "transparent" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container" style={{ marginTop: "10px" }}>
                    <header className="nav-header">
                        <div className="middleContainer updated-header clearfix">
                            <ul className="menu" style={{height:"60px"}}>
                                <li>
                                    <a className="dropdown-toggle" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                        OVERVIEW<i className="fas fa-user"></i>
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-toggle" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                        MY ACCOUNTS<i className="fas fa-user"></i>
                                    </a>
                                </li>
                                <li className="">
                                    <a className="dropdown-toggle" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                        PAYMENTS &amp; TRANSFER<i className="fas fa-user"></i>
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-toggle" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                        INVESTMENTS &amp; INSURANCE<i className="fas fa-user"></i>
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-toggle" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                        EXCLUSIVE OFFERINGS<i className="fas fa-user"></i>
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-toggle" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                        CUSTOMER SERVICE<i className="fas fa-user"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </header>
                </div>
                <div className="container" style={{ marginTop: "30px" }}>
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="sidebar" style={{ maxWidth: "100%"}}>
                                {/* <img src={sidebar} width="100%" alt="" srcSet=""></img> */}
                                <img src={sidebarTop} width="100%"></img>
                                <LoggedInUser></LoggedInUser>
                                <img src={sidebarMiddle} width="100%"></img>
                                <img src={sidebarBottom} width="100%"></img>
                            </div>
                        </div>
                        <div className="col-sm-9">
                            <Router>
                                <Switch>
                                    <Route path="/" exact component={Accounts}></Route>

                                    <Route path="/fundTransfer/" exact component={FrequentPayeeSelAcc}></Route>
                                    <Route path="/fundTransfer/frequentPayee/initTrans" component={FrequentPayeeInitTrans}></Route>
                                    <Route path="/fundTransfer/frequentPayee/confirmTrans" component={FrequentPayeeConfirmTrans}></Route>
                                    <Route path="/fundTransfer/frequentPayee/successTrans" component={FrequentPayeeSuccessTrans}></Route>

                                    <Route path="/fundTransfer/ownICICI/" exact component={OwnICICISelAcc}></Route>
                                    <Route path="/fundTransfer/ownICICI/initTrans" component={OwnICICIInitTrans}></Route>
                                    <Route path="/fundTransfer/ownICICI/confirmTrans" component={OwnICICIConfirmTrans}></Route>
                                    <Route path="/fundTransfer/ownICICI/successTrans" component={OwnICICISuccessTrans}></Route>

                                    <Route path="/fundTransfer/otherICICI/" exact component={OtherICICISelAcc}></Route>
                                    <Route path="/fundTransfer/otherICICI/initTrans" component={OtherICICIInitTrans}></Route>
                                    <Route path="/fundTransfer/otherICICI/confirmTrans" component={OtherICICIConfirmTrans}></Route>
                                    <Route path="/fundTransfer/otherICICI/successTrans" component={OtherICICISuccessTrans}></Route>

                                    <Route path="/fundTransfer/otherBank/" exact component={OtherBankSelAcc}></Route>
                                    <Route path="/fundTransfer/otherBank/initTrans" component={OtherBankInitTrans}></Route>
                                    <Route path="/fundTransfer/otherBank/confirmTrans" component={OtherBankConfirmTrans}></Route>
                                    <Route path="/fundTransfer/otherBank/successTrans" component={OtherBankSuccessTrans}></Route>
                                </Switch>
                            </Router>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}>
                    <div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <img src={bell} style={{ width: "32px", height: "32px", margin: "20px" }}></img>
                            <h1>Fund Transfer</h1>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "50px" }}>
                            <h5>A fund transfer is in progress. Would you like to save it to continue later?</h5>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", margin: "50px" }}>
                                <button style={{ margin: "10px" }} onClick={this.closeModalOk}>Ok</button>
                                <button style={{ margin: "10px" }} onClick={this.closeModalCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div >
        );
    }
}

Modal.setAppElement('#root');