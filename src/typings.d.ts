/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

//can read import json files as module
declare module "*.json" {
  const value: any;
  export default value;
}

//can read import png files as module
declare module "*.png" {
  const value: any;
  export default value;
}