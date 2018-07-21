import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClientXsrfModule
} from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { NgMaterialModule } from "./material.module";

import { TagInputModule } from "ngx-chips";
import { ToastrModule } from "ngx-toastr";
import { AutosizeModule } from "ngx-autosize";
import { ColorPickerModule } from "./color-picker-module/color-picker.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./core/home/home.component";
import { LoginComponent } from "./user/login/login.component";
import { RegisterComponent } from "./user/register/register.component";
import { ClstCreateComponent } from "./checklist/clst-create/clst-create.component";
import { ClstFormComponent } from "./checklist/clst-form/clst-form.component";
import { ClstSectionComponent } from "./checklist/clst-section/clst-section.component";
import { ClstChecklistItemComponent } from "./checklist/clst-checklist-item/clst-checklist-item.component";
import { ClstChecklistItemTagEditComponent } from "./checklist/clst-checklist-item-tag-edit/clst-checklist-item-tag-edit.component";

import { FormElementPusherService } from "./shared/form-element-pusher.service";
import { ServerConnectService } from "./shared/server-connect.service";
import { AuthenticationInterceptor } from "./shared/authentication.inteceptor";
import { ChecklistItemTagsSyncService } from "./shared/checklist-item-tags-sync.service";
import { DataPersistenceService } from "./shared/data-persistence.service";
import { AuthGuard } from "./shared/auth.guard";
import { SubmitIfValidDirective } from "./shared/submit-if-valid.directive";
import { ClstTagDisplayComponent } from "./checklist/clst-tag-display/clst-tag-display.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ClstCreateComponent,
    ClstFormComponent,
    ClstSectionComponent,
    ClstChecklistItemComponent,
    ClstChecklistItemTagEditComponent,
    SubmitIfValidDirective,
    ClstTagDisplayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: "toast-top-full-width"
    }),
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: "XSRF-TOKEN",
      headerName: "X-XSRF-TOKEN"
    }),
    AppRoutingModule,
    ReactiveFormsModule,
    NgMaterialModule,
    TagInputModule,
    AutosizeModule,
    ColorPickerModule
  ],
  providers: [
    FormElementPusherService,
    ServerConnectService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    ChecklistItemTagsSyncService,
    DataPersistenceService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
