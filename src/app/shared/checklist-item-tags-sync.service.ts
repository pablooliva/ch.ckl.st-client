import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

export interface IChecklistItemTag {
  label: string;
  color: string;
  icon: string;
}

@Injectable()
export class ChecklistItemTagsSyncService {
  private _tagsStoreObs: BehaviorSubject<IChecklistItemTag[]>;
  private _tagsStore: IChecklistItemTag[];

  constructor() {
    this._tagsStore = [];
    this._tagsStoreObs = new BehaviorSubject<IChecklistItemTag[]>(
      this._tagsStore
    );
  }

  public observeTags(): Subject<IChecklistItemTag[]> {
    return this._tagsStoreObs;
  }

  public addTag(tag: IChecklistItemTag): void {
    this._tagsStore.push(tag);
    this._tagsStoreObs.next(this._tagsStore);
  }
}
