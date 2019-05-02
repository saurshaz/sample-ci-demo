import React from "react";

export default class Tabs extends React.Component {
    render() {
        return (
            <div className="col-2" style={{ paddingRight: 0, flex: 0 }}>
                < div className="tabItem active">
                    <div className="mainText" >Accounts</div>
                </div>
                <div className="tabItem">
                    <div className="mainText">Deposits</div>
                </div>
                <div className="tabItem">
                    <div className="mainText">Credit card</div>
                </div>
                <div className="tabItem">
                    <div className="mainText">Loans</div>
                </div>
                <div className="tabItem">
                    <div className="mainText">Insurance</div>
                </div>                
            </div>
        )
    }
}