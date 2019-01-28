import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import Quill from "quill";

import { ServerConnectService } from "../../../shared/server-connect.service";
import { resizeElement } from "../../../shared/clst-utils";

export interface IQuillEditorEvent {
  editor: Quill;
  html: string;
  text: string;
}

@Component({
  selector: "clst-flex-text",
  templateUrl: "./clst-flex-text.component.html",
  styleUrls: ["./clst-flex-text.component.scss"]
})
export class ClstFlexTextComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  control: FormControl;
  @Input()
  hasError: boolean;
  @Input()
  label: string;
  @Input()
  inFocusObs: Subject<boolean>;

  public inFocus: boolean;
  public editorOptions: Object;
  public displayHtml: SafeHtml;

  private _destroy: Subject<boolean> = new Subject<boolean>();
  private _quill: Quill;
  private _imageUploading: boolean;
  private _elemWidth: string;

  constructor(
    private _sanitizer: DomSanitizer,
    private _toastr: ToastrService,
    private _serverConnectService: ServerConnectService,
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) {}

  public ngOnInit(): void {
    this.displayHtml = this._sanitizer.bypassSecurityTrustHtml(this.control.value);
    this.inFocus = false;
    this.editorOptions = {
      placeholder: this.label,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ header: [1, 2, 3, 4, false] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"]
        ]
      }
    };

    this.inFocusObs
      .pipe(
        takeUntil(this._destroy),
        debounceTime(500)
      )
      .subscribe(state => {
        if (!this._imageUploading) {
          this.inFocus = state;
        }
      });

    this.control.valueChanges
      .pipe(takeUntil(this._destroy))
      .subscribe(val => (this.displayHtml = this._sanitizer.bypassSecurityTrustHtml(val)));

    this._getElemWidth();
  }

  public ngAfterViewInit(): void {
    this._setAnchorWidth();
  }

  private _getElemWidth(): void {
    this._elemWidth = window.getComputedStyle(this._elementRef.nativeElement).width;
  }

  private _setAnchorWidth(): void {
    const anchors = this._elementRef.nativeElement.getElementsByTagName("a");
    const adjustedElemWidth = parseInt(this._elemWidth.split("px")[0], 10) - 20 + "px";
    for (let i = 0; i < anchors.length; i++) {
      if (anchors[i].text.toLowerCase().indexOf("http") === 0) {
        this._renderer.setStyle(anchors[i], "max-width", adjustedElemWidth);
        this._renderer.addClass(anchors[i], "adjust-for-url");
      }
    }
  }

  public ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.complete();
  }

  public onReady(e: Quill) {
    this._quill = e;
    e.getModule("toolbar").addHandler("image", () => {
      this._selectLocalImage();
    });
  }

  public onFocus() {
    this.inFocusObs.next(true);
  }

  public onBlur(): void {
    const val = this.control.value;
    if (val === null) {
      this.control.patchValue("");
    } else if (val.length === 1) {
      this.control.patchValue(val.replace(/\r?\n|\r/g, ""));
    }
  }

  public onChange(e: IQuillEditorEvent): void {
    if (e.text === null || e.html === null) {
      this.control.patchValue("");
    } else if (e.text && e.text.length === 1) {
      this.control.patchValue(e.text.replace(/\r?\n|\r/g, ""));
    }

    resizeElement(this._elementRef, "iframe");
    this.control.markAsTouched();
  }

  private _selectLocalImage(): void {
    this._imageUploading = true;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.onchange = () => {
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        this._saveToServer(file);
      } else {
        this._imageUploading = false;
        this._toastr.error("The file chosen was not an image.", "Images Only");
      }
    };
  }

  private _saveToServer(file: File): void {
    const serverPath = "images";
    const postData = new FormData();
    postData.append("image", file, file.name);

    this._serverConnectService
      .postImage(serverPath, postData)
      .then(response => {
        const imageUrl = this._serverConnectService.serverLoc + "/" + response.imageFilePath;
        this._insertInEditor(imageUrl);
      })
      .catch((error: any) => {
        this._toastr.error(
          "The file failed to upload, and therefor can not be added to the checklist.",
          "Image Upload Failed"
        );
        console.error("Image upload failed: ", error);
      });
  }

  private _insertInEditor(imageUrl: any): void {
    const range = this._quill.getSelection();
    this._quill.insertEmbed(range.index, "image", imageUrl);
    this._imageUploading = false;
  }
}
