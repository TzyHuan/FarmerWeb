// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

//"ng build" or "ng serve" only
export const environment = {
  production: false,
  authUrl: 'http://localhost/SystemAuth/api',
  greenhouseUrl: 'http://localhost/FarmerAPI/api',
  sensorHubUrl: 'http://localhost/FarmerAPI/SensorHub',
  raspGpioUrl: 'http://192.168.43.120:3000/gpio',
  raspPwmUrl: 'http://192.168.43.120:3000/pwm',
  appId: 0,
};
