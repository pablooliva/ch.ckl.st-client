import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { ServerConnectService } from "../../../shared/server-connect.service";
import {
  DataPersistenceService,
  IClstFormDataModel
} from "../../../shared/data-persistence.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "clst-use-root",
  templateUrl: "./clst-use-root.component.html",
  styleUrls: ["./clst-use-root.component.scss"]
})
export class ClstUseRootComponent implements OnInit {
  public cId: string;
  public clstData: IClstFormDataModel;

  constructor(
    private _serverConnectService: ServerConnectService,
    private _dataPersistence: DataPersistenceService,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.cId = this._route.snapshot.params["id"];

    this._dataPersistence
      .prepareClientData(this.cId, this._serverConnectService)
      .then((data: IClstFormDataModel) => {
        this.clstData = data;
      });
  }
}
