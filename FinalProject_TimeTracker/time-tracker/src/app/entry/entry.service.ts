import { EventEmitter, Injectable } from "@angular/core";
import { Entry } from "./entry.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class EntryService {
    baseURL = 'http://localhost:3000/api/entries';
    entries: Entry[] = [];
    maxEntryId: number;
    EntryChangedEvent = new Subject<Entry[]>();

    constructor(private http: HttpClient) {
        this.maxEntryId = this.getMaxId();
    }

    getEntries() {
        this.http.get<{message: string, entries: Entry[] }>(this.baseURL).subscribe(
            (responseData) => {
                this.entries = responseData.entries
                this.maxEntryId = this.getMaxId();
                this.entries.sort((a, b) => (a.id < b.id) ? -1 : 1);
                this.EntryChangedEvent.next(this.entries.slice());
            },
            (error: any) => {
                console.error(error);
            }
        );
        return this.entries.slice();
    }

    // getMessage(id: string) {
    //     for (let message of this.entries) {
    //         if (message.id === id) {
    //             return message;
    //         }
    //     }
    //     return null;
    // }

    addEntry(entry: Entry) {
        if (!entry) {
            return;
          }
      
          // make sure id of the new Document is empty
          entry.id = '';
      
          const headers = new HttpHeaders({'Content-Type': 'application/json'});
      
          // add to database
          this.http.post<{ message: string, resEntry: Entry }>(this.baseURL,
            entry,
            { headers: headers })
            .subscribe(
              (responseData) => {
                this.entries.push(responseData.resEntry);
                this.EntryChangedEvent.next(this.entries.slice());
              }
            );
        }

    storeEntries() {
        let entries = JSON.stringify(this.entries);
        this.http.put(this.baseURL, entries, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }).subscribe(() => {
            this.EntryChangedEvent.next(this.entries.slice());
        });
    }

    sortAndSend() {
        this.entries.sort((a, b) => (a.startTime < b.startTime) ? -1 : 1);
        this.EntryChangedEvent.next(this.entries.slice());
    }

    getMaxId(): number {
        let maxId = 0;
        for (let entry of this.entries) {
            let currentId = parseInt(entry.id);
            if (currentId > maxId) {
                maxId = currentId;
            }
        }
        return maxId;
    }
}