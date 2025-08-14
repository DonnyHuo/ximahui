import { ethers } from "ethers";

import { setAddress } from "../store/slice";
import { store } from "../store";

export async function setupListeners() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  provider.on("network", (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      console.log("网络已切换：", {
        oldNetwork: oldNetwork.name,
        newNetwork: newNetwork.name
      });
    }
  });

  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      console.log("钱包已断开");
    } else {
      console.log("账户已切换：", accounts[0]);
    }
  });

  window.ethereum.on("chainChanged", (chainId) => {
    console.log("链 ID 已切换：", parseInt(chainId, 16));
  });
}

const TARGET_NETWORK = {
  chainId: "0x38",
  chainName: "Binance Smart Chain Mainnet",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"]
};

// const TARGET_NETWORK_TEST = {
//   chainId: "0x61",
//   chainName: "Binance Smart Chain Testnet",
//   nativeCurrency: {
//     name: "BNB",
//     symbol: "BNB",
//     decimals: 18
//   },
//   rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
//   blockExplorerUrls: ["https://testnet.bscscan.com"]
// };

export const checkNetwork = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  return network.chainId === parseInt(TARGET_NETWORK.chainId, 16);
};

export const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: TARGET_NETWORK.chainId }]
    });
    console.log("已切换到目标网络");
  } catch (error) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [TARGET_NETWORK]
        });
        console.log("已添加并切换到目标网络");
      } catch (addError) {
        console.error("添加网络失败：", addError);
      }
    } else {
      console.error("切换网络失败：", error);
    }
  }
};

export async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        await switchNetwork();
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      store.dispatch(setAddress(address.toLowerCase()));

      return { provider, signer };
    } catch (error) {
      console.error("User denied account access or error occurred:", error);
    }
  } else {
    console.error("No Ethereum provider detected. Install MetaMask!");
  }
}

export function getContract(contractAddress, abi, funcName, ...params) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return new Promise((resolve, reject) => {
    contract[funcName](...params).then(
      (response) => {
        resolve(response);
      },
      (err) => {
        console.log(err);
        reject(605);
      }
    );
  });
}

export function getWriteContract(contractAddress, abi, funcName, ...params) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const contractWithSigner = contract.connect(provider.getSigner());
  return new Promise((resolve, reject) => {
    contractWithSigner[funcName](...params).then(
      (response) => {
        resolve(response);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export function getContractLoad(contractAddress, abi, funcName, ...params) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return new Promise((resolve, reject) => {
    contract[funcName](...params).then(
      (response) => {
        let timer = setInterval(() => {
          provider
            .getTransactionReceipt(response.hash)
            .then((receipt) => {
              console.log("receipt", receipt);
              if (receipt) {
                if (receipt.logs.length) {
                  setTimeout(() => {
                    resolve(response);
                  }, 2000);
                } else {
                  reject(601);
                }
                clearInterval(timer);
              }
            })
            .catch((err) => {
              console.log(err);
              reject(604);
            });
        }, 1000);
      },
      (err) => {
        console.log(err);
        reject(605);
      }
    );
  });
}

export function getWriteContractLoad(
  contractAddress,
  abi,
  funcName,
  ...params
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const contractWithSigner = contract.connect(provider.getSigner());
  return new Promise((resolve, reject) => {
    contractWithSigner[funcName](...params).then(
      (response) => {
        let timer = setInterval(() => {
          provider
            .getTransactionReceipt(response.hash)
            .then((receipt) => {
              if (receipt) {
                if (receipt.status) {
                  setTimeout(() => {
                    resolve(response);
                  }, 2000);
                } else {
                  reject(601);
                }
                clearInterval(timer);
              }
            })
            .catch((err) => {
              console.log(err);
              reject(604);
            });
        }, 1000);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
