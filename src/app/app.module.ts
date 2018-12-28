import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { NgMaterialModule } from "./material.module";

import { TagInputModule } from "ngx-chips";
import { ToastrModule } from "ngx-toastr";
import { AutosizeModule } from "ngx-autosize";
import { ClipboardModule } from "ngx-clipboard";
import { QuillEditorModule } from "ngx-quill-editor";

import { AppRoutingModule } from "./app-routing.module";
import { ColorPickerModule } from "ngx-color-picker";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./core/home/home.component";
import { LoginComponent } from "./user/login/login.component";
import { RegisterComponent } from "./user/register/register.component";
import { ClstFormComponent } from "./checklist/edit/clst-form/clst-form.component";
import { ClstSectionComponent } from "./checklist/edit/clst-section/clst-section.component";
import { ClstChecklistItemComponent } from "./checklist/edit/clst-checklist-item/clst-checklist-item.component";
import { ClstChecklistItemTagEditComponent } from "./checklist/edit/clst-checklist-item-tag-edit/clst-checklist-item-tag-edit.component";
import { ClstTagDisplayComponent } from "./checklist/clst-tag-display/clst-tag-display.component";
import { DashboardComponent } from "./user/dashboard/dashboard.component";
import { ClstUseRootComponent } from "./checklist/use/clst-use-root/clst-use-root.component";
import { ClstUseSectionComponent } from "./checklist/use/clst-use-section/clst-use-section.component";
import { ClstUseChecklistItemComponent } from "./checklist/use/clst-use-checklist-item/clst-use-checklist-item.component";
import { ClstSharePreviewComponent } from "./checklist/share/clst-share-preview/clst-share-preview.component";
import { ClstUseAnonComponent } from "./checklist/use/clst-use-anon/clst-use-anon.component";
import { ClstUseComponent } from "./checklist/use/clst-use/clst-use.component";
import { ClstCloneComponent } from "./checklist/edit/clst-clone/clst-clone.component";
import { ClstDialogComponent } from "./shared/dialog/clst-dialog/clst-dialog.component";
import { ClstFlexTextComponent } from "./checklist/edit/clst-flex-text/clst-flex-text.component";
import { ClstRedirectionComponent } from "./redirection/redirection.component";

import { SubmitButtonDirective } from "./shared/submit-button.directive";
import { SubmitIfValidDirective } from "./shared/submit-if-valid.directive";
import { AuthenticationInterceptor } from "./shared/authentication.inteceptor";
import { ResizeElementDirective } from "./shared/resize-element.directive";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ClstFormComponent,
    ClstSectionComponent,
    ClstChecklistItemComponent,
    ClstChecklistItemTagEditComponent,
    SubmitIfValidDirective,
    ClstTagDisplayComponent,
    DashboardComponent,
    ClstUseRootComponent,
    ClstUseSectionComponent,
    ClstUseChecklistItemComponent,
    SubmitButtonDirective,
    ClstSharePreviewComponent,
    ClstUseAnonComponent,
    ClstUseComponent,
    ClstCloneComponent,
    ClstDialogComponent,
    ClstFlexTextComponent,
    ClstRedirectionComponent,
    ResizeElementDirective
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
    ClipboardModule,
    QuillEditorModule,
    ColorPickerModule
  ],
  entryComponents: [ClstDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
