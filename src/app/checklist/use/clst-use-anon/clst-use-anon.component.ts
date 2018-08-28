import { Component, OnInit } from "@angular/core";

@Component({
  selector: "clst-use-anon",
  templateUrl: "./clst-use-anon.component.html",
  styleUrls: ["./clst-use-anon.component.scss"]
})
export class ClstUseAnonComponent implements OnInit {
  public link: string;
  public copyLabel: string;

  constructor() {}

  public ngOnInit(): void {
    this.copyLabel = "Copy";
    this.link = window.location.href;
  }
}
