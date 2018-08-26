import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AppStateService {
  private _usePending: string;

  constructor() {}

  public setUsePending(cId: string): void {
    this._usePending = cId;
  }

  public getUsePending(): string {
    return this._usePending;
  }

  public unsetUsePending(): void {
    this._usePending = null;
  }
}
