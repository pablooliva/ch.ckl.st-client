import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AppStateService {
  private _clonePending: string;

  constructor() {}

  public setClonePending(cId: string): void {
    this._clonePending = cId;
  }

  public isClonePending(): boolean {
    return !!this._clonePending;
  }

  public unsetClonePending(): void {
    this._clonePending = null;
  }
}
