import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

import {
  DataPersistenceService,
  IChecklistItemTag
} from "./data-persistence.service";

@Injectable()
export class ChecklistItemTagsSyncService {
  private _tagsStoreObs: BehaviorSubject<IChecklistItemTag[]>;

  constructor(private _dataPersistence: DataPersistenceService) {
    this._tagsStoreObs = new BehaviorSubject<IChecklistItemTag[]>(
      this._dataPersistence.getChecklistTags()
    );
  }

  public observeTags(): Subject<IChecklistItemTag[]> {
    return this._tagsStoreObs;
  }

  public addTag(tag: IChecklistItemTag): boolean {
    if (
      this._dataPersistence
        .getChecklistTags()
        .find(item => item.label === tag.label)
    ) {
      return false;
    }
    this._tagsStoreObs.next(this._dataPersistence.addChecklistTag(tag));
    return true;
  }
}
