import React from 'react';

export default class LoggedInUser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ marginLeft: "10px", font: "Roboto", color: "#00040A", fontWeight: "bold", fontSize: "15px", textAlign: "left" }}>
                {sessionStorage.getItem("firstName").toUpperCase() + " " + sessionStorage.getItem("lastName").toUpperCase()}
            </div>
        )
    }
}