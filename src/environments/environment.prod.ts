//ng build --prod  or add argument --environment=prod
//ng serve --prod
export const environment = {
  production: true,  
  ApiUrl_Auth: 'http://192.168.1.170/SystemAuth/api/',
  ApiUrl_Farmer: 'http://192.168.1.170/FarmerAPI/api/',
  ApiUrl_WebSocket: 'http://192.168.1.170/FarmerAPI/',
  ApiUrl_RaspGpio: 'http://192.168.1.150:3000/gpio/',
  AppID: 0,
};
