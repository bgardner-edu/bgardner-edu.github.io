import { EventEmitter, Injectable } from "@angular/core";
import { Document } from './document.model';
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";


@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    documents: Document[];
    documentSelectedEvent = new EventEmitter<Document>();

    constructor() {
        this.documents = MOCKDOCUMENTS;
    }
    getDocuments(): Document[] {
        return this.documents.slice();
    }

    getdocument(id: string) {
        for (let document of this.documents) {
            if (document.id === id) {
                return document;
            }
        }
        return null;
    }
}