import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import stakeAbi from "../../src/assets/abi/stakingContract.json";
import stakeAbiV2 from "../../src/assets/abi/stakingContractV2.json";
import { getContract } from "../../src/utils";

const Footer = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const address = useSelector((state) => state.address);

  const adminAddress = useSelector((state) => state.adminAddress);

  const version = useSelector((state) => state.version);

  const contractAddress = useSelector((state) =>
    version === 2
      ? state.stakingContractAddressV2
      : version === 3
      ? state.stakingContractAddressV3
      : state.stakingContractAddress
  );

  const abi = [3].includes(version) ? stakeAbiV2 : stakeAbi;

  const [showAdmin, setShowAdmin] = useState(false);

  const getOwner = useCallback(async () => {
    const owner = await getContract(contractAddress, abi, "owner");
    console.log("owner", owner);
    setShowAdmin(
      address.toLowerCase() === owner.toLowerCase() ||
        adminAddress.includes(address.toLowerCase())
    );
  }, [abi, address, adminAddress, contractAddress]);

  useEffect(() => {
    if (address) {
      getOwner();
    }
  }, [address, getOwner]);

  return (
    <div className="w-full fixed bottom-0 left-0 h-[48px] flex items-center justify-around bg-[#111] text-[14px] text-white">
      <Link
        to="/"
        className={`font-bold ${
          location.pathname === "/" ? "text-[#C07DFF]" : "text-[#929292]"
        }`}
      >
        {t("home")}
      </Link>
      <Link
        to="/invite"
        className={`font-bold ${
          location.pathname === "/invite" ? "text-[#C07DFF]" : "text-[#929292]"
        }`}
      >
        {t("invite")}
      </Link>

      {showAdmin && (
        <Link
          to="/admin"
          className={`font-bold ${
            location.pathname === "/admin" ? "text-black" : "text-[#929292]"
          }`}
        >
          admin
        </Link>
      )}
    </div>
  );
};

export default Footer;
