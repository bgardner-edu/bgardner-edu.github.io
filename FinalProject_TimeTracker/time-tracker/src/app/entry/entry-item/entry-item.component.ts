import { Component, Input } from '@angular/core';
import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-item',
  imports: [CommonModule],
  templateUrl: './entry-item.component.html',
  styleUrl: './entry-item.component.css'
})
export class EntryItemComponent {
  @Input() item: Entry = new Entry('', new Date(), new Date(), 0);
  constructor(private entryService: EntryService) { }

  ngOnInit() {

  }
}
