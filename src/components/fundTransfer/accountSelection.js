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

    // addSpace(count) {
    //     let space = '&nbsp;'

    //     for (let i = 0; i < count; i++) {
    //         space = space + '&#160;'
    //     }

    //     return space;
    // }

    render() {
        let selectedAccountNumber = this.state.accountNoFromTransfer || -1;

        return (
            <div className="m10">
                <select className='accountSelect' value={selectedAccountNumber} onChange={this.handleSelectAccount}>
                    <option value="" disabled selected>Select Account</option>
                    {
                        this.state.savingsAccounts ?
                            this.state.savingsAccounts.map(accounts => {
                                return <option value={accounts.accountNumber}>{'Saving Account'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {accounts.accountNumber} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#x20B9;{Number(accounts.currentBalance || 0).toLocaleString('en-IN')}</option>
                            }) : null
                    }
                    {
                        this.state.currentAccounts ?
                            this.state.currentAccounts.map(accounts => {
                                // return <option value={accounts.accountNumber}>Current Account   {accounts.accountNumber}  {this.addSpace()}  &#x20B9;{Number(accounts.currentBalance || 0).toLocaleString('en-IN')}</option>
                                // return <option value={accounts.accountNumber}>{'Current Account' + this.addSpace(4) + accounts.accountNumber + this.addSpace(15) + '&#x20B9;' + Number(accounts.currentBalance || 0).toLocaleString('en-IN')}</option>
                                return <option value={accounts.accountNumber}>{'Current Account'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {accounts.accountNumber} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#x20B9;{Number(accounts.currentBalance || 0).toLocaleString('en-IN')}</option>
                            }) : null
                    }
                </select>
            </div>
        )
    }
}