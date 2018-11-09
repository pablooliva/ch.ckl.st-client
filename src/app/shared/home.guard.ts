import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";

import { DataPersistenceService } from "./data-persistence.service";

@Injectable({
  providedIn: "root"
})
export class HomeGuard implements CanActivate {
  constructor(private _dataPersistence: DataPersistenceService, private _router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!!(this._dataPersistence.token && this._dataPersistence.user)) {
      this._router.navigate(["/dashboard"]);
    } else {
      return true;
    }
  }
}
