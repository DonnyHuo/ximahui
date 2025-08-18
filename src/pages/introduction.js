import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { ReactComponent as Copy } from "../../src/assets/img/copyWhite.svg";
import { ReactComponent as GoBack } from "../../src/assets/img/goBack.svg";
import IntroLogo from "../../src/assets/img/logo.png";
import { ReactComponent as Telegram } from "../../src/assets/img/telegram.svg";
import { ReactComponent as X } from "../../src/assets/img/X.svg";
import { copy, shortStr } from "../utils";
import { useSelector } from "react-redux";

const Introduction = () => {
  const { t } = useTranslation();

  const stakingContractAddress = useSelector(
    (state) => state.stakingContractAddress
  );

  return (
    <div className="introduction">
      <div className="bg-[rgba(0,0,0,0.9)] min-h-[100vh] p-[20px] text-white text-center text-[14px]">
        <Link to="/" className="flex items-center gap-1">
          <GoBack className="w-5 h-5 text-[#8E58F5]" />
          <span className="text-[12px] text-[#8E58F5]">
            {t("intro.backToHome")}
          </span>
        </Link>

        <div className="flex items-center justify-center my-[30px]">
          <img src={IntroLogo} className="w-32 h-32" alt="" />
        </div>

        <div className="text-left">
          <div className="text-center text-xl py-2">
            <p>{t("intro.subtitle")[0]}</p>
          </div>
          <div>{t("intro.description")[0]}</div>
          <div>{t("intro.description")[1]}</div>
          <div className="text-center text-xl pb-2 pt-6">
            {t("intro.subtitle")[1]}
          </div>
          <div>{t("intro.description")[2]}</div>
          <div>{t("intro.description")[3]}</div>
        </div>

        {/* 
        <div className="mt-[30px] text-[12px]">
          <div className="text-[#FF9500] font-bold">{t("intro.details")}</div>
          <a
            className="text-[#FF9500]"
            href="/Galaxy.pdf"
            download="Galaxy.pdf"
          >
            <button>Galaxy.pdf</button>
          </a>
        </div> */}
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center justify-between">
            <div className="mt-[10px] font-bold">{t("intro.officialDapp")}</div>
            <div className="flex items-center justify-center gap-2 underline">
              <a
                href="https://www.galaxyexpress.net"
                target="_blank"
                rel="noreferrer"
              >
                https://www.galaxyexpress.net
              </a>
              <Copy
                onClick={() => {
                  copy("https://www.galaxyexpress.net");
                  toast.success(t("copySuccess"));
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="mt-[10px] font-bold">
              {t("intro.contractAddress")}
            </div>
            <div className="flex items-center justify-center gap-2">
              <a
                href={`https://bscscan.com/address/${stakingContractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {shortStr(stakingContractAddress)}
              </a>
              <Copy
                onClick={() => {
                  copy(stakingContractAddress);
                  toast.success(t("copySuccess"));
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[14px] font-bold text-center mt-2 mb-1">
              {t("customerSupportEmail")}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[12px]">Galaxy_000001</span>
              <Copy
                onClick={() => {
                  copy("Galaxy_000001");
                  toast.success(t("copySuccess"));
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[14px] font-bold text-center mb-3">
              {t("contactInfo")}
            </div>
            <div className="text-[12px] flex items-center justify-center gap-[32px] text-center">
              <a
                target="_blank"
                className="text-[12px] font-bold underline text-[#8E58F5]"
                href="https://t.me/galaxy_group1"
                rel="noreferrer"
              >
                <Telegram className="w-[20px] h-[20px]" />
              </a>
              <a
                target="_blank"
                className="text-[12px] font-bold underline text-[#8E58F5]"
                href="https://x.com/galaxy_Century"
                rel="noreferrer"
              >
                <X className="w-[16px] h-[16px]" />
              </a>
            </div>
          </div>
        </div>
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

export default Introduction;
