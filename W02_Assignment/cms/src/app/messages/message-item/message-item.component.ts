import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit {
  @Input() item: Message;
  messageSender = '';
  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.messageSender = this.contactService.getContact(this.item.id)?.name;
  }
}
