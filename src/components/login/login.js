import React from "react";
import { axiosInstance as axios } from "../../lib";
import ibmmfpfanalytics from "ibm-mfp-web-sdk/lib/analytics/ibmmfpfanalytics";

import iciciLogo from "./../../images/logo-new.png";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        // this.handleUserNameChange = this.handleUserNameChange.bind(this);
        // this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.logUser = this.logUser.bind(this);
        this.cancelLogin = this.cancelLogin.bind(this);

        this.state = {
            userName: '',
            password: '',
            loginDisabled: false,
            error: "",
        }
    }

    cancelLogin(e) {
        e.preventDefault();

        this.setState({
            userName: '',
            password: '',
            loginDisabled: false,
            error: ''
        });

        console.log("cancelLogin", this.state.userName);
    }

    logUser(e) {
        e.preventDefault();

        sessionStorage.clear();

        if (this.state.userName.trim().length <= 0 || this.state.password.trim().length <= 0) {
            this.setState({ "error": "Please enter user name and password." })
            return;
        }

        this.setState({ "loginDisabled": true });

        ibmmfpfanalytics.addEvent({ 'buttonClick-WEB': 'Log in' });
        ibmmfpfanalytics.send();

        axios.post('/test', {}).then(response => {
            console.log("test", response);
        })

        axios.post('/login', {
            params: {
                "name": this.state.userName,
                "passwd": this.state.password
            }
        }).then(response => {
            console.log("login", response);

            if (response.data.errorCode && response.data.errorCode === "403") {
                this.setState({ "error": "Invalid Username/Password.", "loginDisabled": false })
                return;
            }

            sessionStorage.setItem("userName", response.data.userId || "")
            sessionStorage.setItem("firstName", response.data.firstName || "");
            sessionStorage.setItem("lastName", response.data.lastName || "");
            sessionStorage.setItem("userEmailId", response.data.userEmailId);

            sessionStorage.setItem('accessHeader', response.data.accessHeader);

            const params = {
                params: {
                    "name": response.data.userId,
                    "header": response.data.accessHeader,
                }
            }
            // ------------------------------------------------------------------------
            axios.post('/getAllAccountsOfUser', params).then(response => {
                console.log("getAllAccountsOfUser", response);

                if (response || response.data || response.data.array) {
                    let savingsAccounts = [];
                    let currentAccounts = [];

                    response.data.array.map((account) => {
                        if (account.accountType === "Savings") {
                            savingsAccounts.push(this.addDefaultProperties(account));
                        } else if (account.accountType === "Current") {
                            currentAccounts.push(this.addDefaultProperties(account));
                        }
                    })

                    sessionStorage.setItem("savingsAccounts", JSON.stringify(savingsAccounts))
                    sessionStorage.setItem("currentAccounts", JSON.stringify(currentAccounts));

                    // ------------------------------------------------------------------------
                    axios.post('/getBeneficiaryForUser', params).then(response => {
                        console.log("getBeneficiaryForUser", response);

                        if (response || response.data || response.data.array) {
                            let frequentBeneficiaryAccs = [];
                            let OtherICICIBeneficiaryAccs = [];
                            let OtherBankBeneficiaryAccs = [];

                            response.data.array.map((account) => {
                                if (account.frequent === "true") {
                                    frequentBeneficiaryAccs.push(this.addDefaultProperties(account));
                                }

                                if (account.bank === "ICICI") {
                                    OtherICICIBeneficiaryAccs.push(this.addDefaultProperties(account));
                                } else if (account.bank != "ICICI") {
                                    OtherBankBeneficiaryAccs.push(this.addDefaultProperties(account));
                                }
                            })

                            sessionStorage.setItem("frequentBeneficiaryAccs", JSON.stringify(frequentBeneficiaryAccs));
                            sessionStorage.setItem("otherICICIBeneficiaryAccs", JSON.stringify(OtherICICIBeneficiaryAccs));
                            sessionStorage.setItem("otherBankBeneficiaryAccs", JSON.stringify(OtherBankBeneficiaryAccs));

                            // ========================================================================================================
                            // var fundTransfer = new FundTransfer();
                            // fundTransfer.doFundTransfer(params.params.name, "0386423456200", "0386423456201", 100, params.params.header)
                            //     .then((response) => {
                            //         console.log(response);
                            //     })
                            // const fundTransParams = {
                            //     params: {
                            //         "fromAcct": "0386423456200",
                            //         "toAccnt": "0386423456201",
                            //         trfAmnt: 100,
                            //         "header": params.params.header,
                            //     }
                            // }

                            // axios.post('/fundTransfer', fundTransParams).then(response => {
                            //     console.log("fundTransfer", response);
                            // })
                            // ========================================================================================================

                            ibmmfpfanalytics.addEvent({ 'buttonClick-WEB': 'Log in Successful' });
                            ibmmfpfanalytics.send();

                            this.props.logIn();
                        }
                    }).catch(error => {
                        this.setState({ loginDisabled: false, "error": "Unable to retrieve beneficiaries" })
                        console.log("ERROR", error);
                    });
                    // ------------------------------------------------------------------------                    
                }
            }).catch(error => {
                this.setState({ loginDisabled: false, "error": "Unable to retrieve user accounts" })
                console.log("ERROR", error);
            });
            // ------------------------------------------------------------------------
        }).catch(error => {
            this.setState({ loginDisabled: false, "error": "Unable to login" })
            console.log("ERROR", error);
        });

        this.setState({ "loginDisabled": true });
    }

    addDefaultProperties(account) {
        account.selectedForTrans = false;
        account.transAmt = 0;
        account.remarks = "";

        return account;
    }

    handleUserNameChange = (e) => {
        this.setState({ "userName": e.target.value, "error": "" });
    }

    handlePasswordChange = (e) => {
        this.setState({ "password": e.target.value, "error": "" });
    }

    render() {
        return (
            <div className="container" style={{ paddingTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", widht: "30%" }}>
                <div>
                    <div>
                        <img src={iciciLogo}></img>
                    </div>
                    <div className="titleContainer">
                        Login to Internet Banking
                    </div>
                    <form className="mainContainer">
                        <div className="form-group row">
                            {/* <label htmlFor="staticEmail" className="col-sm-2 col-form-label">User Id</label> */}
                            <div>
                                <input placeholder="user name" type="text" onChange={this.handleUserNameChange} className="form-control-plaintext" id="userName" value={this.state.userName}></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            {/* <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Password</label> */}
                            <div>
                                <input placeholder="password" type="password" onChange={this.handlePasswordChange} className="form-control-plaintext" id="password" value={this.state.password}></input>
                            </div>
                        </div>
                        <div className="form-group row" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                            <button disabled={this.state.loginDisabled} onClick={this.logUser}>Login</button>
                            <button onClick={this.cancelLogin}>Cancel</button>
                        </div>
                        <div>
                            <span style={{ fontSize: "10px" }}>
                                {this.state.error}
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}