import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { DataPersistenceService } from "../../../shared/data-persistence.service";
import { ChecklistItemTagsSyncService } from "../../../shared/checklist-item-tags-sync.service";
import { genericValidationTest } from "../../../shared/clst-utils";
import { UniqueLabel, ValidMatIcon } from "./clst-checklist-item-tag.validator";
import { materialIconsNames } from "./material-icons-names";
import { ITagInfo } from "../clst-checklist-item/clst-checklist-item.component";

@Component({
  selector: "clst-checklist-item-tag-edit",
  templateUrl: "./clst-checklist-item-tag-edit.component.html",
  styleUrls: ["./clst-checklist-item-tag-edit.component.scss"]
})
export class ClstChecklistItemTagEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  public checklistItem: FormGroup;
  @Input()
  tagProps: ITagInfo;
  @Output()
  tagAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    testColor = testColor && testColor.trim();
    if (testColor === null || !testColor.length || testColor.length < 4) {
      valid = false;
    }
    return valid;
  }

  constructor(
    private _fb: FormBuilder,
    private _syncTags: ChecklistItemTagsSyncService,
    private _dataPersistence: DataPersistenceService
  ) {
    this.defaultColor = "#000";
  }

  public ngOnInit(): void {
    this.colorPicked = this.tagProps ? this.tagProps.tag.color : this.defaultColor;
    this.labelPicked = this.tagProps ? this.tagProps.tag.label : "Preview";
    this.iconPicked = this.tagProps ? this.tagProps.tag.icon : "";
    this.options = materialIconsNames;

    this.filteredOptions = this.tagForm.get("icon").valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );

    this.tagForm.get("label").valueChanges.subscribe(val => (this.labelPicked = val));

    this.tagForm.get("icon").valueChanges.subscribe(val => (this.iconPicked = val));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.tagForm) {
      this._initForm();
    }

    if (changes.tagProps.currentValue) {
      this.colorPicked = this.tagProps.tag.color;
      this.labelPicked = this.tagProps.tag.label;
      this.iconPicked = this.tagProps.tag.icon;
      this.tagForm.setValue({
        label: this.tagProps.tag.label,
        color: this.tagProps.tag.color,
        icon: this.tagProps.tag.icon
      });
    }
  }

  private _initForm(): void {
    this.tagForm = this._fb.group({
      label: ["", Validators.compose([Validators.required, UniqueLabel.bind(this)])],
      color: this.defaultColor,
      icon: ["", ValidMatIcon.bind(this)]
    });
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
    if (this.tagProps && this.tagProps.delete && this._syncTags.deleteTag(this.tagProps.index)) {
      this._completeSubmit();
    } else if (this.tagProps && this._syncTags.updateTag(this.tagForm.value, this.tagProps.index)) {
      this._completeSubmit();
    } else if (this._syncTags.addTag(this.tagForm.value)) {
      this._completeSubmit();
    } else {
      console.error("Tag updated/addition did not complete!");
    }
  }

  private _completeSubmit(): void {
    this.tagAdded.emit(true);
    this.tagForm.reset();
  }

  public testReq(formField: string): boolean {
    return genericValidationTest(this.tagForm, formField, "required");
  }

  public testUnique(formField: string): boolean {
    return genericValidationTest(this.tagForm, formField, "uniqueLabel");
  }

  public testIcon(formField: string): boolean {
    return genericValidationTest(this.tagForm, formField, "validMatIcon");
  }

  private _filter(value: string): string[] {
    if (value === "" || value === null) {
      return this.options;
    } else {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
  }
}
