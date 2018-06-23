import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { DataPersistenceService } from "./data-persistence.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private _dataPersistence: DataPersistenceService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req.headers.append("Authorization", this._dataPersistence.token);
    return next.handle(req);
  }
}
