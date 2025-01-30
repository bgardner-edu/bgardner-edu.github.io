import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,

  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents:Document[] = [
    new Document("1", "Name", "description", "url", null),
    new Document("2", "doc 1", "description", "url", null),
    new Document("3", "doc 2", "description", "url", null),
    new Document("4", "doc 3", "description", "url", null),
    new Document("5", "doc 3", "description", "url", null)
  ];

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }
}
