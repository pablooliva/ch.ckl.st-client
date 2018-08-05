import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "clst-checklist",
  templateUrl: "./clst-create.component.html",
  styleUrls: ["./clst-create.component.scss"]
})
export class ClstCreateComponent implements OnInit{
  public clstId: string;

  constructor(private _route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.clstId = this._route.snapshot.params["id"];
  }
}
