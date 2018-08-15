import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { AuthGuard } from "./shared/auth.guard";
import { HomeComponent } from "./core/home/home.component";
import { RegisterComponent } from "./user/register/register.component";
import { LoginComponent } from "./user/login/login.component";
import { DashboardComponent } from "./user/dashboard/dashboard.component";
import { ClstCreateComponent } from "./checklist/edit/clst-create/clst-create.component";
import { LeaveChecklistGuard } from "./checklist/leave-checklist.guard";
import { ClstUseRootComponent } from "./checklist/use/clst-use-root/clst-use-root.component";
import { EnterCloneGuard } from "./checklist/enter-clone.guard";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  {
    path: "checklist",
    canActivate: [AuthGuard],
    canDeactivate: [LeaveChecklistGuard],
    component: ClstCreateComponent
  },
  {
    path: "clone",
    canActivate: [AuthGuard, EnterCloneGuard],
    canDeactivate: [LeaveChecklistGuard],
    component: ClstCreateComponent
  },
  {
    path: "checklist/:id",
    canActivate: [AuthGuard],
    canDeactivate: [LeaveChecklistGuard],
    component: ClstCreateComponent
  },
  {
    path: "use/:id",
    canActivate: [AuthGuard],
    canDeactivate: [LeaveChecklistGuard],
    component: ClstUseRootComponent
  },
  {
    path: "dashboard",
    canActivate: [AuthGuard],
    component: DashboardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
