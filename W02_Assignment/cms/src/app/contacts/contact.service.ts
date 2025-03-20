import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    baseURL = 'http://localhost:3000/contact';
    contacts: Contact[] = [];
    maxContactId: number;
    contactSelectedEvent = new EventEmitter<Contact>();
    contactChangedEvent = new EventEmitter<Contact[]>();
    contactListChangedEvent = new Subject<Contact[]>();

    constructor(private http: HttpClient) {
        this.maxContactId = this.getMaxId();
    }

    getContacts(): Contact[] {
        this.http.get<{message: string, contacts: Contact[]}>(this.baseURL).subscribe(
            (responseData) => {
                this.contacts = responseData.contacts;
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

        const pos = this.contacts.findIndex(d => d.id === contact.id);

        if (pos < 0) {
            return;
        }

        // delete from database
        this.http.delete('http://localhost:3000/contact/' + contact.id)
            .subscribe(
                (response: Response) => {
                    this.contacts.splice(pos, 1);
                    this.sortAndSend();
                }
            );
    }


    addContact(newContact: Contact) {
        if (!newContact) {
            return;
        }

        // make sure id of the new contact is empty
        newContact.id = '';

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        // add to database
        this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contact',
            newContact,
            { headers: headers })
            .subscribe(
                (responseData) => {
                    // add new contact to contacts
                    this.contacts.push(responseData.contact);
                    this.sortAndSend();
                }
            );
    }

    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
            return;
        }

        const pos = this.contacts.findIndex(d => d.id === originalContact.id);

        if (pos < 0) {
            return;
        }

        // set the id of the new Contact to the id of the old Contact
        newContact.id = originalContact.id;
        //newContact._id = originalContact._id;

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        // update database
        this.http.put('http://localhost:3000/contact/' + originalContact.id,
            newContact, { headers: headers })
            .subscribe(
                (response: Response) => {
                    this.contacts[pos] = newContact;
                    this.sortAndSend();
                }
            );
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

    sortAndSend() {
        this.contacts.sort((a, b) => (a.name < b.name) ? -1 : 1);
        this.contactChangedEvent.next(this.contacts.slice());
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