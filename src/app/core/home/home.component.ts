import { Component, OnInit } from "@angular/core";

@Component({
  selector: "clst-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public title;

  constructor() {}

  ngOnInit() {
    this.title = "ch.ckl.st";
  }
}
