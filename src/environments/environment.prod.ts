// ng build --prod  or add argument --environment=prod
// ng serve --prod
export const environment = {
  production: true,
  authUrl: `https://${location.host}:5443/api`,
  greenhouseUrl: `https://${location.host}:6443/api`,
  sensorHubUrl: `https://${location.host}:6443/SensorHub`,
  raspGpioUrl: `http://${location.host}:3000/gpio`,
  raspPwmUrl: `http://${location.host}:3000/pwm`,
  appId: 0,
};
