import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { Popover } from "react-vant";

import { ArrowDown } from "@react-vant/icons";

import { setVersion } from "../store/slice";
import { store } from "../store";

const AdminHeader = () => {
  const { t } = useTranslation();
  const popover = useRef(null);

  const version = useSelector((state) => state.version);
  const [searchParams, setSearchParams] = useSearchParams();

  const versionFromUrl = searchParams.get("version");

  if (versionFromUrl) {
    store.dispatch(setVersion(Number(versionFromUrl)));
  }

  const actions = [
    { key: 2, text: t("switch") },
    { key: 3, text: t("switchV3") }
  ];

  const [versionState, setVersionState] = useState(version);

  const select = (value) => {
    setVersionState(value);
    setSearchParams({ version: value });
    store.dispatch(setVersion(value));
    setTimeout(() => {
      window.location.reload();
    });
  };

  return (
    <div className="">
      <div className="h-[40px] flex items-center justify-between px-[20px]">
        <Link className="text-white text-[12px]" to="/">
          返回首页
        </Link>
        <div className="text-[#8E58F5] font-bold leading-[40px] text-center">
          Welcome to XIMAHUI
        </div>

        <div className="flex items-center gap-2">
          <Popover
            ref={popover}
            theme="dark"
            placement={"bottom-end"}
            reference={
              <div className="flex items-center gap-1">
                <span className="text-[14px]">
                  {actions.filter((list) => list.key === versionState)[0].text}
                </span>
                <ArrowDown className="w-3 h-3" />
              </div>
            }
          >
            <div className="bg-[#000] px-4 py-2 text-left">
              {actions.map((list) => {
                return (
                  <div
                    onClick={() => select(list.key)}
                    className={`text-[12px] py-[6px] ${
                      versionState === list.key
                        ? "text-[#8E58F5]"
                        : "text-white"
                    }`}
                    key={list.key}
                  >
                    {list.text}
                  </div>
                );
              })}
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
