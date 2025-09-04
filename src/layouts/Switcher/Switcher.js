import React, { useEffect } from "react";
import Scrollbars from "react-custom-scrollbars";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Switcherdata from "../../data/Switcher/Switcherdata";
export function Switcher() {
  useEffect(() => {
    Switcherdata.localStorageBackUp();
  });
  function changePrimaryColor() {
    var userColor = document.getElementById("colorID").value;
    localStorage.setItem("primaryColor", userColor);
    // to store value as opacity 0.95 we use 95
    localStorage.setItem("primaryHoverColor", userColor + 95);
    localStorage.setItem("primaryBorderColor", userColor);
    localStorage.setItem("primaryTransparent", userColor + 20);

    const dynamicPrimaryLight = document.querySelectorAll(
      "input.color-primary-light"
    );

    Switcherdata.dynamicLightPrimaryColor(dynamicPrimaryLight, userColor);

    document.getElementById("myonoffswitch6").checked = true;

    // Adding
    document.querySelector("body")?.classList.add("light-mode");

    // Removing
    document.querySelector("body")?.classList.remove("dark-mode");
    document.querySelector("body")?.classList.remove("transparent-mode");
    document.querySelector("body")?.classList.remove("bg-img1");
    document.querySelector("body")?.classList.remove("bg-img2");
    document.querySelector("body")?.classList.remove("bg-img3");
    document.querySelector("body")?.classList.remove("bg-img4");

    localStorage.removeItem("darkPrimaryColor");
    localStorage.removeItem("transparentPrimaryColor");
    localStorage.removeItem("transparentBgColor");
    localStorage.removeItem("transparent-bgImgPrimaryColor");
    localStorage.removeItem("BgImage");

    Switcherdata.name();
  }
  function darkPrimaryColor() {
    var userColor = document.getElementById("darkPrimaryColorID").value;

    localStorage.setItem("darkPrimaryColor", userColor);

    const dynamicPrimaryDark = document.querySelectorAll(
      "input.color-primary-dark"
    );

    Switcherdata.dynamicDarkPrimaryColor(dynamicPrimaryDark, userColor);

    document.getElementById("myonoffswitch7").checked = true;

    // Adding
    document.querySelector("body")?.classList.add("dark-mode");
    document.querySelector("body")?.classList.add("dark-mode");

    // Removing
    document.querySelector("body")?.classList.remove("light-mode");
    document.querySelector("body")?.classList.remove("transparent-mode");
    document.querySelector("body")?.classList.remove("bg-img1");
    document.querySelector("body")?.classList.remove("bg-img2");
    document.querySelector("body")?.classList.remove("bg-img3");
    document.querySelector("body")?.classList.remove("bg-img4");

    localStorage.removeItem("primaryColor");
    localStorage.removeItem("primaryHoverColor");
    localStorage.removeItem("primaryBorderColor");
    localStorage.removeItem("primaryTransparent");
    localStorage.removeItem("transparentPrimaryColor");
    localStorage.removeItem("transparentBgColor");
    localStorage.removeItem("transparent-bgImgPrimaryColor");
    localStorage.removeItem("BgImage");

    Switcherdata.name();
  }
  function transparentPrimaryColor() {
    var userColor = document.getElementById("transparentPrimaryColorID").value;

    localStorage.setItem("transparentPrimaryColor", userColor);

    const PrimaryTransparent = document.querySelectorAll(
      "input.color-primary-transparent"
    );

    Switcherdata.dynamicTransparentPrimaryColor(PrimaryTransparent, userColor);

    document.getElementById("myonoffswitchTransparent").checked = true;

    // Adding
    document.querySelector("body")?.classList.add("transparent-mode");

    // Removing
    document.querySelector("body")?.classList.remove("light-mode");
    document.querySelector("body")?.classList.remove("dark-mode");
    document.querySelector("body")?.classList.remove("bg-img1");
    document.querySelector("body")?.classList.remove("bg-img2");
    document.querySelector("body")?.classList.remove("bg-img3");
    document.querySelector("body")?.classList.remove("bg-img4");

    localStorage.removeItem("primaryColor");
    localStorage.removeItem("primaryHoverColor");
    localStorage.removeItem("primaryBorderColor");
    localStorage.removeItem("primaryTransparent");
    localStorage.removeItem("darkPrimaryColor");
    localStorage.removeItem("transparent-bgImgPrimaryColor");
    localStorage.removeItem("BgImage");

    Switcherdata.name();
  }
  function BgTransparentBackground() {
    var userColor = document.getElementById("transparentBgColorID").value;

    localStorage.setItem("transparentBgColor", userColor);

    const dynamicBackgroundColor = document.querySelectorAll(
      "input.color-bg-transparent"
    );

    Switcherdata.dynamicBgTransparentBackground(
      dynamicBackgroundColor,
      userColor
    );

    document.getElementById("myonoffswitchTransparent").checked = true;

    // Adding
    document.querySelector("body")?.classList.add("transparent-mode");

    // Removing
    document.querySelector("body")?.classList.remove("light-mode");
    document.querySelector("body")?.classList.remove("dark-mode");
    document.querySelector("body")?.classList.remove("bg-img1");
    document.querySelector("body")?.classList.remove("bg-img2");
    document.querySelector("body")?.classList.remove("bg-img3");
    document.querySelector("body")?.classList.remove("bg-img4");
    document.querySelector("body")?.classList.remove("light-header");
    document.querySelector("body")?.classList.remove("color-header");
    document.querySelector("body")?.classList.remove("dark-header");
    document.querySelector("body")?.classList.remove("gradient-header");
    document.querySelector("body")?.classList.remove("light-menu");
    document.querySelector("body")?.classList.remove("color-menu");
    document.querySelector("body")?.classList.remove("dark-menu");
    document.querySelector("body")?.classList.remove("gradient-menu");

    localStorage.removeItem("primaryColor");
    localStorage.removeItem("primaryHoverColor");
    localStorage.removeItem("primaryBorderColor");
    localStorage.removeItem("primaryTransparent");
    localStorage.removeItem("darkPrimaryColor");
    localStorage.removeItem("transparent-bgImgPrimaryColor");
    localStorage.removeItem("BgImage");

    Switcherdata.name();
  }
  function BgImgTransparentPrimaryColor() {
    var userColor = document.getElementById(
      "transparentBgImgPrimaryColorID"
    ).value;

    localStorage.setItem("transparent-bgImgPrimaryColor", userColor);

    const dynamicPrimaryImgTransparent = document.querySelectorAll(
      "input.color-primary-img-transparent"
    );

    Switcherdata.dynamicBgImgTransparentPrimaryColor(
      dynamicPrimaryImgTransparent,
      userColor
    );

    document.getElementById("myonoffswitchTransparent").checked = true;

    // Adding
    document.querySelector("body")?.classList.add("transparent-mode");

    // Removing
    document.querySelector("body")?.classList.remove("light-mode");
    document.querySelector("body")?.classList.remove("dark-mode");

    localStorage.removeItem("primaryColor");
    localStorage.removeItem("primaryHoverColor");
    localStorage.removeItem("primaryBorderColor");
    localStorage.removeItem("primaryTransparent");
    localStorage.removeItem("darkPrimaryColor");
    localStorage.removeItem("transparentPrimaryColor");
    localStorage.removeItem("transparentBgColor");

    document.querySelector("html").style.removeProperty("--transparent-body");

    if (
      document.querySelector("body")?.classList.contains("bg-img1") === false &&
      document.querySelector("body")?.classList.contains("bg-img2") === false &&
      document.querySelector("body")?.classList.contains("bg-img3") === false &&
      document.querySelector("body")?.classList.contains("bg-img4") === false
    ) {
      document.querySelector("body")?.classList.add("bg-img1");
      localStorage.setItem("BgImage", "bg-img1");
    }
    Switcherdata.name();
  }
  return (
    <div className="switcher-wrapper">
      
    </div>
  );
}
export default Switcher;
