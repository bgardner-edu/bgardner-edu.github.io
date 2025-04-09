import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EntryService } from '../entry.service';
import { Entry } from '../entry.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-entry-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './entry-edit.component.html',
  styleUrl: './entry-edit.component.css'
})
export class EntryEditComponent implements OnInit {
  editMode: boolean = false;
  originalEntry: Entry | undefined;
  entry: Entry = new Entry("", "new Date()", "new Date()", 0)
  constructor(private entryService: EntryService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        return;
      }

      this.originalEntry = this.entryService.getEntry(id) || undefined;
      if (!this.originalEntry) return;

      this.editMode = true;

      this.entry = {
        ...this.originalEntry,
        startDate: new Date(this.originalEntry.startDate).toISOString().slice(0, 16),
        endDate: new Date(this.originalEntry.endDate).toISOString().slice(0, 16),
      };
    });
  }


  onSaveEntry(forms: NgForm) {
    const parsedStartDate = new Date(this.entry.startDate);
    const parsedEndDate = new Date(this.entry.endDate);
    let total = parsedEndDate.getTime() - parsedStartDate.getTime();
    this.entry.total = total / (1000 * 60 * 60); // Convert milliseconds to hours

    console.log(this.entry);
    if (this.editMode) {
      if (this.originalEntry) {
        this.entryService.editingEntry(this.originalEntry, this.entry);
      }
    } else {
      this.entryService.addEntry(this.entry);
    }
    this.onBack();
  }
  onClear() {
    this.entry.startDate = "";
    this.entry.endDate = "";
  }
  onBack(): void {
    this.router.navigate(['/entries']);  // Navigate back to the list component
  }
}
