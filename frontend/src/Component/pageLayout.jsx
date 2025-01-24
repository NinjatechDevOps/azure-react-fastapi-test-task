import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

import { loginRequest } from "../authConfig";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const PageLayout = (props) => {
  const navigate = useNavigate();

  const { instance, inProgress } = useMsal();

  let activeAccount = null;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  const handleLoginPopup = () => {
    console.log("instance popup", instance);
    instance
      .loginPopup({ ...loginRequest, redirectUri: "https://fast-api-front.projectanddemoserver.com/" })
      .catch((error) => console.log("error in popup", error));
  };

  const handleLoginRedirect = () => {
    console.log(inProgress);
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  const handleLogoutRedirect = () => {
    instance.logoutRedirect();
  };
  

  return (
    <>
      <h1 onClick={() => navigate("/")}>Hii There </h1>

      <br />

      <AuthenticatedTemplate>
        <button onClick={handleLogoutRedirect}>Logout</button>
      </AuthenticatedTemplate>

      <br />

      <UnauthenticatedTemplate>
        <button onClick={handleLoginPopup}>Login Popup</button> ||{" "}
        <button onClick={handleLoginRedirect}>Login Redirect</button>
      </UnauthenticatedTemplate>

      <br />
      {props.children}
    </>
  );
};
