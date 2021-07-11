// ng build --prod  or add argument --environment=prod
// ng serve --prod
export const environment = {
  production: true,
  authUrl: location.protocol === 'http:' ? `http://richard-greenhouse.local:5080/api` : `https://richard-greenhouse.local:5443/api`,
  greenhouseUrl: location.protocol === 'http:' ? `http://richard-greenhouse.local:6080/api` : `https://richard-greenhouse.local:6443/api`,
  sensorHubUrl: location.protocol === 'http:' ? `http://richard-greenhouse.local:6080/SensorHub` : `https://richard-greenhouse.local:6443/SensorHub`,
  raspGpioUrl: location.protocol === 'http:' ? `http://richard-greenhouse.local:3080/gpio` : `https://richard-greenhouse.local:3443/gpio`,
  raspPwmUrl: location.protocol === 'http:' ? `http://richard-greenhouse.local:3080/pwm` : `https://richard-greenhouse.local:3443/pwm`,
  videoUrl: location.protocol === 'http:' ? 'http://richard-greenhouse.local/hls/test.m3u8' : 'https://richard-greenhouse.local/hls/test.m3u8',
  appId: 0,
};
