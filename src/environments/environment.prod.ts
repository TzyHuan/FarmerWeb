// ng build --prod  or add argument --environment=prod
// ng serve --prod
export const environment = {
  production: true,
  authUrl: `http://${location.host}:4064/api`,
  greenhouseUrl: `http://${location.host}:4066/api`,
  sensorHubUrl: `http://${location.host}:4066/SensorHub`,
  raspGpioUrl: `http://${location.host}:3000/gpio`,
  raspPwmUrl: `http://${location.host}:3000/pwm`,
  appId: 0,
};
