import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

import { DataPersistenceService } from "./data-persistence.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
  public isLoggedIn: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(
    private _dataPersistence: DataPersistenceService,
    private _router: Router
  ) {
    this.isLoggedIn.next(false);
  }

  public setLogIn(token: string, user: string): void {
    this._dataPersistence.token = token;
    this._dataPersistence.user = user;
    this.isLoggedIn.next(true);
  }

  public setLogOut(): void {
    this._dataPersistence.handleLogOut();
    this.isLoggedIn.next(false);
    this._router.navigate(["/home"]);
  }
}
