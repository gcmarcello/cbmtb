import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const UserWay = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.split("/")[1] === "inscricao") {
      const myElement = document.getElementById("userwayAccessibilityIcon");
      if (myElement) {
        myElement.style.display = "none";
      }
    }
  },[]);


  if(process.env.NODE_ENV !== "production") return null;


  return (function (d) {
    var s = d.createElement("script");
    s.setAttribute("data-account", "vBloadPTNB");
    s.setAttribute("src", "https://cdn.userway.org/widget.js");
    (d.body || d.head).appendChild(s);
  })(document);
};
export default UserWay;
