import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { DataPersistenceService } from "../shared/data-persistence.service";
import { AppStateService } from "../shared/app-state.service";

@Injectable({
  providedIn: "root"
})
export class EnterCloneGuard implements CanActivate {
  constructor(
    private _dataPersistence: DataPersistenceService,
    private _appStateService: AppStateService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this._appStateService.isClonePending()) {
      this._appStateService.unsetClonePending();
    }
    return this._dataPersistence.hasChecklistDataClone();
  }
}
