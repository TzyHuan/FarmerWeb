/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

//can read import json files
declare module "*.json" {
  const value: any;
  export default value;
}