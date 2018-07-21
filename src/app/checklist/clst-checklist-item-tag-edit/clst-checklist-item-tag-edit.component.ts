import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";

import { DataPersistenceService } from "../../shared/data-persistence.service";
import { ChecklistItemTagsSyncService } from "../../shared/checklist-item-tags-sync.service";
import { genericValidationTest } from "../../shared/clst-utils";
import { UniqueLabel } from "./clst-checklist-item-tag.validator";
import { materialIconsNames } from "./material-icons-names";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "clst-checklist-item-tag-edit",
  templateUrl: "./clst-checklist-item-tag-edit.component.html",
  styleUrls: ["./clst-checklist-item-tag-edit.component.scss"]
})
export class ClstChecklistItemTagEditComponent implements OnInit, OnDestroy {
  @Input() public checklistItem: FormGroup;
  @Output() tagAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tagForm: FormGroup;
  public colorPicked: string;
  public defaultColor: string;
  public buttonReset: Subject<boolean> = new Subject<boolean>();
  public options: string[];
  public filteredOptions: Observable<string[]>;
  public labelPicked: string;
  public iconPicked: string;

  private _destroy: Subject<boolean> = new Subject<boolean>();

  private static _validColor(testColor: string): boolean {
    let valid = true;
    testColor = testColor.trim();
    if (!testColor.length || testColor.length < 4) {
      valid = false;
    }
    return valid;
  }

  constructor(
    private _fb: FormBuilder,
    private _syncTags: ChecklistItemTagsSyncService,
    private _dataPersistence: DataPersistenceService
  ) {}

  public ngOnInit(): void {
    this.defaultColor = "#fff";
    this.colorPicked = this.defaultColor;
    this.labelPicked = "Preview";
    this.options = materialIconsNames;

    this.tagForm = this._fb.group({
      label: [
        "",
        Validators.compose([Validators.required, UniqueLabel.bind(this)])
      ],
      color: this.colorPicked,
      icon: ""
    });

    this.filteredOptions = this.tagForm
      .get("icon")
      .valueChanges.pipe(
        startWith(""),
        map(value => value && this._filter(value))
      );

    this.tagForm
      .get("label")
      .valueChanges.subscribe(val => (this.labelPicked = val));

    this.tagForm.get("icon").valueChanges.subscribe(val => this.iconPicked = val);
  }

  public ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.complete();
  }

  public reset(): Observable<boolean> {
    return this.buttonReset;
  }

  public cancel(): void {
    this.tagForm.reset();
    this.tagAdded.emit(true);
  }

  public onBlur(): void {
    let val = this.tagForm.get("color").value;
    if (!ClstChecklistItemTagEditComponent._validColor(val)) {
      val = this.defaultColor;
      this.tagForm.get("color").setValue(val);
    }
    this.colorPicked = val;
  }

  public onColorChange(color: string): void {
    this.colorPicked = color;
    this.tagForm.get("color").setValue(color);
  }

  public onSubmit(): void {
    if (this._syncTags.addTag(this.tagForm.value)) {
      this.tagAdded.emit(true);
    } else {
      console.error("Tag was not added!");
    }
  }

  public testReq(formField: string): boolean {
    return genericValidationTest(this.tagForm, formField, "required");
  }

  public testUnique(formField: string): boolean {
    return genericValidationTest(this.tagForm, formField, "uniqueLabel");
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
