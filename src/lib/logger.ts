export class Logger {
    private context: string;
  
    constructor(context: string) {
      this.context = context;
    }
  
    log(message: string, ...optionalParams: any[]) {
      console.log(`[LOG] [${this.context}] ${new Date().toISOString()} - ${message}`, ...optionalParams);
    }
  
    error(message: string, trace?: string | any, ...optionalParams: any[]) {
      console.error(`[ERROR] [${this.context}] ${new Date().toISOString()} - ${message}`, trace, ...optionalParams);
    }
  
    warn(message: string, ...optionalParams: any[]) {
      console.warn(`[WARN] [${this.context}] ${new Date().toISOString()} - ${message}`, ...optionalParams);
    }
  
    debug(message: string, ...optionalParams: any[]) {
      console.debug(`[DEBUG] [${this.context}] ${new Date().toISOString()} - ${message}`, ...optionalParams);
    }
  
    verbose(message: string, ...optionalParams: any[]) {
      console.info(`[VERBOSE] [${this.context}] ${new Date().toISOString()} - ${message}`, ...optionalParams);
    }
  }
  