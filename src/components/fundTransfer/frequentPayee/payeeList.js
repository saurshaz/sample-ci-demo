import React from "react";

import PayeeListItem from "./payeeListItem";

export default class PayeeList extends React.Component {
    render() {
        return (
            <table className='table table-striped' style={{ marginBottom: "0px" }}>
                <tbody>
                    {
                        this.props.accounts.map(account => {
                            return <PayeeListItem account={account}></PayeeListItem>
                        })
                    }
                </tbody>
            </table>
        )
    }
}