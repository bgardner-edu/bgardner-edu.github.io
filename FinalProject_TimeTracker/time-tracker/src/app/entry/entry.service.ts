import { EventEmitter, Injectable } from "@angular/core";
import { Entry } from "./entry.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class EntryService {
    baseURL = 'http://localhost:3000/api/entries/';
    entries: Entry[] = [];
    maxEntryId: number;
    EntryChangedEvent = new Subject<Entry[]>();

    constructor(private http: HttpClient) {
        this.maxEntryId = this.getMaxId();
    }

    getEntries() {
        this.http.get<{ message: string, entries: Entry[] }>(this.baseURL).subscribe(
            (responseData) => {
                this.entries = responseData.entries
                this.maxEntryId = this.getMaxId();
                this.entries.sort((a, b) => (a.id < b.id) ? -1 : 1);
                this.EntryChangedEvent.next(this.entries.slice());
                console.log(this.entries);
            },
            (error: any) => {
                console.error(error);
            }
        );
        return this.entries.slice();
    }

    getEntry(id: string) {
        for (let entry of this.entries) {
            if (entry.id === id) {
                return entry;
            }
        }
        return null;
    }

    addEntry(entry: Entry) {
        if (!entry) {
            return;
        }
        entry.id = '';

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

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

    deleteEntry(entry: Entry) {
        if (!entry) {
            return;
        }

        const pos = this.entries.findIndex(d => d.id === entry.id);

        if (pos < 0) {
            return;
        }

        // delete from database
        this.http.delete(this.baseURL + entry.id)
            .subscribe(
                (response: any) => {
                    this.entries.splice(pos, 1);
                    this.sortAndSend();
                }
            );
    }

    editingEntry(originalEntry: Entry, newEntry: Entry) {
        if (!originalEntry || !newEntry) {
            return;
        }

        const pos = this.entries.findIndex(d => d.id === originalEntry.id);

        if (pos < 0) {
            return;
        }

        // set the id of the new Contact to the id of the old Contact
        newEntry.id = originalEntry.id;
        //newContact._id = originalContact._id;

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        // update database
        this.http.put(this.baseURL + originalEntry.id,
            newEntry, { headers: headers })
            .subscribe(
                (response: any) => {
                    this.entries[pos] = newEntry;
                    this.sortAndSend();
                }
            );
    }

    sortAndSend() {
        this.entries.sort((a, b) => (a.startDate < b.startDate) ? -1 : 1);
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