// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// "ng build" or "ng serve" only
export const environment = {
  production: false,
  authUrl: `https://${location.host}/SystemAuth/api`,
  greenhouseUrl: `https://${location.host}/FarmerAPI/api`,
  sensorHubUrl: `https://${location.host}/FarmerAPI/SensorHub`,
  raspGpioUrl: `http://${location.host}:3000/gpio`,
  raspPwmUrl: `http://${location.host}:3000/pwm`,
  appId: 0,
};
