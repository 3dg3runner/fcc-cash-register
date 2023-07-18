function checkCashRegister(price, cash, cid) {
  // set up main function variables;
  let currencyType = [0.01, 0.05, 0.10, 0.25, 1.00, 5.00, 10.00, 20.00, 100.00]; // currency type array for quick checking
  let currencyName = ['PENNY', 'NICKEL', 'DIME', 'QUARTER', 'ONE', 'FIVE', 'TEN', 'TWENTY', 'ONE HUNDRED']; // currency name array for quick checking

  // create register status variable for later use
  let registerStatus = {status: "", change: []};
  
  // ste up main cash flow variables
  let changeDue = cash - price; // how much change is due?
  let cashAvailable = false; // is there enough cash available to give change?
  let cashCID = 0; // how much total cash value is in drawer?

  // build cashCID variable
  for (let i = 0; i < cid.length; i++) {
    cashCID += cid[i][1];
  }
  cashCID = Number.parseFloat(cashCID).toFixed(2); // fix rounding issues

  let cashReturn = [['PENNY', 0], ['NICKEL', 0], ['DIME', 0], ['QUARTER', 0], ['ONE', 0], ['FIVE', 0], ['TEN', 0], ['TWENTY', 0], ['ONE HUNDRED', 0]]; // how much of each currency should be returned?

  // run currency checks to figure out appropriate amount of change for each currency type
  for (let unit = cid.length; unit >= 0; unit--) {
    if (changeDue >= currencyType[unit]) {
      if (cid[unit][1] !== 0) {
        let currencyReturn = Math.floor(changeDue / currencyType[unit]) * currencyType[unit];
        while (currencyReturn > cid[unit][1]) {
          currencyReturn = currencyReturn - currencyType[unit];
        }
        cashReturn[unit][1] += currencyReturn;
        changeDue = (changeDue * 10) % (currencyReturn * 10);
        changeDue = (changeDue / 10).toFixed(2);
      }
    }
    // if there is no changeDue left, then there is enough cash available to give the full change
    if (Math.round(changeDue) === 0) {
      cashAvailable = true;
    }
    else {
      cashAvailable = false;
    }
  }

  // remove empty currencies from cashReturn
  let tmpEmpty = [];
  for (let i = 0; i < cashReturn.length; i++) {
    if (cashReturn[i][1] !== 0) {
      tmpEmpty.push(cashReturn[i]);
    }
  }
  cashReturn = tmpEmpty;

  // sort cashReturn array to be arranged largest to smallest
  let tmpSort = [];
  let sortLength = cashReturn.length;
  for (let i = 0; i < sortLength; i++) {
    let tmpStore;
    tmpStore = cashReturn.pop();
    tmpSort.push(tmpStore);
  }
  cashReturn = tmpSort;

  // perform final checks
  // if the cash in drawer matches the amount of change due
  if (cashCID == cash - price) { 
    registerStatus.status = "CLOSED";
    registerStatus.change = cid;
  }
  // if the cash received is not enough to cover the price
  else if (cash < price) {
    registerStatus.status = "INSUFFICIENT_FUNDS";
    registerStatus.change = [];
  }
  // if the difference between price and cash can not be covered by the cash drawer
  else if (cashCID < cash - price) {
    registerStatus.status = "INSUFFICIENT_FUNDS";
    registerStatus.change = [];
  }
  // if there is not enough cash available in the drawer
  else if (cashAvailable === false) {
    registerStatus.status = "INSUFFICIENT_FUNDS";
    registerStatus.change = [];
  }
  // check to see if cash in drawer can give out exact change
  else if (cashCID % (price - cash) < 0.1 && cashCID % (price - cash) > 0) {
    registerStatus.status = "INSUFFICIENT_FUNDS";
    registerStatus.change = [];
  }
  // if everything else checks out, then give the right change due
  else {
    registerStatus.status = "OPEN";
    registerStatus.change = cashReturn;
  }

  return registerStatus;
}

// algorithm test cases
checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
