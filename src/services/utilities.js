
export default class Utilities {
    resetAccounts() {
        let frequentBeneficiaryAccs = JSON.parse(sessionStorage.getItem("frequentBeneficiaryAccs")) || [];
        let otherBankBeneficiaryAccs = JSON.parse(sessionStorage.getItem("otherBankBeneficiaryAccs")) || [];
        let otherICICIBeneficiaryAccs = JSON.parse(sessionStorage.getItem("otherICICIBeneficiaryAccs")) || [];
        let savingsAccounts = JSON.parse(sessionStorage.getItem("savingsAccounts")) || [];
        let currentAccounts = JSON.parse(sessionStorage.getItem("currentAccounts")) || [];

        savingsAccounts.map((account) => {
            if (account) {
                account.selectedForTrans = false;
                account.transAmt = 0;
                account.remarks = "";
            }
        });

        currentAccounts.map((account) => {
            if (account) {
                account.selectedForTrans = false;
                account.transAmt = 0;
                account.remarks = "";
            }
        });

        frequentBeneficiaryAccs.map((account) => {
            if (account) {
                account.selectedForTrans = false
                account.transAmt = 0;
                account.remarks = "";
            }
        });

        otherBankBeneficiaryAccs.map((account) => {
            if (account) {
                account.selectedForTrans = false
                account.transAmt = 0;
                account.remarks = "";
            }
        });

        otherICICIBeneficiaryAccs.map((account) => {
            if (account) {
                account.selectedForTrans = false
                account.transAmt = 0;
                account.remarks = "";
            }
        });

        sessionStorage.setItem("savingsAccounts", JSON.stringify(savingsAccounts));
        sessionStorage.setItem("currentAccounts", JSON.stringify(currentAccounts));
        sessionStorage.setItem("frequentBeneficiaryAccs", JSON.stringify(frequentBeneficiaryAccs));
        sessionStorage.setItem("otherBankBeneficiaryAccs", JSON.stringify(otherBankBeneficiaryAccs));
        sessionStorage.setItem("otherICICIBeneficiaryAccs", JSON.stringify(otherICICIBeneficiaryAccs));

        console.log("Resetting session");
    }
}