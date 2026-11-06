enum apiUrl {
  test = "http://192.168.1.10:59/V15", 
  uat = "http://localhost:3000",
  prod = "https://heyapi.heymobility.tech/V15", 
}

const appType = apiUrl.test;

const appConfig = {
  API_BASE_URL: appType,
  appType,
};

export { appConfig, apiUrl };
