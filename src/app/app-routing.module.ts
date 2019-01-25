import { NgModule } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import {
  Routes,
  RouterModule,
  PreloadAllModules,
  Router,
  ActivatedRoute,
  NavigationEnd
} from "@angular/router";

import { filter } from "rxjs/operators";

import { AuthGuard } from "./shared/auth.guard";
import { HomeGuard } from "./shared/home.guard";
import { EnterCloneGuard } from "./checklist/enter-clone.guard";
import { PendingChangesGuard } from "./shared/pending-changes.guard";
import { LeaveChecklistGuard } from "./checklist/leave-checklist.guard";
import { HomeComponent } from "./core/home/home.component";
import { AboutComponent } from "./core/about/about.component";
import { RegisterComponent } from "./user/register/register.component";
import { LoginComponent } from "./user/login/login.component";
import { DashboardComponent } from "./user/dashboard/dashboard.component";
import { ClstSharePreviewComponent } from "./checklist/share/clst-share-preview/clst-share-preview.component";
import { ClstUseAnonComponent } from "./checklist/use/clst-use-anon/clst-use-anon.component";
import { ClstUseComponent } from "./checklist/use/clst-use/clst-use.component";
import { ClstCloneComponent } from "./checklist/edit/clst-clone/clst-clone.component";
import { ClstFormComponent } from "./checklist/edit/clst-form/clst-form.component";
import { ClstRedirectionComponent } from "./redirection/redirection.component";
import { ClstNotFoundComponent } from "./core/404/clst-not-found.component";

const appRoutes: Routes = [
  { path: "", canActivate: [HomeGuard], component: HomeComponent },
  {
    path: "home",
    canActivate: [HomeGuard],
    component: HomeComponent,
    data: {
      page: "home",
      title: "Professional, shareable checklists",
      description: "Create, share and re-use popular professional checklists."
    }
  },
  {
    path: "about",
    component: AboutComponent,
    data: {
      page: "about",
      title: "About ch.ckl.st, the professional, shareable checklists app",
      description: "ch.ckl.st: the app for creating and sharing professional checklists."
    }
  },
  {
    path: "register",
    component: RegisterComponent,
    data: {
      page: "register",
      title: "Register as a ch.ckl.st user",
      description: "Register to unlock all the features available to edit and share checklists."
    }
  },
  {
    path: "login",
    component: LoginComponent,
    data: {
      page: "login",
      title: "Login to use ch.ckl.st, the checklist app",
      description:
        "Logged in users can access advanced editing and sharing features for professional checklists."
    }
  },
  {
    path: "checklist",
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
    component: ClstFormComponent,
    data: {
      page: "create",
      title: "Create a shareable professional checklist",
      description: "Create checklists that are easy to share, edit and remix."
    }
  },
  {
    path: "clone",
    canActivate: [AuthGuard, EnterCloneGuard],
    canDeactivate: [LeaveChecklistGuard],
    component: ClstCloneComponent,
    data: {
      page: "copy",
      title: "Create a copy of a checklist",
      description: "Create a copy and remix the checklist to suit your needs."
    }
  },
  {
    path: "checklist/:id",
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
    component: ClstFormComponent,
    data: {
      page: "get",
      title: "Edit your checklist",
      description: "Edit your checklist: add, update and delete items."
    }
  },
  {
    path: "use/:id",
    canActivate: [AuthGuard],
    canDeactivate: [LeaveChecklistGuard],
    component: ClstUseComponent,
    data: {
      page: "use",
      title: "Use your checklist, track your actions",
      description: "Easily use your checklist on any device. Take action!"
    }
  },
  {
    path: "dashboard",
    canActivate: [AuthGuard],
    component: DashboardComponent,
    data: {
      page: "dashboard",
      title: "Your checklists and user account actions",
      description: "Create or update your checklists. Take actions with your ch.ckl.st account."
    }
  },
  {
    path: "anon/:id",
    canDeactivate: [LeaveChecklistGuard],
    component: ClstUseAnonComponent,
    data: {
      page: "anon",
      title: "Use your checklist anonymously",
      description: "Anonymously use a checklist. Get going quickly, no need for registration."
    }
  },
  {
    path: "share/:id",
    canDeactivate: [LeaveChecklistGuard],
    component: ClstSharePreviewComponent,
    data: {
      page: "share",
      title: "Easily share a checklist",
      description: "Help your friends take action by sharing professional grade checklists."
    }
  },
  {
    path: "r/:rSource",
    component: ClstRedirectionComponent,
    data: { page: "redirect" }
  },
  {
    path: "not-found",
    component: ClstNotFoundComponent,
    data: {
      page: "404",
      title: "Page not found",
      description: "Sorry. The page that you are searching for was not found."
    }
  },
  {
    path: "**",
    redirectTo: "not-found"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(
    private _router: Router,
    _activatedRoute: ActivatedRoute,
    private _title: Title,
    private _meta: Meta
  ) {
    _router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const pageTitle =
        _router.routerState.snapshot.root.children[0].data["title"] ||
        "Professional, shareable checklists";
      const pageDesc = _router.routerState.snapshot.root.children[0].data["description"] || "";
      _title.setTitle(pageTitle);
      _meta.updateTag({ name: "description", content: pageDesc });
    });
  }
}
