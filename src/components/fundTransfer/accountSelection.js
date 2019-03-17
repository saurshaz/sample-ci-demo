import React from "react";

export default class AccountSelection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            savingsAccounts: [],
            currentAccounts: [],
            accountNoFromTransfer: -1,
            error: ""
        }

        this.handleSelectAccount = this.handleSelectAccount.bind(this);
    }

    componentDidMount() {
        let savingsAccounts = JSON.parse(sessionStorage.getItem("savingsAccounts")) || [];
        let currrentAccounts = JSON.parse(sessionStorage.getItem("currentAccounts")) || [];
        let accountNoFromTransfer = sessionStorage.getItem("accountNoFromTransfer") || -1;

        this.setState({
            "savingsAccounts": savingsAccounts,
            "currentAccounts": currrentAccounts,
            "accountNoFromTransfer": accountNoFromTransfer
        });
    }

    handleSelectAccount(e) {
        console.log(e.target.value);

        sessionStorage.setItem("accountNoFromTransfer", e.target.value);

        this.setState({
            "accountNoFromTransfer": e.target.value
        });
    }

    render() {
        let selectedAccountNumber = this.state.accountNoFromTransfer || -1;

        return (
            <div className="m10">
                <select className='accountSelect' value={selectedAccountNumber} onChange={this.handleSelectAccount}>
                    <option value="" disabled selected>Select Account</option>
                    {
                        this.state.savingsAccounts ?
                            this.state.savingsAccounts.map(accounts => {
                                return <option value={accounts.accountNumber}>Saving Account   {accounts.accountNumber} {"................"}  &#x20B9;{accounts.currentBalance}</option>
                            }) : null
                    }
                    {
                        this.state.currentAccounts ?
                            this.state.currentAccounts.map(accounts => {
                                return <option value={accounts.accountNumber}>Current Account   {accounts.accountNumber}  {"................"}  &#x20B9;{accounts.currentBalance}</option>
                            }) : null
                    }
                </select>
            </div>
        )
    }
}