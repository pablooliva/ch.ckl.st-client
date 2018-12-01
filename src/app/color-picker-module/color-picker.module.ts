import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ColorPickerService } from "./color-picker.service";
import {
  ColorPickerDirective,
  DialogComponent,
  SliderDirective,
  TextDirective
} from "./color-picker.directive";

@NgModule({
  imports: [CommonModule],
  providers: [ColorPickerService],
  declarations: [ColorPickerDirective, TextDirective, SliderDirective, DialogComponent],
  exports: [ColorPickerDirective, TextDirective, SliderDirective, DialogComponent]
})
export class ColorPickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ColorPickerModule,
      providers: [ColorPickerService]
    };
  }
}
