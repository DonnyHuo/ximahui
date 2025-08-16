import {
  shortStr,
  getContract,
  getWriteContractLoad,
  copy
} from "../../src/utils";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Dialog, Loading } from "react-vant";

import { GiftO, FireO } from "@react-vant/icons";

import erc20Abi from "../../src/assets/abi/erc20.json";
import stakeAbi from "../../src/assets/abi/stakingContract.json";
import { ReactComponent as Click } from "../../src/assets/img/click.svg";
import { ReactComponent as Copy } from "../../src/assets/img/copy.svg";
import { fetchData } from "../http/request";

const Home = () => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const removeParam = (key) => {
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const invite = searchParams.get("invite");

  const address = useSelector((state) => state.address);

  const usdtAddress = useSelector((state) => state.usdtAddress);

  const stakingContractAddress = useSelector(
    (state) => state.stakingContractAddress
  );

  const [allowance, setAllowance] = useState(0);

  const getAllowance = async () => {
    const amounts = await getContract(
      usdtAddress,
      erc20Abi,
      "allowance",
      address,
      stakingContractAddress
    );
    // const decimals = await getContract(usdtAddress, erc20Abi, "decimals");
    const allowance = ethers.utils.formatUnits(amounts, usdtDecimals) * 1;
    setAllowance(allowance);
  };

  useEffect(() => {
    if (address) {
      getAllowance();
    }
  }, [stakingContractAddress, address, usdtAddress]);

  const [approveLoading, setApproveLoading] = useState(false);

  const approveFun = async () => {
    setApproveLoading(true);
    await getWriteContractLoad(
      usdtAddress,
      erc20Abi,
      "approve",
      stakingContractAddress,
      ethers.constants.MaxUint256
    )
      .then(() => {
        toast.success(t("approveSuccess"));
        setTimeout(() => {
          getAllowance();
        }, 2000);
      })
      .catch(() => toast.error(t("approveFail")))
      .finally(() => {
        setApproveLoading(false);
      });
  };

  const [stakeLoading, setStakeLoading] = useState(false);

  const [stakeValue, setStakeValue] = useState("");

  const [rewardTokenInfo, setRewardTokenInfo] = useState({});

  const [stakedAmount, setStakedAmount] = useState(0);

  const [usdtDecimals, setUsdtDecimals] = useState("18");

  const getDecimals = async () => {
    const decimals = await getContract(usdtAddress, erc20Abi, "decimals");

    setUsdtDecimals(decimals.toString());
  };

  useEffect(() => {
    getDecimals();
  }, []);

  const [maxAmountSupport, setMaxAmountSupport] = useState(true);

  const [maxAmountValue, setMaxAmountValue] = useState(0);

  const [minStake, setMinStake] = useState(0);

  const [allStaked, setAllStaked] = useState(0);

  const getMaxAmountSupport = async () => {
    const maxAmountSupport = await getContract(
      stakingContractAddress,
      stakeAbi,
      "maxAmountSupport"
    );

    setMaxAmountSupport(maxAmountSupport);
  };

  const getMaxAmount = async () => {
    const maxAmountValue = await getContract(
      stakingContractAddress,
      stakeAbi,
      "maxAmountValue"
    );

    setMaxAmountValue(ethers.utils.formatUnits(maxAmountValue, usdtDecimals));
  };

  const getAllStaked = async () => {
    const users = await getContract(
      stakingContractAddress,
      stakeAbi,
      "users",
      address
    );

    setAllStaked(ethers.utils.formatUnits(users?.allStaked, usdtDecimals));
  };

  const getMinStake = async () => {
    const minStake = await getContract(
      stakingContractAddress,
      stakeAbi,
      "MIN_STAKE"
    );

    setMinStake(ethers.utils.formatUnits(minStake, usdtDecimals));
  };

  useEffect(() => {
    if (address) {
      getAllStaked();
    }
    getMaxAmountSupport();
    getMinStake();
    getMaxAmount();
  }, [address]);

  const canStake = useMemo(() => {
    if (stakeValue * 1 > rewardTokenInfo?.balance) {
      return false;
    }
    if (stakeValue * 1 < minStake * 1) {
      return false;
    }
    if (maxAmountSupport) {
      if (stakeValue * 1 > maxAmountValue * 1 - allStaked * 1) {
        return false;
      }
    }

    return true;
  }, [
    allStaked,
    maxAmountSupport,
    maxAmountValue,
    minStake,
    rewardTokenInfo?.balance,
    stakeValue
  ]);

  const stakeFun = async () => {
    setStakeLoading(true);

    await getWriteContractLoad(
      stakingContractAddress,
      stakeAbi,
      "stake",
      ethers.utils.parseUnits(stakeValue, usdtDecimals)
    )
      .then((res) => {
        toast.success(t("betSuccess"));
        setStakeValue("");
        setTimeout(() => {
          getStaked(address);
        }, 2000);
      })
      .catch(() => {
        toast.error(t("betFail"));
      })
      .finally(() => {
        setStakeLoading(false);
      });
  };

  const [userInfo, setUserInfo] = useState({});

  const getRewardTokenInfo = async () => {
    const symbol = await getContract(usdtAddress, erc20Abi, "symbol");
    const balanceOf = await getContract(
      usdtAddress,
      erc20Abi,
      "balanceOf",
      address
    );

    const balance = ethers.utils.formatUnits(balanceOf, usdtDecimals) * 1;

    setRewardTokenInfo({
      symbol,
      usdtDecimals,
      balance
    });
  };

  useEffect(() => {
    if (address) {
      getRewardTokenInfo();
      const timer = setInterval(() => {
        getRewardTokenInfo();
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [address]);

  const getUserInfo = useCallback(async () => {
    await getContract(stakingContractAddress, stakeAbi, "getUserInfo", address)
      .then((userInfo) => {
        setUserInfo({
          claimedRewards:
            ethers.utils.formatUnits(
              userInfo.claimedRewards,
              rewardTokenInfo?.decimals
            ) * 1,
          pendingRewards:
            ethers.utils.formatUnits(
              userInfo.pendingRewards,
              rewardTokenInfo?.decimals
            ) * 1,
          totalRewards:
            ethers.utils.formatUnits(
              userInfo.totalRewards,
              rewardTokenInfo?.decimals
            ) * 1,
          rewardLimit:
            ethers.utils.formatUnits(
              userInfo.rewardLimit,
              rewardTokenInfo?.decimals
            ) * 1,
          rewardToken: rewardTokenInfo?.symbol
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    address,
    rewardTokenInfo?.decimals,
    rewardTokenInfo?.symbol,
    stakingContractAddress
  ]);

  useEffect(() => {
    if (address) {
      getUserInfo();
      const timer = setInterval(() => {
        getUserInfo();
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [address, getUserInfo]);

  const [claimLoading, setClaimLoading] = useState(false);

  const claimFun = async () => {
    setClaimLoading(true);
    await getWriteContractLoad(stakingContractAddress, "claimRewards")
      .then((res) => {
        toast.success(t("claimSuccess"));
      })
      .catch((err) => {
        console.log(err);
        toast.error(t("claimFail"));
      })
      .finally(() => {
        setClaimLoading(false);
      });
  };

  const [visible, setVisible] = useState(invite);

  // const [visibleTip, setVisibleTip] = useState(false);

  // const [showTips, setShowTips] = useState(false);

  const [loading, setLoading] = useState(true);

  const [bindLoading, setBindLoading] = useState(false);

  const bindReferrerFun = async () => {
    setBindLoading(true);

    // const overrides = {
    //   gasLimit: 300000
    //   // gasPrice: ethers.utils.parseUnits("5", "gwei")
    // };

    await getWriteContractLoad(
      stakingContractAddress,
      stakeAbi,
      "bindReferrer",
      invite.toLocaleLowerCase()
      // overrides
    )
      .then(() => {
        toast.success(t("bindSuccess"));
        removeParam("invite");
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(t("bindFail"));
      })
      .finally(() => {
        setVisible(false);
        setBindLoading(false);
      });
  };

  const confirmButtonText = useMemo(() => {
    if (bindLoading) {
      return <Loading color="#3f45ff" size="20px" />;
    } else {
      return t("confirm");
    }
  }, [bindLoading, t]);

  const [rewardList, setRewardList] = useState([]);

  const getRewardList = async (address) => {
    const data = `query {
        rewardClaimeds(
          where: {user: "${address}"}
          orderBy: blockTimestamp
          orderDirection: desc
          first: 10
        ) {
          user
          amount
          transactionHash
          blockTimestamp
        }
      }`;

    const res = await fetchData(data);
    setRewardList(res?.rewardClaimeds);
  };

  const getStaked = async (address) => {
    setLoading(true);
    const data = `query {
      user(id: "${address}"){
          currentStakedAmount
          referrer{
            id
          }
      }   
    }`;

    const res = await fetchData(data);

    const stakedAmount = res?.user?.currentStakedAmount;

    setStakedAmount(stakedAmount ? stakedAmount / 10 ** 18 : 0);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (address) {
      getRewardList(address);
      getStaked(address);
    }
  }, [address]);

  return (
    <div className="content-box bg-[#0D0E1E]">
      {/* <div className="flex items-center gap-2 px-[20px] pt-2">
        <Notice />
        <Marquee className="text-[14px] text-[#FF9500] font-bold" speed={80}>
          📢📢📢 {t("notice")} <div className="w-[100px]"></div>
        </Marquee>
      </div> */}
      <div className="home">
        <div className="text-center text-[18px]">
          <div className="font-bold mt-[10px] mb-[20px] flex items-center justify-center">
            <p className="bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent text-center text-2xl">
              {t("welcome")}
            </p>
          </div>
        </div>
        <div className="relative mt-[20px] rounded-[12px] text-[#8E58F5] font-bold px-[24px] border border-solid border-[rgba(255,255,255,0.17)] bg-[rgba(255,255,255,0.05)] text-center py-[30px]">
          <div className="text-[30px] font-bold bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent">
            {Number(stakedAmount).toFixed(2)}
            <span className="text-xl pl-1">{rewardTokenInfo?.symbol}</span>
          </div>
          <div className="text-[12px] text-[#FFC300]">
            {t("participatedAmount")}
          </div>
        </div>
        <div className="mt-[20px] p-[20px] rounded-lg border border-solid border-[rgba(255,255,255,0.17)] bg-[rgba(255,255,255,0.05)] text-center py-[30px]">
          <div className="mb-2 text-[14px] font-medium flex items-center justify-between">
            <span className="font-bold text-[16px] bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent">
              {t("betAmount")}
            </span>{" "}
            <span className="text-[12px]">
              <span className="text-[#FFC300]">{t("balance")}:</span>{" "}
              <span className="text-[#FFC300]">
                {Number(rewardTokenInfo?.balance ?? 0).toFixed(2)}{" "}
                {rewardTokenInfo?.symbol}
              </span>
            </span>
          </div>
          <input
            value={stakeValue}
            className="w-full h-[40px] border border-solid bg-transparent border-[#333] rounded-[55px] px-4 focus:border-[#C07DFF] text-white text-[14px]"
            placeholder={`≥ ${minStake}`}
            type="text"
            onChange={(e) => setStakeValue(e.target.value)}
          />
          <div className="mt-[20px]">
            {allowance && !loading ? (
              <Button
                className="w-full bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] border-0 text-white"
                round
                type="default"
                loading={stakeLoading}
                onClick={stakeFun}
                disabled={!canStake}
              >
                <span className="flex items-center justify-center gap-2">
                  <FireO fontSize={"20px"} />
                  <span>{t("bet")}</span>
                </span>
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] border-0 text-white"
                round
                type="default"
                loading={approveLoading}
                onClick={approveFun}
                disabled={loading}
              >
                {t("approve")}
              </Button>
            )}
          </div>
        </div>
        <div className="relative mt-[20px] p-[20px] rounded-lg border border-solid border-[rgba(255,255,255,0.17)] bg-[rgba(255,255,255,0.05)] text-white">
          <span className="text-[16px] font-bold bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent">
            {t("rewardInfo")}
          </span>
          <Link
            to="/invite"
            className="rounded-tr-lg rounded-bl-lg bg-black absolute right-0 top-0 text-[#8E58F5] text-[12px] font-bold px-2 py-1"
          >
            {t("accelerateEarnings")}
            <Click className="absolute -right-4 -bottom-6" />
          </Link>
          <div className="flex items-center justify-between text-[12px] mt-[20px]">
            <span>{t("totalAmount")}</span>
            <span>
              <span className="bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent text-[18px] font-bold">
                {Number(userInfo?.rewardLimit / 2 ?? 0).toFixed(6)}
              </span>{" "}
              {userInfo?.rewardToken}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px] mt-[10px]">
            <span>{t("claimedReward")}</span>
            <span>
              <span className="bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent text-[18px] font-bold">
                {Number(userInfo?.claimedRewards ?? 0).toFixed(6)}
              </span>{" "}
              {userInfo?.rewardToken}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px] mt-[10px]">
            <span>{t("pendingReward")}</span>
            <span className="">
              <span className="bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent text-[18px] font-bold">
                {Number(userInfo?.pendingRewards ?? 0).toFixed(6)}
              </span>{" "}
              {userInfo?.rewardToken}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px] mt-[10px]">
            <span>{t("totalReward")}</span>
            <span>
              <span className="bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent text-[18px] font-bold">
                {Number(userInfo?.totalRewards ?? 0).toFixed(6)}
              </span>{" "}
              {userInfo?.rewardToken}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px] mt-[10px]">
            <span>{t("rewardLimit")}</span>
            <span>
              <span className="bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent text-[18px] font-bold">
                {userInfo?.rewardLimit}
              </span>{" "}
              {userInfo?.rewardToken}
            </span>
          </div>
          <Button
            className="w-full !mt-[20px] bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] text-white border-0"
            round
            type="default"
            loading={claimLoading}
            disabled={!(userInfo.pendingRewards * 1 >= 100)}
            onClick={claimFun}
          >
            <span className="flex items-center justify-center gap-2">
              <GiftO fontSize={"20px"} />
              <span>{t("claimReward")}</span>
            </span>
          </Button>
          <div className="text-[12px] text-[#9F9F9F] mt-[10px]">
            {t("claimTips", { name: userInfo?.rewardToken })}
          </div>
        </div>
        <div className="mt-[20px] p-[20px] rounded-lg border border-solid border-[rgba(255,255,255,0.17)] bg-[rgba(255,255,255,0.05)] text-white">
          <span className="text-[16px] font-bold mb-[10px] bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent">
            {t("earningsRecord")}
          </span>
          {rewardList?.length ? (
            rewardList?.map((list) => {
              return (
                <div
                  className="py-2 border-0 border-b border-solid border-[#D8D8D8] last:border-b-0"
                  key={list.transactionHash}
                >
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[14px]">{t("withdrawalAmount")}</span>
                    <span>
                      <span className="text-[#27B53D] font-bold">
                        {list.amount / 10 ** 18}
                      </span>{" "}
                      <span className="text-[14px]">USDT</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[14px]">{t("transactionHash")}</span>
                    <div className="flex items-center gap-1">
                      <a
                        href={`https://bscscan.com/tx/${list.transactionHash}`}
                        target="_blank"
                        className="text-[14px] text-[#767676] underline underline-offset-1"
                        rel="noreferrer"
                      >
                        {shortStr(list.transactionHash)}
                      </a>
                      <Copy
                        onClick={() => {
                          copy(list.transactionHash);
                          toast.success(t("copySuccess"));
                        }}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center text-[14px] h-[100px]">
              {t("noData")}
            </div>
          )}
        </div>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="dark"
          closeButton={false}
          className={"text-[14px] font-bold !text-[#8E58F5] !font-Montserrat"}
        />
        <Dialog
          visible={visible}
          showCancelButton
          confirmButtonText={confirmButtonText}
          cancelButtonText={t("cancel")}
          onConfirm={() => {
            bindReferrerFun();
          }}
          onCancel={() => {
            removeParam("invite");
            setVisible(false);
          }}
        >
          <div className="p-[20px] text-center text-[14px]">
            <p>{t("acceptInvitation", { address: shortStr(invite) })}</p>
          </div>
        </Dialog>
        {/* <Dialog
          visible={visibleTip}
          showCancelButton
          showConfirmButton={false}
          cancelButtonText={t("cancel")}
          onCancel={() => {
            removeParam("invite");
            setVisibleTip(false);
          }}
        >
          <div className="p-[20px] text-center text-[14px] font-medium">
            {t("alreadyAccepted")}
          </div>
        </Dialog> */}
        {/* <Dialog
          visible={showTips}
          showCancelButton
          showConfirmButton={false}
          cancelButtonText={t("cancel")}
          onCancel={() => {
            removeParam("invite");
            setShowTips(false);
          }}
        >
          <div className="p-[20px] text-center text-[14px] font-medium">
            {t("alreadyStaked")}
          </div>
        </Dialog> */}
        {/* <Dialog
          visible={showChangeVersionModal}
          showCancelButton
          cancelButtonText={t("cancel")}
          confirmButtonText={reConfirmButtonText}
          onConfirm={() => {
            reBindReferrerFun(
              version === 2 ? stakeInfoV1.referrer : stakeInfoV2.referrer
            );
          }}
          onCancel={() => {
            setShowChangeVersionModal(false);
          }}
        >
          <div className="p-[20px] text-center text-[14px]">
            <p className="font-bold mb-2">{version === 3 && t("switchV3")}</p>
            <p>{t("invitationDetected")}</p>
            <p className="mt-2">{t("confirmToBind")}</p>
          </div>
        </Dialog> */}
      </div>
    </div>
  );
};

export default Home;
