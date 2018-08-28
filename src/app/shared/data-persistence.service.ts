import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

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

export interface IChecklistTagsEnabled {
  tag: boolean;
}

export interface IChecklistItem {
  label: string;
  checked: boolean;
  flexibleText: string;
  checklistTagsEnabled: IChecklistTagsEnabled[];
}

export interface ISection {
  title: string;
  flexibleText: string;
  checklistItems: IChecklistItem[];
}

// matches checklist.model/checklistSchema
export interface IClstDataModel {
  parentChecklist: string;
  owner: string;
  active: boolean;
  public: boolean;
  documentTitle: string;
  documentTags: string[] | INgxChips[];
  checklistTags: IChecklistItemTag[];
  customCss: string;
  sections: ISection[];
}

export interface IClstFormDataModel {
  public: boolean;
  documentTitle: string;
  documentTags: INgxChips[];
  customCss: string;
  sections: ISection[];
}

@Injectable({
  providedIn: "root"
})
export class DataPersistenceService {
  private _clDataModel: IClstDataModel;
  private _clDataModelClone: IClstDataModel;
  private _user: string;
  private _token: string;
  private _checklistId: string;

  public belongsToOwner: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

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

  constructor(private _router: Router) {}

  public prepChecklistDataClone(): void {
    this._clDataModelClone = <IClstDataModel>DataPersistenceService.deepClone(
      this._clDataModel
    );
    this._clDataModelClone.parentChecklist = this.checklistId;
  }

  public hasChecklistDataClone(): boolean {
    return !!this._clDataModelClone;
  }

  public applyChecklistDataClone(): void {
    this._clDataModelClone.documentTitle = "";
    this._clDataModelClone.owner = this.user;
    this._clDataModel = this._clDataModelClone;
    this._clDataModelClone = null;
  }

  public resetData(): void {
    this.checklistId = null;
    this._clDataModel = null;
    this.belongsToOwner.next(false);
  }

  public handleLogOut(): void {
    this.token = null;
    this.user = null;
    this.resetData();
  }

  public saveUse(source: IClstFormDataModel): { [key: string]: ISection[] } {
    const dest: IClstDataModel = this._clDataModel;

    dest.sections.forEach((section, sIdx) => {
      section.checklistItems.forEach((cItem, cIIdx) => {
        dest.sections[sIdx].checklistItems[cIIdx]["checked"] =
          source.sections[sIdx].checklistItems[cIIdx].checked;
      });
    });

    return { sections: dest.sections };
  }

  public prepareDBData(formValues: IClstFormDataModel): IClstDataModel {
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
    return <IClstDataModel>dataModelClone;
  }

  public async prepareClientData(
    checklistId: string,
    serverConnectService: ServerConnectService
  ): Promise<IClstFormDataModel> {
    this.checklistId = checklistId;

    if (this.hasChecklistDataClone() && this._router.url === "/clone") {
      this.applyChecklistDataClone();
    } else if (this._router.url.substring(0, 6) === "/anon/") {
      this._clDataModel = this.checklistId
        ? await this._getDBData(
            "anonchecklists",
            this.checklistId,
            serverConnectService
          )
        : null;
    } else {
      this._clDataModel = this.checklistId
        ? await this._getDBData(
            "checklists",
            this.checklistId,
            serverConnectService
          )
        : this._createDefaultModel();
    }

    if (this._clDataModel === null) {
      this.belongsToOwner.next(false);
      return Promise.resolve(null);
    }

    this.belongsToOwner.next(this.user === this._clDataModel.owner);

    return Promise.resolve({
      public: this._clDataModel.public,
      documentTitle: this._clDataModel.documentTitle,
      documentTags: <any>this._clDataModel.documentTags,
      checklistTags: this._clDataModel.checklistTags,
      customCss: this._clDataModel.customCss,
      sections: this._clDataModel.sections
    });
  }

  private _fromDBDocTags(arr: string[]): INgxChips[] {
    if (arr && arr.length) {
      return arr.map((itm: any) => {
        return { display: itm.label, value: itm._id };
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
    prePath: string,
    checklistId: string,
    serverConnectService: ServerConnectService
  ): Promise<IClstDataModel> {
    const path = prePath + "/" + checklistId;
    let checklist: IClstDataModel = <any>{};
    await serverConnectService
      .getChecklists(path)
      .then((response: IClstDataModel) => {
        if (!!response) {
          response.documentTags = this._fromDBDocTags(
            <any>response.documentTags
          );
        }
        return (checklist = response);
      });

    // invalid request will return checklist = null
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

export const deepClone = DataPersistenceService.deepClone;
