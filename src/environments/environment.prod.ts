//ng build --prod  or add argument --environment=prod
//ng serve --prod
export const environment = {
  production: true,
  authUrl: 'http://192.168.43.120:4064/api',
  greenhouseUrl: 'http://192.168.43.120:4066/api',
  sensorHubUrl: 'http://192.168.43.120:4066/SensorHub',
  raspGpioUrl: 'http://192.168.43.120:3000/gpio',
  raspPwmUrl: 'http://192.168.43.120:3000/pwm',
  appId: 0,
};
