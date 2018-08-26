import { Injectable } from "@angular/core";

import { ServerConnectService } from "./server-connect.service";
import { HttpHeaders } from "@angular/common/http";
import { DataPersistenceService, INgxChips } from "./data-persistence.service";

interface IDocTagResponse {
  label?: string;
  id?: string;
  noResult?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class DocTagService {
  constructor(
    private _serverConnectService: ServerConnectService,
    private _dataPersistence: DataPersistenceService
  ) {}

  public getId(tag: INgxChips): Promise<INgxChips> {
    const tagDisplay = tag.display.toLowerCase();
    const tagPath = "tags/" + tagDisplay;
    return this._serverConnectService
      .queryDocTags(tagPath)
      .then((response: IDocTagResponse) => {
        if (response.noResult) {
          return this.addDocTag(tagDisplay);
        } else {
          return {
            display: response.label,
            value: response.id
          };
        }
      })
      .catch((error: any) => {
        console.error("error", error);
      });
  }

  public addDocTag(tagLabel: string): Promise<any> {
    const tagPath = "tags";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    const body = JSON.stringify({
      owner: this._dataPersistence.user,
      label: tagLabel
    });

    return this._serverConnectService
      .postDocTag(tagPath, body, httpOptions)
      .then((response: IDocTagResponse) => {
        return {
          display: response.label,
          value: response.id
        };
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
