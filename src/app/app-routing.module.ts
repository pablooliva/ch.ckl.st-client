import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { AuthGuard } from "./shared/auth.guard";
import { EnterCloneGuard } from "./checklist/enter-clone.guard";
import { PendingChangesGuard } from "./shared/pending-changes.guard";
import { LeaveChecklistGuard } from "./checklist/leave-checklist.guard";
import { HomeComponent } from "./core/home/home.component";
import { RegisterComponent } from "./user/register/register.component";
import { LoginComponent } from "./user/login/login.component";
import { DashboardComponent } from "./user/dashboard/dashboard.component";
import { ClstSharePreviewComponent } from "./checklist/share/clst-share-preview/clst-share-preview.component";
import { ClstUseAnonComponent } from "./checklist/use/clst-use-anon/clst-use-anon.component";
import { ClstUseComponent } from "./checklist/use/clst-use/clst-use.component";
import { ClstCloneComponent } from "./checklist/edit/clst-clone/clst-clone.component";
import { ClstFormComponent } from "./checklist/edit/clst-form/clst-form.component";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent, data: { page: "home" } },
  {
    path: "register",
    component: RegisterComponent,
    data: { page: "register" }
  },
  { path: "login", component: LoginComponent, data: { page: "login" } },
  {
    path: "checklist",
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
    component: ClstFormComponent,
    data: { page: "create" }
  },
  {
    path: "clone",
    canActivate: [AuthGuard, EnterCloneGuard],
    canDeactivate: [LeaveChecklistGuard],
    component: ClstCloneComponent,
    data: { page: "copy" }
  },
  {
    path: "checklist/:id",
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
    component: ClstFormComponent,
    data: { page: "get" }
  },
  {
    path: "use/:id",
    canActivate: [AuthGuard],
    canDeactivate: [LeaveChecklistGuard],
    component: ClstUseComponent,
    data: { page: "use" }
  },
  {
    path: "dashboard",
    canActivate: [AuthGuard],
    component: DashboardComponent,
    data: { page: "dashboard" }
  },
  {
    path: "anon/:id",
    canDeactivate: [LeaveChecklistGuard],
    component: ClstUseAnonComponent,
    data: { page: "anon" }
  },
  {
    path: "share/:id",
    canDeactivate: [LeaveChecklistGuard],
    component: ClstSharePreviewComponent,
    data: { page: "share" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
