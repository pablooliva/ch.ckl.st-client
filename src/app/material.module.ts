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
  MatInputModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatCardModule
} from "@angular/material";

const ngMat = [
  FlexLayoutModule,
  MatToolbarModule,
  LayoutModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatCardModule
];

@NgModule({
  imports: ngMat,
  exports: ngMat
})
@NgModule({
  imports: [CommonModule],
  declarations: []
})
export class NgMaterialModule {}
