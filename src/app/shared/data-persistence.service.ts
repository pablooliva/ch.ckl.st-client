import { Injectable } from "@angular/core";

import { ServerConnectService } from "./server-connect.service";

@Injectable()
export class DataPersistence {
  constructor(private _serverConnectService: ServerConnectService) {}

  static deepClone(objRef: Object): Object {
    // Object.assign() performs only a shallow copy
    return JSON.parse(JSON.stringify(objRef));
  }

  static isEmpty(value: any): boolean {
    return value === "" || value === null || value === undefined;
  }

  public prepareData(data: Object): Object {
    const valuesClone = DataPersistence.deepClone(data);
    this._removeEmptyGroups("sections", valuesClone);
    this._includeUser(valuesClone);
    return valuesClone;
  }

  private _includeUser(data: Object): void {
    data["owner"] = this._serverConnectService.getUser();
  }

  private _removeEmptyGroups(property: string, objRef: Object): void {
    if (!Array.isArray(objRef[property])) {
      console.error(
        "We expected an array for this property, but we received: ",
        [objRef, property]
      );
    } else {
      let hasValue = false;
      objRef[property].forEach(obj => {
        Object.keys(obj).forEach(key => {
          if (Array.isArray(obj[key])) {
            this._removeEmptyGroups(key, obj);
            if (obj.hasOwnProperty(key)) {
              hasValue = true;
            }
          } else {
            if (!hasValue) {
              hasValue = !DataPersistence.isEmpty(obj[key]);
            }
          }
        });
      });
      if (!hasValue) {
        delete objRef[property];
      }
    }
  }
}
