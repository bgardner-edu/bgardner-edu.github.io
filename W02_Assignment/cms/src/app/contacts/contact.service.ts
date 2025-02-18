import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    contacts: Contact[] = [];
    maxContactId: number;
    contactSelectedEvent = new EventEmitter<Contact>();
    contactChangedEvent = new EventEmitter<Contact[]>();
    contactListChangedEvent = new Subject<Contact[]>();

    constructor() {
        this.contacts = MOCKCONTACTS;
        this.maxContactId = this.getMaxId();
    }

    getContacts(): Contact[] {
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
        this.contactChangedEvent.emit(this.contacts.slice());
    }


    addContact(newContact: Contact) {
        if (!newContact) {
            return;
        }
        this.maxContactId++;
        newContact.id = String(this.maxContactId);
        this.contacts.push(newContact);
        this.contactListChangedEvent.next(this.contacts.slice());
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
        this.contactListChangedEvent.next(this.contacts.slice());
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