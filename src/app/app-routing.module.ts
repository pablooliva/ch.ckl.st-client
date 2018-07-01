import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { AuthGuard } from "./shared/auth.guard";
import { HomeComponent } from "./core/home/home.component";
import { RegisterComponent } from "./user/register/register.component";
import { LoginComponent } from "./user/login/login.component";
import { ClstCreateComponent } from "./checklist/clst-create/clst-create.component";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  {
    path: "checklist",
    canActivate: [AuthGuard],
    component: ClstCreateComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
