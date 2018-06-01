export enum StatusType {
  Info = "Info",
  Error = "Error",
  Success = "Success"
}

export interface HttpReqStatus {
  type: StatusType;
  uiMessage: string;
  serverResponse?: any;
}
