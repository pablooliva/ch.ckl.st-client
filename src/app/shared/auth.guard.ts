import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

import { DataPersistenceService } from "./data-persistence.service";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _dataPersistence: DataPersistenceService,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!!(this._dataPersistence.token && this._dataPersistence.user)) {
      return true;
    } else {
      this._toastr.error(
        "Please log in to access that resource.",
        "Access Denied"
      );
      this._router.navigate(["/"]);
    }
  }
}
