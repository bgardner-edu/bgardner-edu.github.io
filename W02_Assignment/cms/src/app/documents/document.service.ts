import { EventEmitter, Injectable } from "@angular/core";
import { Document } from './document.model';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    baseURL = 'https://wdd430project-default-rtdb.firebaseio.com/documents.json';
    documents: Document[];
    documentSelectedEvent = new EventEmitter<Document>();
    documentChangedEvent = new EventEmitter<Document[]>();
    documentListChangedEvent = new Subject<Document[]>();
    maxDocumentId: number;

    constructor(private http: HttpClient) { 
        this.documents = [];
        this.maxDocumentId = this.getMaxId();
    }
    getDocuments(): Document[] {
        this.http.get<Document[]>(this.baseURL)
        .subscribe(
            (documents: Document[]) => {
                this.documents = documents;
                this.maxDocumentId = this.getMaxId();
                this.documents.sort((a, b) => (a.name < b.name) ? -1 : 1);
                this.documentListChangedEvent.next(this.documents.slice());
            },
            (error: any) => {
                console.error(error);
            }
        );
        return this.documents.slice();
    }

    getDocument(id: string) {
        for (let document of this.documents) {
            if (document.id === id) {
                return document;
            }
        }
        return null;
    }

    deleteDocument(document: Document) {
        if (!document) {
            return;
        }
        const pos = this.documents.indexOf(document);
        if (pos < 0) {
            return;
        }
        this.documents.splice(pos, 1);
        this.storeDocuments();
    }

    addDocument(newDocument: Document) {
        if (!newDocument) {
            return;
        }
        this.maxDocumentId++;
        newDocument.id = String(this.maxDocumentId);
        this.documents.push(newDocument);
        this.storeDocuments();
    }

    updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument) {
            return;
        }
        const pos = this.documents.indexOf(originalDocument);
        if (pos < 0) {
            return;
        }
        newDocument.id = originalDocument.id;
        this.documents[pos] = newDocument;
        this.storeDocuments();
    }

    storeDocuments() {
        let documents = JSON.stringify(this.documents);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        this.http.put(this.baseURL, documents, { headers: headers })
        .subscribe(
            () => {
                this.documentListChangedEvent.next(this.documents.slice());
            }
        );
    }
    private getMaxId(): number {
        let maxId = 0;
        for (let document of this.documents) {
            let currentId = parseInt(document.id);
            if (currentId > maxId) {
                maxId = currentId;
            }
        }
        return maxId;
    }
}