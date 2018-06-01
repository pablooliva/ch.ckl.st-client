import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { ServerConnectService } from "./server-connect.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private _serverConnectService: ServerConnectService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req.headers.append("Authorization", this._serverConnectService.getToken());
    return next.handle(req);
  }
}
