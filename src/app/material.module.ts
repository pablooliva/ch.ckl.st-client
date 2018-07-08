import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { LayoutModule } from "@angular/cdk/layout";
import {
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule
} from "@angular/material";

@NgModule({
  imports: [
      FlexLayoutModule,
      MatToolbarModule,
      LayoutModule,
      MatButtonModule,
      MatSidenavModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule
  ],
  exports: [
      FlexLayoutModule,
      MatToolbarModule,
      LayoutModule,
      MatButtonModule,
      MatSidenavModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule
  ]
})
@NgModule({
  imports: [CommonModule],
  declarations: []
})
export class NgMaterialModule {}
