import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  standalone: false,

  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  id: string;
  nativeWindow: any;

  constructor(private docService: DocumentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private windRef: WindRefService) { }

  ngOnInit() {
    this.nativeWindow, this.windRef.getNativeWindow();
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.document = this.docService.getDocument(this.id);
      }
    );
  }
  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }
  onDelete() {
    this.docService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }
}
