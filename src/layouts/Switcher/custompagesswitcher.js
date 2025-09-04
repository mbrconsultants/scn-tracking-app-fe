import React, { useEffect } from "react";
import Scrollbars from "react-custom-scrollbars";
import {Row} from "react-bootstrap"
import { Link } from "react-router-dom";
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata";
export function Custompagesswitcher() {
 
  useEffect(()=>{
    custompagesswitcherdata.localStorageBackUp();
  })
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

    custompagesswitcherdata.dynamicLightPrimaryColor(dynamicPrimaryLight, userColor);

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

    custompagesswitcherdata.name();
  }
  function darkPrimaryColor() {
    var userColor = document.getElementById("darkPrimaryColorID").value;

    localStorage.setItem("darkPrimaryColor", userColor);

    const dynamicPrimaryDark = document.querySelectorAll(
      "input.color-primary-dark"
    );

    custompagesswitcherdata.dynamicDarkPrimaryColor(dynamicPrimaryDark, userColor);

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

    custompagesswitcherdata.name();
  }
  function transparentPrimaryColor() {
    var userColor = document.getElementById("transparentPrimaryColorID").value;

    localStorage.setItem("transparentPrimaryColor", userColor);

    const PrimaryTransparent = document.querySelectorAll(
      "input.color-primary-transparent"
    );

    custompagesswitcherdata.dynamicTransparentPrimaryColor(PrimaryTransparent, userColor);

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

    custompagesswitcherdata.name();
  }
  function BgTransparentBackground() {
    var userColor = document.getElementById("transparentBgColorID").value;

    localStorage.setItem("transparentBgColor", userColor);

    const dynamicBackgroundColor = document.querySelectorAll(
      "input.color-bg-transparent"
    );

    custompagesswitcherdata.dynamicBgTransparentBackground(
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

    localStorage.removeItem("primaryColor");
    localStorage.removeItem("primaryHoverColor");
    localStorage.removeItem("primaryBorderColor");
    localStorage.removeItem("primaryTransparent");
    localStorage.removeItem("darkPrimaryColor");
    localStorage.removeItem("transparent-bgImgPrimaryColor");
    localStorage.removeItem("BgImage");

    custompagesswitcherdata.name();
  }
  function BgImgTransparentPrimaryColor() {
    var userColor = document.getElementById(
      "transparentBgImgPrimaryColorID"
    ).value;

    localStorage.setItem("transparent-bgImgPrimaryColor", userColor);

    const dynamicPrimaryImgTransparent = document.querySelectorAll(
      "input.color-primary-img-transparent"
    );

    custompagesswitcherdata.dynamicBgImgTransparentPrimaryColor(
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
    custompagesswitcherdata.name();
  }
   
  return (
    <div className="switcher-wrapper" >
      
    </div>
  );
}
export default Custompagesswitcher;
