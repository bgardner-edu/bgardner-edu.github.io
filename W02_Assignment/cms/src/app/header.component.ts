import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-header',
  standalone: false,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() optionSelected = new EventEmitter<string>();
  collapsed = true;

  onDocSelected(){
    this.optionSelected.emit("documents");
  }
  onMsgSelected(){
    this.optionSelected.emit("messages");
  }
  onContactSelected(){
    this.optionSelected.emit("contacts");
  }
}
