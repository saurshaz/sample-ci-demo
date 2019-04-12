import React from "react";

export default class Tabs extends React.Component {
    render() {
        return (
            <div className="col-2" style={{ paddingRight: 0 }}>
                < div className={"tabItem active"}  >
                    <div className="mainText" style={{ font: "Helvetica Neue", color: "#962824", fontSize: "14px", paddingTop: "10px", paddingBottom: "10px" }}>Accounts</div>
                </div>
                <div className="tabItem">
                    <div className="mainText" style={{ font: "Helvetica Neue", color: "#962824", fontSize: "14px", paddingTop: "10px", paddingBottom: "10px" }}>Deposits</div>
                </div>
                <div className="tabItem">
                    <div className="mainText" style={{ font: "Helvetica Neue", color: "#962824", fontSize: "14px", paddingTop: "10px", paddingBottom: "10px" }}>Credit card</div>
                </div>
                <div className="tabItem">
                    <div className="mainText" style={{ font: "Helvetica Neue", color: "#962824", fontSize: "14px", paddingTop: "10px", paddingBottom: "10px" }}>Loans</div>
                </div>
                <div className="tabItem">
                    <div className="mainText" style={{ font: "Helvetica Neue", color: "#962824", fontSize: "14px", paddingTop: "10px", paddingBottom: "10px" }}>Insurance</div>
                </div>                
            </div>
        )
    }
}