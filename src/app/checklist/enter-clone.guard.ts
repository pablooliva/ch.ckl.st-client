import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { DataPersistenceService } from "../shared/data-persistence.service";

@Injectable()
export class EnterCloneGuard implements CanActivate {
  constructor(private _dataPersistence: DataPersistenceService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._dataPersistence.hasChecklistDataClone();
  }
}
