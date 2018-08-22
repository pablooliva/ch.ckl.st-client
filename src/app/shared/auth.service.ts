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

    const localToken = localStorage.getItem("tkn");
    const localUser = localStorage.getItem("usr");

    // TODO: check if Token is expired
    // With a simple call to the backend?

    if (localToken && localUser) {
      this._dataPersistence.token = localToken;
      this._dataPersistence.user = localUser;
      this.isLoggedIn.next(true);
    }
  }

  public setLogIn(token: string, user: string): void {
    this._clearLocal();

    this._dataPersistence.token = token;
    this._dataPersistence.user = user;

    localStorage.setItem("tkn", token);
    localStorage.setItem("usr", user);

    this.isLoggedIn.next(true);
  }

  public setLogOut(): void {
    this._clearLocal();
    this._dataPersistence.handleLogOut();
    this.isLoggedIn.next(false);
    this._router.navigate(["/home"]);
  }

  private _clearLocal(): void {
    localStorage.clear();
  }
}
