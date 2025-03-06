import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    baseURL = 'https://wdd430project-default-rtdb.firebaseio.com/contacts.json';
    contacts: Contact[] = [];
    maxContactId: number;
    contactSelectedEvent = new EventEmitter<Contact>();
    contactChangedEvent = new EventEmitter<Contact[]>();
    contactListChangedEvent = new Subject<Contact[]>();

    constructor(private http: HttpClient) {
        this.maxContactId = this.getMaxId();
    }

    getContacts(): Contact[] {
        this.http.get<Contact[]>(this.baseURL).subscribe(
            (contacts: Contact[]) => {
                this.contacts = contacts;
                this.maxContactId = this.getMaxId();
                this.contactListChangedEvent.next(this.contacts.slice());
            },
            (error: any) => {
                console.error(error);
            }
        );
        return this.contacts.slice();
    }
    

    getContact(id: string) {
        for (let contact of this.contacts) {
            if (contact.id === id) {
                return contact;
            }
        }
        return null;
    }
    deleteContact(contact: Contact) {
        if (!contact) {
            return;
        }
        const pos = this.contacts.indexOf(contact);
        if (pos < 0) {
            return;
        }
        this.contacts.splice(pos, 1);
        this.storeContacts();
    }


    addContact(newContact: Contact) {
        if (!newContact) {
            return;
        }
        this.maxContactId++;
        newContact.id = String(this.maxContactId);
        this.contacts.push(newContact);
        this.storeContacts();
    }

    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
            return;
        }
        const pos = this.contacts.indexOf(originalContact);
        if (pos < 0) {
            return;
        }
        newContact.id = originalContact.id;
        this.contacts[pos] = newContact;
        this.storeContacts();
    }

    storeContacts() {
        let contacts = JSON.stringify(this.contacts);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        this.http.put(this.baseURL, contacts, { headers: headers }).subscribe(
            () => {
                this.contactListChangedEvent.next(this.contacts.slice());
            }
        );
    }

    private getMaxId(): number {
        let maxId = 0;
        for (let contact of this.contacts) {
            let currentId = parseInt(contact.id);
            if (currentId > maxId) {
                maxId = currentId;
            }
        }
        return maxId;
    }
}