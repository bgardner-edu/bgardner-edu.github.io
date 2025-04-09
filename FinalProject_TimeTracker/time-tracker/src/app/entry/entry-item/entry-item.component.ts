import { Component, Input } from '@angular/core';
import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-entry-item',
  imports: [CommonModule, RouterModule],
  templateUrl: './entry-item.component.html',
  styleUrl: './entry-item.component.css'
})
export class EntryItemComponent {
  @Input() item: Entry | undefined;
  constructor(private entryService: EntryService) { }

  ngOnInit() { }

  onDeleteEntry() {
    if (this.item) {
      this.entryService.deleteEntry(this.item);
    }
  }
}
