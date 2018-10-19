import { NavigationEnd, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { filter } from "rxjs/operators";

export class ClstBaseComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }
}
