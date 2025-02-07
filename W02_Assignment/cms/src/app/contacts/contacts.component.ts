import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'cms-contacts',
  standalone: false,
  
  templateUrl: './contacts.component.html'
})
export class ContactsComponent implements OnInit {
  selectedContact: Contact;
  constructor(private contactService: ContactService){}
  ngOnInit(): void {
    this.contactService.contactSelectedEvent.subscribe((contact: Contact) => {this.selectedContact = contact;});
  }
  onContactDetails(contact: Contact){
    this.selectedContact = contact;
  }
}
