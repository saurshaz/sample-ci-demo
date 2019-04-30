import React from "react";
import { Link } from "react-router-dom";

export default class PayeeListItem extends React.Component {
    render() {
        return (
            <div className="col-2" style={{ paddingRight: 0 }}>
                <div className={"tabItem"}>
                    <Link to="/fundTransfer">
                        <div className="mainText">Frequent Payees</div>
                        <div className="subText">Payees, to whom you send money frequently</div>
                    </Link>
                </div>
                <div className="tabItem">
                    <Link to="/fundTransfer/ownICICI/">
                        <div className="mainText">Own ICICI Relationships</div>
                        <div className="subText">Your other ICICI Bank Relationship Accounts</div>
                    </Link>
                </div>
                <div className="tabItem">
                    <Link to="/fundTransfer/otherICICI/">
                        <div className="mainText">Other ICICI Bank Accounts</div>
                        <div className="subText">Payees, who has ICICI Bank Accounts</div>
                    </Link>
                </div>
                <div className="tabItem active">
                    <Link to="/fundTransfer/otherBank/">
                        <div className="mainText">Other Bank Accounts</div>
                        <div className="subText">Payees, who has relationship with other Banks</div>
                    </Link>
                </div>
            </div>
        )
    }
}