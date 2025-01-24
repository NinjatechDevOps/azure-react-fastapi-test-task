export const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1_signin_signup",
    forgotPassword: "B2C_1_reset_password",
    editProfile: "B2C_1_edit_profile",
  },
  authorities: {
    signUpSignIn: {
      authority:
        "https://ninjatech.b2clogin.com/ninjatech.onmicrosoft.com/B2C_1_signin_signup",
    },
    forgotPassword: {
      authority:
        "https://ninjatech.b2clogin.com/ninjatech.onmicrosoft.com/B2C_1_reset_password",
    },
    editProfile: {
      authority:
        "https://ninjatech.b2clogin.com/ninjatech.onmicrosoft.com/B2C_1_edit_profile",
    },
  },
  authorityDomain: "ninjatech.b2clogin.com",
};

export const msalConfig = {
  auth: {
    clientId: "8793f8f6-707a-416c-9882-c53393665003",
    authority:
      "https://ninjatech.b2clogin.com/ninjatech.onmicrosoft.com/B2C_1_signin_signup",
    knownAuthorities: ["ninjatech.b2clogin.com"],
    redirectUri: "https://fast-api-front.projectanddemoserver.com", 
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const protectedResources = {
  apiList: {
    endpoint: "https://fast-api-front.projectanddemoserver.com/api/todolist",
    scopes: {
      read: ["https://fabrikamb2c.onmicrosoft.com/TodoList/ToDoList.Read"],
      write: [
        "https://fabrikamb2c.onmicrosoft.com/TodoList/ToDoList.ReadWrite",
      ],
    },
  },
};

export const loginRequest = {
  scopes: [
    ...protectedResources.apiList.scopes.read,
    ...protectedResources.apiList.scopes.write,
  ],
};

