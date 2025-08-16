import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <div className="">
      <div className="h-[40px] flex items-center justify-between px-[20px]">
        <Link className="text-white text-[12px]" to="/">
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default AdminHeader;
