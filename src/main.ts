import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

import "hammerjs";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => registerServiceWorker())
  .catch(err => console.log(err));

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(reg => {
        console.log("[ch.ckl.st] Successful service worker registration", reg);
      })
      .catch(err => console.error("[ch.ckl.st] Service worker registration failed", err));
  } else {
    console.error("[ch.ckl.st] Service Worker API is not supported in current browser");
  }
}
