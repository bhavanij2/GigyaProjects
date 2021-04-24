declare module NodeJS {
  interface Global {
    authToken: string;
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '@monsantoit/velocity-service-bindings';
