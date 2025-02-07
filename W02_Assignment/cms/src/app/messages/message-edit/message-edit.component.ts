import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, viewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../messages.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent implements OnInit {
  currentSender = "Bradley Gardner"
  @ViewChild("subject") subject: ElementRef;
  @ViewChild("message") message: ElementRef;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage(){
    console.log(this.subject.nativeElement.value);
    const message = new Message("2", this.subject.nativeElement.value, this.message.nativeElement.value, this.currentSender);
    this.messageService.addMessage(message);
    this.onClear();
  }
  onClear(){
    this.subject.nativeElement.value = "";
    this.message.nativeElement.value = "";
  }
}
