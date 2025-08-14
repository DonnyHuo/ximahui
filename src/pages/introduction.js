import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { ReactComponent as Copy } from "../../src/assets/img/copyWhite.svg";
import { ReactComponent as Email } from "../../src/assets/img/email.svg";
import { ReactComponent as GoBack } from "../../src/assets/img/goBack.svg";
import { ReactComponent as IntroLogo } from "../../src/assets/img/introLogo.svg";
import { ReactComponent as Telegram } from "../../src/assets/img/telegram.svg";
import { ReactComponent as X } from "../../src/assets/img/X.svg";
import { copy, shortStr } from "../utils";

const Introduction = () => {
  const { t } = useTranslation();

  const stakingContractAddressV3 = useSelector(
    (state) => state.stakingContractAddressV3
  );

  return (
    <div className="introduction">
      <div className="bg-[rgba(0,0,0,0.9)] min-h-[100vh] p-[20px] text-white text-center text-[14px]">
        <Link to="/" className="flex items-center gap-1">
          <GoBack className="w-5 h-5" />
          <span className="text-[12px] text-[#8E58F5]">
            {t("intro.backToHome")}
          </span>
        </Link>

        <div className="flex items-center justify-center mt-[30px]">
          <IntroLogo />
        </div>
        <div className="text-[26px] mt-[10px] shadow font-bold tracking-widest">
          {t("intro.title")}
        </div>
        <div className="mt-[15px]">
          <p>{t("intro.subtitle")[0]}</p>
          <p>{t("intro.subtitle")[1]}</p>
        </div>
        <div className="mt-[15px]">
          <p>{t("intro.description")[0]}</p>
          <p className="text-[#FF9500]">{t("intro.description")[1]}</p>
        </div>
        <div className="mt-[30px] leading-6">
          <p>{t("intro.about")}</p>
          <p>{t("intro.team")}</p>
        </div>

        <div className="mt-[30px] text-[12px]">
          <div className="text-[#FF9500] font-bold">{t("intro.details")}</div>
          <a className="text-[#FF9500]" href="/Vegas.pdf" download="Vegas.pdf">
            <button>Vegas.pdf</button>
          </a>
          <div className="mt-[10px] font-bold">{t("intro.officialDapp")}</div>
          <div className="flex items-center justify-center gap-2">
            <span>https://game.wwwvegas.net</span>
            <Copy
              onClick={() => {
                copy("https://game.wwwvegas.net");
                toast.success(t("copySuccess"));
              }}
            />
          </div>
          <div className="mt-[10px] font-bold">
            {t("intro.contractAddress")}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>{shortStr(stakingContractAddressV3)}</span>
            <Copy
              onClick={() => {
                copy(stakingContractAddressV3);
                toast.success(t("copySuccess"));
              }}
            />
          </div>
        </div>

        <div>
          <div className="text-[14px] font-bold text-center mt-2 mb-1">
            {t("customerSupportEmail")}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[12px]">vegasvip008@gmail.com</span>
            <Copy
              onClick={() => {
                copy("vegasvip008@gmail.com");
                toast.success(t("copySuccess"));
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[14px] font-bold text-center mb-3">
            {t("contactInfo")}
          </div>
          <div className="text-[12px] flex items-center justify-center gap-[60px] text-center">
            <a
              target="_blank"
              className="text-[12px] font-bold underline text-[#8E58F5]"
              href="https://t.me/VegasGroup1"
              rel="noreferrer"
            >
              <Telegram className="w-[20px] h-[20px]" />
            </a>
            <a
              target="_blank"
              className="text-[12px] font-bold underline text-[#8E58F5]"
              href="https://x.com/Vegas_net"
              rel="noreferrer"
            >
              <X className="w-[16px] h-[16px]" />
            </a>
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
