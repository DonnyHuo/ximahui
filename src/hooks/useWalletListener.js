import { ethers } from "ethers";
import { useEffect } from "react";

import { setAddress } from "../store/slice";
import { store } from "../store";

const useWalletListener = () => {
  useEffect(() => {
    if (!window.ethereum) {
      console.log("未检测到钱包");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        console.log("网络已切换：", {
          oldNetwork: oldNetwork.name,
          newNetwork: newNetwork.name
        });
      }
    });

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        store.dispatch(setAddress(""));
      } else {
        store.dispatch(setAddress(accounts[0].toLowerCase()));
      }
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    const handleChainChanged = (chainId) => {
      console.log("链 ID 已切换：", parseInt(chainId, 16));
    };
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      provider.off("network");
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);
};

export default useWalletListener;
