import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";

import {
  DataPersistenceService,
  IChecklistItemTag
} from "./data-persistence.service";

export interface ISyncTagsObs {
  tags: IChecklistItemTag[];
  index?: number;
}

@Injectable()
export class ChecklistItemTagsSyncService {
  private readonly _tagsStoreObs: BehaviorSubject<ISyncTagsObs>;

  constructor(private _dataPersistence: DataPersistenceService) {
    this._tagsStoreObs = new BehaviorSubject<ISyncTagsObs>({
      tags: this._dataPersistence.getChecklistTags()
    });
  }

  public refreshTags(): void {
    this._tagsStoreObs.next({
      tags: this._dataPersistence.getChecklistTags()
    });
  }

  public observeTags(): Subject<ISyncTagsObs> {
    return this._tagsStoreObs;
  }

  public addTag(tag: IChecklistItemTag): boolean {
    if (
      tag.label.trim().length === 0 ||
      this._dataPersistence
        .getChecklistTags()
        .find(item => item.label === tag.label)
    ) {
      return false;
    }
    this._tagsStoreObs.next({
      tags: this._dataPersistence.addChecklistTag(tag)
    });
    return true;
  }

  public updateTag(tag: IChecklistItemTag, index: number): boolean {
    if (
      tag.label.trim().length === 0 ||
      this._dataPersistence
        .getChecklistTags()
        .find((item, idx) => item.label === tag.label && idx !== index)
    ) {
      return false;
    }
    this._tagsStoreObs.next({
      tags: this._dataPersistence.updateChecklistTag(tag, index)
    });
    return true;
  }

  public deleteTag(index: number): boolean {
    this._tagsStoreObs.next({
      tags: this._dataPersistence.deleteChecklistTag(index),
      index: index
    });
    return true;
  }
}
