import React from "react";
import { withRouter } from "react-router-dom";

import radiobutton_normal from "../../../images/icn_radiobutton_normal.png";
import radiobutton_selected from "../../../images/icn_radiobutton_selected.png";

class PayeeListItem extends React.Component {
    constructor(props) {
        super(props);

        this.selectAccount = this.selectAccount.bind(this);
    }

    selectAccount() {
        if (this.props.account) {
            let otherBankBeneficiaryAccs = JSON.parse(sessionStorage.getItem("otherBankBeneficiaryAccs")) || [];

            otherBankBeneficiaryAccs.map((account) => {
                if (account) {
                    if (account.accountNumber === this.props.account.accountNumber) {
                        account.selectedForTrans = true;
                        account.transAmt = 0;
                        account.remarks = "";
                    } else {
                        account.selectedForTrans = false;
                        account.transAmt = 0;
                        account.remarks = "";
                    }
                }
            });

            sessionStorage.setItem("otherBankBeneficiaryAccs", JSON.stringify(otherBankBeneficiaryAccs));

            this.props.history.push("/fundTransfer/otherBank/initTrans");
        }
    }

    render() {
        return (
            <tr style={{ cursor: "pointer" }} onClick={this.selectAccount}>
                <td style={{ paddingTop: "10px", paddingLeft: "40px" }}>
                    <img src={this.props.account.selectedForTrans == true ? radiobutton_selected : radiobutton_normal}></img>
                </td>
                <td style={{ font: "Roboto", color: "#193E6C", fontSize: "14px" }}>{this.props.account.accountOwner}</td>
                <td style={{ font: "Roboto", color: "#000000", fontSize: "14px" }}>{this.props.account.bank}</td>
                <td style={{ font: "Roboto", color: "#000000", fontSize: "14px" }}>{this.props.account.accountNumber}</td>
            </tr>
        )
    }
}

export default withRouter(PayeeListItem)