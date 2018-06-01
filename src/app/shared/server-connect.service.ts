import { Injectable, isDevMode } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError as observableThrowError, Observable, pipe } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { StatusType, HttpReqStatus } from "./status-types";

@Injectable()
export class ServerConnectService {
  private _token: string;
  private _user: string;
  private readonly _serverBaseLoc: string;

  constructor(private _http: HttpClient) {
    this._serverBaseLoc = isDevMode()
      ? "http://127.0.0.1:3000"
      : "https://ch.ckl.st";
  }

  public registerUser(
    path: string,
    body: string,
    httpOptions: any
  ): Observable<HttpReqStatus> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);

    return this._http
      .post<HttpReqStatus>(fullUrlPath.toString(), body, httpOptions)
      .pipe(
        map((response: any) => {
          return {
            type: StatusType.Success,
            uiMessage: "You have registered successfully. You may now log in.",
            serverResponse: response
          };
        }),
        catchError((error: any) => {
          return observableThrowError({
            type: StatusType.Error,
            uiMessage: "Something went wrong. Please try again.",
            serverResponse: error
          });
        })
      );
  }

  public loginUser(
    path: string,
    body: string,
    httpOptions: any
  ): Observable<HttpReqStatus> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);

    return this._http
      .post<HttpReqStatus>(fullUrlPath.toString(), body, httpOptions)
      .pipe(
        map((response: any) => {
          this._token = response.token;
          this._user = response.user;
          return {
            type: StatusType.Success,
            uiMessage: "You are now logged in.",
            serverResponse: response
          };
        }),
        catchError((error: any) => {
          return observableThrowError({
            type: StatusType.Error,
            uiMessage: "Something went wrong. Please try again.",
            serverResponse: error
          });
        })
      );
  }

  public postChecklist(
    path: string,
    body: string,
    httpOptions: any
  ): Observable<HttpReqStatus> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);

    return this._http
      .post<HttpReqStatus>(fullUrlPath.toString(), body, httpOptions)
      .pipe(
        map((response: any) => {
          return {
            type: StatusType.Success,
            uiMessage: "Checklist saved successfully.",
            serverResponse: response
          };
        }),
        catchError((error: any) => {
          return observableThrowError({
            type: StatusType.Error,
            uiMessage: "Something went wrong. Please try again.",
            serverResponse: error
          });
        })
      );
  }

  public getToken(): string {
    return this._token;
  }

  public getUser(): string {
    return this._user;
  }
}
