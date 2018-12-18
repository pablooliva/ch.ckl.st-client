import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { ServerConnectService } from "../shared/server-connect.service";

export interface IRedirection {
  active: boolean;
  created: string;
  source: string;
  target: string;
}

@Component({
  selector: "clst-redirection",
  templateUrl: "./redirection.component.html"
})
export class ClstRedirectionComponent implements OnInit {
  constructor(
    private _serverConnectService: ServerConnectService,
    private _toastr: ToastrService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const redirectPath = "r/" + this._route.snapshot.params["rSource"];
    this._serverConnectService
      .getRedirection(redirectPath)
      .then((response: IRedirection) => {
        if (!response) {
          throw new Error("This URL (location) does not exist. We are redirecting you home.");
        }
        const useRoute = response.target;
        this._router.navigate([useRoute]);
      })
      .catch(error => {
        this._toastr.error(error, "Request Failed");
        this._router.navigate(["/home"]);
      });
  }
}
