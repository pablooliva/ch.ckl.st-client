import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

/*
 This service is used to communicate from router-outlet injected Components up to
 the clst-root, since @Output binding is not an option
 */

@Injectable({
  providedIn: "root"
})
export class RootListenerService {
  public changeEmitted: Observable<any>;

  private _emitChange = new Subject<any>();

  constructor() {
    this.changeEmitted = this._emitChange.asObservable();
  }

  public updateHeight(height: number) {
    this._emitChange.next(height);
  }
}
