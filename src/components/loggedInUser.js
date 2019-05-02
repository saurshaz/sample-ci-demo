import React from 'react';

export default class LoggedInUser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ marginLeft: "10px", font: "Roboto,Medium", color: "#000000", fontWeight: "bold", fontSize: "16px", textAlign: "left" ,marginTop: "30px"}}>
                {sessionStorage.getItem("firstName").toUpperCase() + " " + sessionStorage.getItem("lastName").toUpperCase()}
            </div>
        )
    }
}