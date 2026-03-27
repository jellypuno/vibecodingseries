export class Session {
  constructor(options: any) {
    this.type = options.type;
    this.hostname = options.hostname;
    this.port = options.port;
    this.user = options.user;
    this.password = options.password;
    this.rejectUnauthorized = options.rejectUnauthorized;
  }

  type: string;
  hostname: string;
  port: number;
  user: string;
  password: string;
  rejectUnauthorized: boolean;
}

export const ImperativeError = class ImperativeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImperativeError';
  }
  mDetails?: {
    errorCode?: string;
  };
};
