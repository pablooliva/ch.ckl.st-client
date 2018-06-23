import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ChecklistItemTagsSyncService } from "../../shared/checklist-item-tags-sync.service";

@Component({
  selector: "clst-checklist-item-tag-edit",
  templateUrl: "./clst-checklist-item-tag-edit.component.html",
  styleUrls: ["./clst-checklist-item-tag-edit.component.scss"]
})
export class ClstChecklistItemTagEditComponent implements OnInit {
  @Input() public checklistItem: FormGroup;
  @Output() tagAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tagForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private _syncTags: ChecklistItemTagsSyncService
  ) {}

  public ngOnInit(): void {
    this.tagForm = this.fb.group({
      label: "",
      color: "",
      icon: ""
    });
  }

  public onSubmit(): void {
    if (this._syncTags.addTag(this.tagForm.value)) {
      this.tagAdded.emit(true);
    } else {
      console.error("Tag must have a unique label!");
    }
  }
}
