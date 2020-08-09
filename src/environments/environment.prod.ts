// ng build --prod  or add argument --environment=prod
// ng serve --prod
export const environment = {
  production: true,
  authUrl: location.protocol === 'http:' ? `http://192.168.43.215:5080/api` : `https://192.168.43.215:5443/api`,
  greenhouseUrl: location.protocol === 'http:' ? `http://192.168.43.215:6080/api` : `https://192.168.43.215:6443/api`,
  sensorHubUrl: location.protocol === 'http:' ? `http://192.168.43.215:6080/SensorHub` : `https://192.168.43.215:6443/SensorHub`,
  raspGpioUrl: location.protocol === 'http:' ? `http://192.168.43.215:3080/gpio` : `https://192.168.43.215:3443/gpio`,
  raspPwmUrl: location.protocol === 'http:' ? `http://192.168.43.215:3080/pwm` : `https://192.168.43.215:3443/pwm`,
  videoUrl: location.protocol === 'http:' ? 'http://192.168.43.215/hls/test.m3u8' : 'https://192.168.43.215/hls/test.m3u8',
  appId: 0,
};
