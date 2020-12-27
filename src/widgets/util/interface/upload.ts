export interface Options {
    host: string;
    port: number;
    user: string;
    password: string;
    type: string
  }
  
  export type remoteSystemType = 'ftp' | 'sftp';

  export interface Status {
    code: number;
    msg?: string;
    error?: string;
    data?: any
}
  