// single-file-components
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

// json
declare module '*.json' {
  const value: any;
  export default value;
}

// process.env which is substituted by webpack
interface ProcessEnv {
  [key: string]: string | undefined;
}
interface Process {
  env: ProcessEnv;
}
declare var process: Process;

declare module '@monsantoit/phoenix-navbar';
declare module '@monsantoit/profile-client';
declare module '@monsantoit/element-vue';
declare module 'deline';
declare module 'vuelidate';
declare module 'vuelidate/lib/validators';

declare global {
  interface Window {
    phoenix: any;
  }
}

window.phoenix = window.phoenix || {};
