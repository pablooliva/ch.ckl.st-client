import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanDeactivate
} from "@angular/router";
import { Observable } from "rxjs";

import { DataPersistenceService } from "../shared/data-persistence.service";
import { ClstFormComponent } from "./clst-form/clst-form.component";

@Injectable()
export class LeaveChecklistGuard implements CanDeactivate<ClstFormComponent> {
  constructor(private _dataPersistence: DataPersistenceService) {}

  canDeactivate(
    component: ClstFormComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this._dataPersistence.resetData();
    return true;
  }
}
