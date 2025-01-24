import logo from "./logo.svg";
import "./App.css";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { EventType } from "@azure/msal-browser";
import { compareIssuingPolicy } from "./utils/claimUtils";
import { b2cPolicies, protectedResources } from "./authConfig";
import { Route, Routes } from "react-router-dom";
import { Home } from "./Pages/Home";
import { PageLayout } from "./Component/pageLayout";

const Pages = () => {
  const { instance } = useMsal();

  console.log("b2cPolicies", b2cPolicies);

  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (
        (event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
        event.payload.account
      ) {
        if (
          compareIssuingPolicy(
            event.payload.idTokenClaims,
            b2cPolicies.names.editProfile
          )
        ) {
          const originalSignInAccount = instance
            .getAllAccounts()
            .find(
              (account) =>
                account.idTokenClaims.oid === event.payload.idTokenClaims.oid &&
                account.idTokenClaims.sub === event.payload.idTokenClaims.sub &&
                compareIssuingPolicy(
                  account.idTokenClaims,
                  b2cPolicies.names.signUpSignIn
                )
            );

          let signUpSignInFlowRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            account: originalSignInAccount,
          };

          instance.ssoSilent(signUpSignInFlowRequest);
        }

        if (
          compareIssuingPolicy(
            event.payload.idTokenClaims,
            b2cPolicies.names.forgotPassword
          )
        ) {
          let signUpSignInFlowRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            scopes: [
              ...protectedResources.apiList.scopes.read,
              ...protectedResources.apiList.scopes.write,
            ],
          };
          instance.loginRedirect(signUpSignInFlowRequest);
        }
      }

      if (event.eventType === EventType.LOGIN_FAILURE) {
        console.log("event.error", event.error)
        if (event.error && event.error.errorMessage.includes("AADB2C90118")) {
          const resetPasswordRequest = {
            authority: b2cPolicies.authorities.forgotPassword.authority,
            scopes: [],
          };
          instance.loginRedirect(resetPasswordRequest);
        }
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  return (
    <Routes>
      {/* <Route path="/todolist" element={<TodoList />} /> */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

const App = ({ instance }) => {
  console.log("instance in App", instance);
  return (
    <MsalProvider instance={instance}>
      <PageLayout>
        <Pages />
      </PageLayout>
    </MsalProvider>
  );
};

export default App;
