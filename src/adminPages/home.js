import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import erc20Abi from "../../src/assets/abi/erc20.json";
import stakeAbi from "../../src/assets/abi/stakingContract.json";
import stakeAbiV2 from "../../src/assets/abi/stakingContractV2.json";
import Total from "../../src/assets/img/adminTotal.png";
import { ReactComponent as Copy } from "../../src/assets/img/copyWhite.svg";
import { ReactComponent as Delete } from "../../src/assets/img/delete.svg";
import { ReactComponent as Loading } from "../../src/assets/img/loading.svg";
import { ReactComponent as Search } from "../../src/assets/img/search.svg";
import { ReactComponent as Arrow } from "../assets/img/arrow.svg";
import { fetchData } from "../http/request";
import { shortStr, getContract, copy, formatDecimal } from "../utils";
import AdminHeader from "./header";

import "./style.css";

const AdminHome = () => {
  const { t } = useTranslation();

  const [active, setActive] = useState(0);

  const [showList, setShowList] = useState(false);

  const [search, setSearch] = useState("");

  const [total, setTotal] = useState({});

  const getInfo = async () => {
    const params = `
      query {
        systemStats {
          totalStaked
          totalRefferRewards
          totalCliamed
        }
      }
    `;
    const res = await fetchData(params);
    console.log("res", res);
    if (res?.systemStats) {
      const data = res?.systemStats[0];
      setTotal(data);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const [userInfo, setUserInfo] = useState();

  const [listLoading, setListLoading] = useState(false);

  const getList = async (address) => {
    if (!ethers.utils.isAddress(address)) {
      return toast.error("请输入正确的查询地址");
    }
    setListLoading(true);

    const addr = address.toLowerCase();

    let data = "";
    if (version === 3) {
      data = `query {
        user(id: "${addr}"){
            teamSize
            referrer{
                id
            }
            referrals{
                id 
            }
            teamSize
            stakedAmount
            currentStakedAmount
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
    } else {
      data = `query {
        user(id: "${addr}"){
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
    }
    const res = await fetchData(data);

    setListLoading(false);

    const inviteInfo = res?.user;

    setUserInfo(inviteInfo);
  };

  const version = useSelector((state) => state.version);

  const usdtAddress = useSelector((state) => state.usdtAddress);

  const stakingContractAddress = useSelector((state) =>
    version === 2
      ? state.stakingContractAddressV2
      : version === 3
      ? state.stakingContractAddressV3
      : state.stakingContractAddress
  );

  const [rewardTokenInfo, setRewardTokenInfo] = useState();

  const getRewardTokenInfo = async () => {
    const decimals = await getContract(usdtAddress, erc20Abi, "decimals");
    const symbol = await getContract(usdtAddress, erc20Abi, "symbol");

    setRewardTokenInfo({
      symbol,
      decimals
    });
  };

  useEffect(() => {
    getRewardTokenInfo();
  }, []);

  const [userInfo2, setUserInfo2] = useState();

  const getUserInfo = useCallback(async () => {
    await getContract(
      stakingContractAddress,
      [3].includes(version) ? stakeAbiV2 : stakeAbi,
      "getUserInfo",
      search
    )
      .then((userInfo) => {
        console.log("userInfo", userInfo);
        setUserInfo2({
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
    search,
    rewardTokenInfo?.decimals,
    rewardTokenInfo?.symbol,
    stakingContractAddress,
    version
  ]);

  useEffect(() => {
    if (ethers.utils.isAddress(search)) {
      getList(search);
      getUserInfo(search);
    }
  }, [getUserInfo, search]);

  const NoData = () => {
    return (
      <div className="text-center h-[200px] flex items-center justify-center text-[14px] text-[#767676]">
        无数据
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <AdminHeader />
      <div className="px-[20px] bg-black py-[30px]">
        <div className="card px-[20px] py-[20px] relative mt-[50px]">
          <div>总质押金额</div>
          <div>
            <span className="text-[#27B53D] text-[38px] font-bold">
              {total?.totalStaked
                ? formatDecimal(
                    total?.totalStaked / 10 ** rewardTokenInfo?.decimals ?? 18,
                    2
                  )
                : "--"}
            </span>
            <span className="text-[#27B53D] text-[12px] ml-1">
              {rewardTokenInfo?.symbol}
            </span>
          </div>
          <div className="absolute right-0 -top-[70px]">
            <img className="w-[170px] h-[170px]" src={Total} alt="" />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-[20px]">
          <div className="w-1/2 card px-[20px] py-[18px]">
            <div>总提取收益</div>
            <div>
              <p className="text-[#27B53D] text-[26px] font-bold max-w-full">
                {total?.totalCliamed
                  ? formatDecimal(
                      total?.totalCliamed / 10 ** rewardTokenInfo?.decimals ??
                        18,
                      2
                    )
                  : "--"}
              </p>
              <p className="text-[#27B53D] text-[12px]">
                {" "}
                {rewardTokenInfo?.symbol}
              </p>
            </div>
          </div>
          <div className="w-1/2 card px-[20px] py-[18px]">
            <div className="text-[16px] font-bold ">总推荐奖励</div>
            <div>
              <p className="text-[#27B53D] text-[26px] font-bold max-w-full truncate">
                {total?.totalRefferRewards
                  ? formatDecimal(
                      total?.totalRefferRewards /
                        10 ** rewardTokenInfo?.decimals ?? 18,
                      2
                    )
                  : "--"}
              </p>
              <p className="text-[#27B53D] text-[12px]">
                {rewardTokenInfo?.symbol}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-[30px] px-[20px]">
        <Link to="/admin/contract">
          <button className="bg-[#8E58F5] rounded-[8px] text-black w-full h-[48px] font-bold">
            操作合约
          </button>
        </Link>
        <div className="my-[20px] w-full bg-black rounded-[32px] flex items-center gap-1">
          <input
            className="bg-transparent w-full h-[40px] pl-[20px] text-[14px] placeholder:text-[12px] placeholder:text-[#767676]"
            type="text"
            placeholder="请输入搜索地址"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center justify-end gap-2 mr-[20px] flex-shrink-0">
            {search && (
              <Delete
                className="w-[20px] h-[20px]"
                onClick={() => {
                  setSearch("");
                  setUserInfo();
                }}
              />
            )}
            <Search
              className="w-[20px] h-[20px]"
              onClick={() => {
                getList(search);
                getUserInfo(search);
              }}
            />
          </div>
        </div>

        <div className="text-[14px] flex gap-2">
          <button
            className={`px-[20px] py-1 font-bold rounded-[32px] ${
              active === 0 ? "bg-[#8E58F5] text-black" : "bg-black text-white"
            }`}
            onClick={() => setActive(0)}
          >
            用户
          </button>
          <button
            className={`px-[20px] py-1 font-bold rounded-[32px] ${
              active === 1 ? "bg-[#8E58F5] text-black" : "bg-black text-white"
            }`}
            onClick={() => setActive(1)}
          >
            直推列表
          </button>
        </div>

        {listLoading ? (
          <div className="text-center h-[200px] flex items-center justify-center">
            <Loading className="w-[24px] h-[24px] animate-spin" />
          </div>
        ) : (
          <>
            {userInfo ? (
              <>
                {active ? (
                  <div className="text-[14px]">
                    <div className="card mt-[20px] px-[20px] py-3 flex items-center justify-between text-[#8E58F5] font-bold">
                      <span>总人数</span>
                      <span>
                        {userInfo.referrals ? userInfo.referrals?.length : 0} 人
                      </span>
                    </div>
                    {userInfo.referrals?.length > 0 && (
                      <div className="card mt-[20px] px-[20px] py-3">
                        <div
                          className="flex items-center justify-between text-[#8E58F5] font-bold"
                          onClick={() => setShowList((pre) => (pre = !pre))}
                        >
                          <span>列表</span>
                          <Arrow className={!showList && "rotate-180"} />
                        </div>
                        {showList && (
                          <div className="mt-[10px]">
                            {userInfo.referrals.map((list) => {
                              return (
                                <div
                                  key={list.id}
                                  className="flex items-center justify-between font-bold py-2"
                                >
                                  <span className="text-white">地址</span>
                                  <span className="text-[#FFC300] flex items-center gap-1">
                                    {shortStr(list.id)}
                                    <Copy
                                      onClick={() => {
                                        copy(list.id);
                                        toast.success(t("copySuccess"));
                                      }}
                                      className="w-[14px] h-[14px] text-white"
                                    />
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="card px-[20px] py-3 mt-[20px] text-[14px]">
                    <div className="flex items-center justify-between py-2">
                      <span>地址</span>
                      <span className="text-[#FFC300] font-bold">
                        {shortStr(search)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span>邀请人</span>
                      <span className="text-[#FFC300] font-bold flex items-center gap-1">
                        {userInfo?.referrer?.id ? (
                          <>
                            {shortStr(userInfo.referrer.id)}
                            <Copy
                              onClick={() => {
                                copy(userInfo.referrer.id);
                                toast.success(t("copySuccess"));
                              }}
                              className="w-[14px] h-[14px] text-white"
                            />
                          </>
                        ) : (
                          "--"
                        )}
                      </span>
                    </div>
                    {version === 3 && (
                      <div className="flex items-center justify-between py-2">
                        <span>当前质押金额</span>
                        <span className="text-[#8E58F5] font-bold">
                          {formatDecimal(
                            userInfo?.currentStakedAmount /
                              10 ** rewardTokenInfo?.decimals ?? 18
                          )}{" "}
                          {rewardTokenInfo?.symbol}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2">
                      {version === 3 ? (
                        <span>历史质押金额</span>
                      ) : (
                        <span>质押金额</span>
                      )}
                      <span className="text-[#8E58F5] font-bold">
                        {formatDecimal(
                          userInfo?.stakedAmount /
                            10 ** rewardTokenInfo?.decimals ?? 18
                        )}{" "}
                        {rewardTokenInfo?.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span>推荐奖励</span>
                      <span className="text-[#8E58F5] font-bold">
                        {userInfo?.totalRefferRewards
                          ? formatDecimal(
                              userInfo?.totalRefferRewards /
                                10 ** rewardTokenInfo?.decimals ?? 18
                            )
                          : "--"}{" "}
                        {rewardTokenInfo?.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span>已提取奖励</span>
                      <span className="text-[#8E58F5] font-bold">
                        {" "}
                        {formatDecimal(
                          userInfo?.claimedRewards /
                            10 ** rewardTokenInfo?.decimals ?? 18
                        )}{" "}
                        {rewardTokenInfo?.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span>总收益</span>
                      <span className="text-[#8E58F5] font-bold">
                        {userInfo2
                          ? formatDecimal(userInfo2?.totalRewards)
                          : "--"}{" "}
                        {rewardTokenInfo?.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span>待领取收益</span>
                      <span className="text-[#8E58F5] font-bold">
                        {userInfo2
                          ? formatDecimal(userInfo2?.pendingRewards)
                          : "--"}{" "}
                        {rewardTokenInfo?.symbol}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <NoData />
            )}
          </>
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
        className={"text-[14px] font-bold !text-[#8E58F5]"}
      />
    </div>
  );
};

export default AdminHome;
