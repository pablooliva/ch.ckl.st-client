import { Injectable } from "@angular/core";
import { ServerConnectService } from "./server-connect.service";

// format used by ngx-chips
export interface INgxChips {
  display: string;
  value: string;
}

export interface IChecklistItemTag {
  label: string;
  color: string;
  icon: string;
}

// matches checklist.model/checklistSchema
export interface IClstDataModel {
  parentChecklist: string;
  owner: string;
  active: boolean;
  public: boolean;
  documentTitle: string;
  documentTags: string[];
  checklistTags: IChecklistItemTag[];
  customCss: string;
  sections: object[];
}

export interface IClstFormDataModel {
  public: boolean;
  documentTitle: string;
  documentTags: INgxChips[];
  customCss: string;
  sections: object[];
}

@Injectable()
export class DataPersistenceService {
  private _clDataModel: IClstDataModel;
  private _user: string;
  private _token: string;
  private _checklistId: string;

  public set user(uId: string) {
    this._user = uId;
  }

  public get user(): string {
    return this._user;
  }

  public set token(token: string) {
    this._token = token;
  }

  public get token(): string {
    return this._token;
  }

  public get checklistId(): string {
    return this._checklistId;
  }

  public set checklistId(id: string) {
    this._checklistId = id;
  }

  static deepClone(objRef: Object): Object {
    // Object.assign() performs only a shallow copy
    return JSON.parse(JSON.stringify(objRef));
  }

  static isEmpty(value: any): boolean {
    return value === "" || value === null || value === undefined;
  }

  constructor() {}

  public handleLogOut(): void {
    this.token = null;
    this.user = null;
    this.checklistId = null;
    this._clDataModel = null;
  }

  public prepareDBData(formValues: IClstFormDataModel): Object {
    const formValuesClone = <IClstFormDataModel>DataPersistenceService.deepClone(
      formValues
    );
    formValuesClone.documentTags = <any[]>this._toDBDocTags(
      formValuesClone.documentTags
    );
    this._removeEmptyGroups("sections", formValuesClone);
    this._clDataModel = <any>{ ...this._clDataModel, ...formValuesClone };
    const dataModelClone = DataPersistenceService.deepClone(this._clDataModel);
    this._removeEmptyProperties(dataModelClone);
    return dataModelClone;
  }

  public async prepareClientData(
    checklistId: string,
    serverConnectService: ServerConnectService
  ): Promise<IClstFormDataModel> {
    this.checklistId = checklistId;
    this._clDataModel = checklistId
      ? await this._getDBData(checklistId, serverConnectService)
      : this._createDefaultModel();

    return Promise.resolve({
      public: this._clDataModel.public,
      documentTitle: this._clDataModel.documentTitle,
      documentTags: <any>this._clDataModel.documentTags,
      customCss: this._clDataModel.customCss,
      sections: this._clDataModel.sections
    });
  }

  private _fromDBDocTags(arr: string[]): INgxChips[] {
    if (arr && arr.length) {
      return arr.map(itm => {
        return { display: itm, value: itm };
      });
    } else {
      return [];
    }
  }

  private _toDBDocTags(tags: INgxChips[]): string[] {
    if (tags && tags.length) {
      return tags.map(itm => itm.value);
    } else {
      return null;
    }
  }

  public addChecklistTag(tag: IChecklistItemTag): IChecklistItemTag[] {
    this._clDataModel.checklistTags.push(tag);
    return this._clDataModel.checklistTags;
  }

  public updateChecklistTag(
    tag: IChecklistItemTag,
    index: number
  ): IChecklistItemTag[] {
    this._clDataModel.checklistTags[index] = tag;
    return this._clDataModel.checklistTags;
  }

  public deleteChecklistTag(index: number): IChecklistItemTag[] {
    this._clDataModel.checklistTags.splice(index, 1);
    return this._clDataModel.checklistTags;
  }

  public getChecklistTags(): IChecklistItemTag[] {
    return this._clDataModel.checklistTags;
  }

  private async _getDBData(
    checklistId: string,
    serverConnectService: ServerConnectService
  ): Promise<IClstDataModel> {
    const path = "checklists/" + checklistId;
    let checklist: IClstDataModel;
    await serverConnectService
      .getChecklists(path)
      .then(response => (checklist = <IClstDataModel>response));
    return Promise.resolve(checklist);
  }

  private _createDefaultModel(): IClstDataModel {
    return {
      parentChecklist: "",
      owner: this.user,
      active: true,
      public: true,
      documentTitle: "",
      documentTags: [],
      checklistTags: [],
      customCss: "",
      sections: []
    };
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
              hasValue = !DataPersistenceService.isEmpty(obj[key]);
            }
          }
        });
      });
      if (!hasValue) {
        delete objRef[property];
      }
    }
  }

  private _removeEmptyProperties(objRef: Object) {
    // Properties in an empty state that are problematic for the DB
    // to deal with
    const propertiesToTest = [
      // Cast to ObjectID failed for value ""
      "parentChecklist",
      // Cast to Array failed for value ""
      "documentTags"
    ];

    propertiesToTest.forEach(prop => {
      if (DataPersistenceService.isEmpty(objRef[prop])) {
        delete objRef[prop];
      }
    });
  }
}
