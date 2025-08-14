import AdminContract from "../adminPages/contract";
import AdminHome from "../adminPages/home";
import Home from "../pages/home";
import Introduction from "../pages/introduction";
import Invite from "../pages/invite";

const routes = [
  {
    path: "/",
    element: <Home />,
    showHeader: true,
    showFooter: true
  },
  {
    path: "/invite",
    element: <Invite />,
    showHeader: true,
    showFooter: true
  },
  {
    path: "/introduction",
    element: <Introduction />,
    showHeader: false,
    showFooter: false
  },
  {
    path: "/admin",
    element: <AdminHome />,
    showHeader: true,
    showFooter: false
  },
  {
    path: "/admin/contract",
    element: <AdminContract />,
    showHeader: true,
    showFooter: false
  }
];

export default routes;
