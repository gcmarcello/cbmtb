import { useLocation } from "react-router-dom";

const UserWay = () => {
  const location = useLocation().pathname.split("/")[1];
  if (location === "inscricao") {
    return null;
  }
  return (function (d) {
    var s = d.createElement("script");
    s.setAttribute("data-account", "vBloadPTNB");
    s.setAttribute("src", "https://cdn.userway.org/widget.js");
    (d.body || d.head).appendChild(s);
  })(document);
};
export default UserWay;
