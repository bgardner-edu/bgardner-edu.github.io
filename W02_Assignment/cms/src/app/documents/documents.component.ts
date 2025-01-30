import { Component } from '@angular/core';

@Component({
  selector: 'cms-documents',
  standalone: false,
  
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
  selectedDocument: Document;

  onDocumentDetails(document: Document){
    console.log(document);
    this.selectedDocument = document;
  }
}
