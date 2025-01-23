import {Component} from '@angular/core';
import {Message} from './message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,

  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message("1", "testing", "jasonk@byui.edu", "R.Kent Jackson"),
    new Message("2", "testing", "rj@byui.edu", "Robert Johnson"),
    new Message("3", "testing", "someone@byui.edu", "Someone else")
  ];

  ngOnInit() {
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }
}
