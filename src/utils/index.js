import copyMessage from "copy-to-clipboard";

export const copy = async (msg) => {
  copyMessage(msg);
};

export const shortStr = (address, first = 7, last = 5) => {
  return address && address.slice(0, first) + "..." + address.slice(-last);
};

export const formatNumber = (num, digits) => {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};

export const formatNum = (number) => {
  return String(number).replace(/^(.*\..{4}).*$/, "$1");
};

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

export const formatDecimal = (num, decimals = 4) => {
  const decimalPart = String(num).split(".")[1] || "";
  if (decimalPart.length < decimals) {
    return num;
  }
  return Number(num.toFixed(decimals));
};

export {
  getContract,
  getWriteContract,
  getContractLoad,
  getWriteContractLoad,
  connectWallet,
  setupListeners,
  switchNetwork,
  checkNetwork
} from "./contract";
