import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "clst-checklist-tag",
  templateUrl: "./clst-checklist-tag.component.html",
  styleUrls: ["./clst-checklist-tag.component.scss"]
})
export class ClstChecklistTagComponent implements OnInit {
  @Input() public checklistItem: FormGroup;
  @Output() tagAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tagForm: FormGroup;

  constructor(public fb: FormBuilder) {}

  public ngOnInit(): void {
    this.tagForm = this.fb.group({
      label: "",
      color: "",
      icon: ""
    });
  }

  public onSubmit(): void {
    console.warn("this.tagForm", this.tagForm);
    console.warn("checklistItem", this.checklistItem);
    this.tagAdded.emit(true);
  }
}
