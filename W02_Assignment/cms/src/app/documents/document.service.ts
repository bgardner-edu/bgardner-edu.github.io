import { EventEmitter, Injectable } from "@angular/core";
import { Document } from './document.model';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    baseURL = 'http://localhost:3000/document';
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
        this.http.get<{ message: string, documents: Document[] }>(this.baseURL)
            .subscribe(
                (responseData) => {
                    this.documents = responseData.documents;
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

        const pos = this.documents.findIndex(d => d.id === document.id);

        if (pos < 0) {
            return;
        }

        // delete from database
        this.http.delete('http://localhost:3000/document/' + document.id)
            .subscribe(
                (response: Response) => {
                    this.documents.splice(pos, 1);
                    this.sortAndSend();
                }
            );
    }

    addDocument(document: Document) {
        if (!document) {
            return;
        }

        // make sure id of the new Document is empty
        document.id = '';

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        // add to database
        this.http.post<{ message: string, document: Document }>('http://localhost:3000/document',
            document,
            { headers: headers })
            .subscribe(
                (responseData) => {
                    // add new document to documents
                    this.documents.push(responseData.document);
                    this.sortAndSend();
                }
            );
    }

    updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument) {
            return;
        }

        const pos = this.documents.findIndex(d => d.id === originalDocument.id);

        if (pos < 0) {
            return;
        }

        // set the id of the new Document to the id of the old Document
        newDocument.id = originalDocument.id;
        //newDocument._id = originalDocument._id;

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        // update database
        this.http.put('http://localhost:3000/document/' + originalDocument.id,
            newDocument, { headers: headers })
            .subscribe(
                (response: Response) => {
                    this.documents[pos] = newDocument;
                    this.sortAndSend();
                }
            );
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

    sortAndSend() {
        this.documents.sort((a, b) => (a.name < b.name) ? -1 : 1);
        this.documentListChangedEvent.next(this.documents.slice());
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