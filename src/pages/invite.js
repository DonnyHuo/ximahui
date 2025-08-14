import { ethers } from "ethers";
import moment from "moment";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

import erc20Abi from "../../src/assets/abi/erc20.json";
import stakeAbi from "../../src/assets/abi/stakingContract.json";
import stakeAbiV2 from "../../src/assets/abi/stakingContractV2.json";
import stakeAbiV3 from "../../src/assets/abi/stakingContractV3.json";
import { ReactComponent as CopyMainColor } from "../../src/assets/img/copyMainColor.svg";

import { copy, getContract, shortStr, formatDecimal } from "../../src/utils";
import { fetchData } from "../http/request";

const Invite = () => {
  const { t } = useTranslation();

  const address = useSelector((state) => state.address);

  const version = useSelector((state) => state.version);

  const usdtAddress = useSelector((state) => state.usdtAddress);

  const stakingContractAddress = useSelector((state) =>
    version === 2
      ? state.stakingContractAddressV2
      : version === 3
      ? state.stakingContractAddressV3
      : state.stakingContractAddress
  );

  const [referrer, setReferrer] = useState(ethers.constants.AddressZero);

  const [staked, setStaked] = useState(false);

  const getUsers = useCallback(async () => {
    const amounts = await getContract(
      stakingContractAddress,
      version === 2 ? stakeAbiV2 : version === 3 ? stakeAbiV3 : stakeAbi,
      "users",
      address
    );

    setReferrer(amounts.referrer);
    setStaked(amounts.totalStaked.toString() * 1 > 0);
  }, [stakingContractAddress, address, version]);

  const [rewardToken, setRewardToken] = useState();

  const getRewardTokenInfo = async () => {
    const rewardToken = await getContract(usdtAddress, erc20Abi, "symbol");
    setRewardToken(rewardToken);
  };

  useEffect(() => {
    if (address) {
      getUsers();
    }
    getRewardTokenInfo();
  }, [address, getUsers]);

  const referrerShow = useMemo(() => {
    return referrer !== ethers.constants.AddressZero;
  }, [referrer]);

  const inviteLink = useMemo(() => {
    return `${window.location.origin}?invite=${address}`;
  }, [address]);

  const [info, setInfo] = useState({});

  const getList = async (address) => {
    const data = `query {
            user(id: "${address}"){
                teamSize
                referrer{
                    id
                }
                referrals{
                    id 
                }
                teamSize
                stakedAmount
                totalRefferRewards
                claimedRewards
                contributions(orderBy: timestamp, orderDirection: desc,first:20){
                    id 
                    contributor{
                        id
                    }
                generation
                amount
                referralRecord{
                    transactionHash
                }
                timestamp
            }   
        }
    }`;
    const res = await fetchData(data);

    const inviteInfo = res?.user;

    setInfo(inviteInfo);
  };

  useEffect(() => {
    if (address) {
      getList(address);
    }
  }, [address]);

  return (
    <div className="p-[20px] content-box bg-[#0D0E1E] min-h-[100vh]">
      <div className="font-bold mt-[10px] mb-[20px] text-[18px] bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0] bg-clip-text text-transparent text-center text-2xl">
        {t("welcome")}
      </div>
      <div>
        <div className="text-white  text-center">
          <span className="text-[40px] font-bold">
            {info?.totalRefferRewards
              ? (info?.totalRefferRewards / 10 ** 18).toFixed(2)
              : 0}
          </span>
          <span className="text-[14px] pl-[2px]">{rewardToken}</span>
        </div>
        <div className="text-white text-[12px] text-center">
          {t("totalEarnings")}
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0.1)] border border-solid border-[rgba(255,255,255,0.17)] rounded-2xl w-full p-10 mt-[60px]">
        <div className="flex items-center justify-around">
          <div>
            <div className="text-[#26FF60] text-[12px]">{t("myTeam")}</div>
            <div className="text-white text-[30px]">
              {info?.teamSize ?? 0} 人
            </div>
          </div>
          <div>
            <div className="text-[#26FF60] text-[12px]">
              {t("directInvitation")}
            </div>
            <div className="text-white text-[30px]">
              {info?.referrals?.length ?? 0} 人
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[20px]">
        <div>
          <div className="text-[20px] font-bold text-white text-center">
            {t("inviteFriendReward")}
          </div>
          <div className="flex items-center justify-between mt-3 gap-[20px] bg-[rgba(255,255,255,0.1)] border border-solid border-[rgba(255,255,255,0.17)] pl-4 rounded-full">
            {/* <GuideO fontSize={"20px"} /> */}
            <div className="truncate text-white text-[14px]">{inviteLink}</div>
            <button
              className="text-white rounded-r-full text-[14px] flex-shrink-0 px-10 py-3 bg-gradient-to-l from-[#5830E9] [#5830E9] [#C07DFF] to-[#FF83B0]"
              onClick={() => {
                if (!address) {
                  return toast.error(t("connectWallet"));
                }
                if (!staked) {
                  return toast.error(t("shareTips"));
                }
                copy(inviteLink);
                toast.success(t("copySuccess"));
              }}
            >
              {t("copyLink")}
            </button>
          </div>
        </div>
      </div>

      {referrerShow && (
        <div className="w-full border border-solid border-[rgba(255,255,255,0.17)] mt-[20px] rounded-2xl p-[20px] bg-[rgba(255,255,255,0.1)] text-white">
          <span className="text-[16px] font-bold mt-[20px]">
            {t("myInviter")}
          </span>

          <div className="text-[14px] flex items-center justify-between mt-2 text-white">
            <a
              href={`https://bscscan.com/address/${referrer}`}
              target="_blank"
              className="text-[14px] underline underline-offset-1 w-11/12 truncate"
              rel="noreferrer"
            >
              {referrer}
            </a>

            <CopyMainColor
              onClick={() => {
                copy(referrer);
                toast.success(t("copySuccess"));
              }}
              className="w-4 h-4 text-white"
            />
          </div>
        </div>
      )}
      <div className="w-full border border-solid border-[rgba(255,255,255,0.17)] bg-[rgba(255,255,255,0.1)] my-[20px] rounded-2xl p-[20px] text-white">
        <div className="text-[16px] font-bold mb-[20px]">
          {t("invitationRewardRecord")}
        </div>
        {info?.contributions?.length ? (
          <>
            {info?.contributions?.map((list) => {
              return (
                <div className="border-0 border-b border-solid border-[#D8D8D8] py-[10px] relative last:border-b-0">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[14px]">{t("address")}</span>
                    <span className="text-[14px] flex items-center gap-1">
                      <a
                        href={`https://bscscan.com/address/${list.contributor.id}`}
                        target="_blank"
                        className="text-[14px] underline underline-offset-1 w-11/12 truncate"
                        rel="noreferrer"
                      >
                        {shortStr(list.contributor.id)}
                      </a>
                      <CopyMainColor
                        onClick={() => {
                          copy(list.contributor.id);
                          toast.success(t("copySuccess"));
                        }}
                        className="w-4 h-4"
                      />
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[14px]">{t("amount")}</span>
                    <span>
                      <span className="text-[#27B53D] font-bold text-[18px]">
                        {formatDecimal(list.amount / 10 ** 18)}
                      </span>{" "}
                      <span className="text-[14px]">{rewardToken}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[14px]">{t("time")}</span>
                    <span className="text-[14px] text-[#767676]">
                      {moment(list.timestamp * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </span>
                  </div>
                  <div className="absolute top-[20px] left-1/4">
                    <img
                      className="w-[60px] h-[70px]"
                      src={require(`../assets/img/15/${list?.generation}.png`)}
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
          </>
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
    </div>
  );
};
export default Invite;
