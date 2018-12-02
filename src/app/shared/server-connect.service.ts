import { Injectable, isDevMode } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError as observableThrowError, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { StatusType, HttpReqStatus } from "./status-types";
import { DataPersistenceService } from "./data-persistence.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class ServerConnectService {
  private readonly _serverBaseLoc: string;

  constructor(
    private _http: HttpClient,
    private _dataPersistence: DataPersistenceService,
    private _authService: AuthService
  ) {
    this._serverBaseLoc = isDevMode() ? "http://127.0.0.1:3000" : "http://ch.ckl.st:3000";
  }

  public registerUser(path: string, body: string, httpOptions: any): Observable<HttpReqStatus> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);

    return this._http.post<HttpReqStatus>(fullUrlPath.toString(), body, httpOptions).pipe(
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
          uiMessage: error.error.msg ? error.error.msg : "Something went wrong. Please try again.",
          serverResponse: error
        });
      })
    );
  }

  public loginUser(path: string, body: string, httpOptions: any): Observable<HttpReqStatus> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);

    return this._http.post<HttpReqStatus>(fullUrlPath.toString(), body, httpOptions).pipe(
      map((response: any) => {
        this._authService.setLogIn(response.token, response.user);
        return {
          type: StatusType.Success,
          uiMessage: "You are now logged in.",
          serverResponse: response
        };
      }),
      catchError((error: any) => {
        return observableThrowError({
          type: StatusType.Error,
          uiMessage: error.error.msg ? error.error.msg : "Something went wrong. Please try again.",
          serverResponse: error
        });
      })
    );
  }

  public getChecklists(path: string): Promise<Object> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);
    return this._http.get(fullUrlPath.toString()).toPromise();
  }

  public postChecklist(path: string, body: string, httpOptions: any): Observable<HttpReqStatus> {
    let fullUrlPath = new URL(path, this._serverBaseLoc);

    if (this._dataPersistence.checklistId) {
      const putPath = path + "/" + this._dataPersistence.checklistId;
      fullUrlPath = new URL(putPath, this._serverBaseLoc);
      return this._http.put<HttpReqStatus>(fullUrlPath.toString(), body, httpOptions).pipe(
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

    return this._http.post<HttpReqStatus>(fullUrlPath.toString(), body, httpOptions).pipe(
      map((response: any) => {
        this._dataPersistence.checklistId = response.checklistId;
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

  public deleteChecklist(path: string): Observable<HttpReqStatus> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);

    return this._http.delete<HttpReqStatus>(fullUrlPath.toString()).pipe(
      map((response: any) => {
        return {
          type: StatusType.Success,
          uiMessage: "Checklist has been deleted successfully.",
          serverResponse: response
        };
      }),
      catchError((error: any) => {
        return observableThrowError({
          type: StatusType.Error,
          uiMessage: error.error.msg ? error.error.msg : "Something went wrong. Please try again.",
          serverResponse: error
        });
      })
    );
  }

  public useCopy(path: string, body: string, httpOptions: any): Observable<HttpReqStatus> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);

    return this._http.post<HttpReqStatus>(fullUrlPath.toString(), body, httpOptions).pipe(
      map((response: any) => {
        return {
          type: StatusType.Success,
          uiMessage: "Checklist has been copied successfully.",
          serverResponse: response
        };
      }),
      catchError((error: any) => {
        return observableThrowError({
          type: StatusType.Error,
          uiMessage: error.error.msg ? error.error.msg : "Something went wrong. Please try again.",
          serverResponse: error
        });
      })
    );
  }

  public queryDocTags(path: string): Promise<Object> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);
    return this._http.get(fullUrlPath.toString()).toPromise();
  }

  public postDocTag(path: string, body: string, httpOptions: any): Promise<any> {
    const fullUrlPath = new URL(path, this._serverBaseLoc);
    return this._http.post<any>(fullUrlPath.toString(), body, httpOptions).toPromise();
  }
}
