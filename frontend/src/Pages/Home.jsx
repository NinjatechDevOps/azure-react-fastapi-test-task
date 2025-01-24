import { useEffect, useState } from "react";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import axios from "axios";

export const Home = () => {
  const { instance } = useMsal();
  const [healthCheckData, setHealthCheckData] = useState(null);
  const [isApiCalled, setIsApiCalled] = useState(false);

  const activeAccount = instance.getActiveAccount();

  const getAllHealthcheck = async (idtoken) => {
    try {
      const { data } = await axios.get(
        "https://fast-api-back.projectanddemoserver.com/healthcheck",
        {
          headers: {
            Authorization: `Bearer ${idtoken}`,
          },
        }
      );
      console.log("data", data);
      setHealthCheckData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (activeAccount && activeAccount.idToken && !isApiCalled) {
      // Call the API only once when activeAccount is available
      getAllHealthcheck(activeAccount.idToken);
      setIsApiCalled(true); // Mark API as called
    }
  }, [instance, activeAccount, isApiCalled]);

  return (
    <>
      <AuthenticatedTemplate>
        {activeAccount ? (
          <>
            <h1>
              <center>Hello World</center>
              <center>
                {healthCheckData ? healthCheckData.timestamp : ""}
              </center>
            </h1>
          </>
        ) : (
          <center>No Active Account Found</center>
        )}
      </AuthenticatedTemplate>
    </>
  );
};
