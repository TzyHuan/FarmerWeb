// ng build --prod  or add argument --environment=prod
// ng serve --prod
export const environment = {
  production: true,
  authUrl: `https://192.168.43.215:5443/api`,
  greenhouseUrl: `https://192.168.43.215:6443/api`,
  sensorHubUrl: `https://192.168.43.215:6443/SensorHub`,
  raspGpioUrl: `https://192.168.43.215:3443/gpio`,
  raspPwmUrl: `https://192.168.43.215:3443/pwm`,
  appId: 0,
};
