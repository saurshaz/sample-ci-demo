import React from "react";
import { withRouter } from "react-router-dom";

import AccountSelection from "../accountSelection";
import Tabs from "./tabs";
import PayeeList from "./payeeList";

class FrequentPayeeSelAcc extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            frequentBeneficiaryAccs: [],
            error: ""
        }

        this.goBack = this.goBack.bind(this);
        this.handleSearchPayees = this.handleSearchPayees.bind(this);
    }

    componentDidMount() {
        let frequentBeneficiaryAccs = JSON.parse(sessionStorage.getItem("frequentBeneficiaryAccs")) || [];

        this.setState({
            "frequentBeneficiaryAccs": frequentBeneficiaryAccs
        });
    }

    handleSearchPayees(e) {
        let frequentBeneficiaryAccs = JSON.parse(sessionStorage.getItem("frequentBeneficiaryAccs")) || [];
        
        let filteredResult = frequentBeneficiaryAccs.filter((account) => {
            return account.accountOwner.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
        })

        this.setState({
            "frequentBeneficiaryAccs": filteredResult 
        });
    }
    
    goBack() {
        this.props.history.push("/");
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
                        <div>
                            <div style={{ border: '1px solid #B9B9B9', backgroundColor: "#FFFFFF", paddingTop: "10px", paddingLeft: "40px", paddingBottom: "20px" }}>
                                <span style={{ font: "Roboto", color: "#242424", fontSize: "12px" }}>Select from your frequent payee list to send money</span>
                                <input className="searchInput" placeholder="Search Payee" onChange={this.handleSearchPayees}></input>
                            </div>
                            <div style={{ border: '1px solid #B9B9B9', boxShadow: "#000000", backgroundColor: "#FFFFFF" }}>
                                <PayeeList accounts={this.state.frequentBeneficiaryAccs}></PayeeList>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(FrequentPayeeSelAcc)
