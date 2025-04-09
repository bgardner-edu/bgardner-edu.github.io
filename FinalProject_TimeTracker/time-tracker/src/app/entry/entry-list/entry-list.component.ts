import { Component } from '@angular/core';
import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';
import { EntryItemComponent } from "../entry-item/entry-item.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntryEditComponent } from "../entry-edit/entry-edit.component";

@Component({
  selector: 'app-entry-list',
  imports: [EntryItemComponent, CommonModule, RouterModule, EntryEditComponent],
  templateUrl: './entry-list.component.html',
  styleUrl: './entry-list.component.css'
})
export class EntryListComponent {
  entries: Entry[] = [];

  constructor(private entryService: EntryService) {
  }

  ngOnInit() {
    this.entries = this.entryService.getEntries();
    this.entryService.EntryChangedEvent.subscribe((messages: Entry[]) => { this.entries = messages; });
  }

  addEntry(entry: Entry) {
    this.entries.push(entry);
  }
}
