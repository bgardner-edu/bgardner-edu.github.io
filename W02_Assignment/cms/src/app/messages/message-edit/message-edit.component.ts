import { Component, ElementRef, EventEmitter, Output, ViewChild, viewChild } from '@angular/core';
import { Message } from '../message-list/message.model';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  currentSender = "Bradley Gardner"
  @Output() add = new EventEmitter<Message>()
  @ViewChild("subject") subject: ElementRef;
  @ViewChild("message") message: ElementRef;

  onSave(){
    console.log(this.subject.nativeElement.value);
    const message = new Message("2", this.subject.nativeElement.value, this.message.nativeElement.value, this.currentSender);
    this.add.emit(message);
    this.onClear();
  }
  onClear(){
    this.subject.nativeElement.value = "";
    this.message.nativeElement.value = "";
  }
}
