// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

//"ng build" or "ng serve" only
export const environment = {
  production: false,
  ApiUrl_Auth: 'http://192.168.1.170/FarmerAPI/api/',
  ApiUrl_Farmer: 'http://192.168.1.170/FarmerAPI/api/',
  ApiUrl_WebSocket: 'http://192.168.1.170/FarmerAPI/',
  ApiUrl_RaspGpio: 'http://192.168.1.150:3000/gpio/',
  AppID: 0,
};
