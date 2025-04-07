import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EntryService } from '../entry.service';
import { Entry } from '../entry.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-entry-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './entry-edit.component.html',
  styleUrl: './entry-edit.component.css'
})
export class EntryEditComponent {
  @ViewChild("startDate")
  startDate!: ElementRef;
  @ViewChild("endDate")
  endDate!: ElementRef;

  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
  }

  onSaveEntry(){
    const parsedStartDate = new Date(this.startDate.nativeElement.value);
    const parsedEndDate = new Date(this.endDate.nativeElement.value);
    let total = parsedEndDate.getTime() - parsedStartDate.getTime();
    total = total / (1000 * 60 * 60); // Convert milliseconds to hours

    console.log(this.startDate.nativeElement.value);
    const entry = new Entry("", parsedStartDate, parsedEndDate, total); 
    console.log(entry);
    this.entryService.addEntry(entry);
    this.onClear();
  }
  onClear(){
    this.startDate.nativeElement.value = "";
    this.endDate.nativeElement.value = "";
  }
}
