import * as axios from "axios";

export default class FundTransfer {
    doFundTransfer(userId, fromAcct, toAccnt, trfAmnt, header) {
        var promise = new Promise((resolve, reject) => {
            const fundTransParams = {
                params: {
                    "fromAcct": fromAcct,
                    "toAccnt": toAccnt,
                    "trfAmnt": trfAmnt,
                    "header": header,
                }
            }

            const params = {
                params: {
                    "name": userId,
                    "header": header,
                }
            }

            axios.post('/fundTransfer', fundTransParams).then(response => {
                console.log("fundTransfer", response);

                axios.post('/getAllAccountsOfUser', params).then(response => {
                    console.log("getAllAccountsOfUser", response);

                    if (response || response.data || response.data.array) {
                        let savingsAccounts = [];
                        let currentAccounts = [];

                        response.data.array.map((account) => {
                            if (account.accountType === "Savings") {
                                savingsAccounts.push(account);
                            } else if (account.accountType === "Credit") {
                                currentAccounts.push(account);
                            }
                        })

                        sessionStorage.setItem("savingsAccounts", JSON.stringify(savingsAccounts))
                        sessionStorage.setItem("currentAccounts", JSON.stringify(currentAccounts));
                    }

                    resolve(response);
                }).catch(error => {
                    this.setState({ error: "Unable to get User Accounts" })
                    console.log("ERROR", error);
                });
            }).catch(error => {
                reject(error);
            })
        });

        return promise
    }
}