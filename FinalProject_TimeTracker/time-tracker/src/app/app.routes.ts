import { Routes } from '@angular/router';
import { EntryListComponent } from './entry/entry-list/entry-list.component';
import { EntryEditComponent } from './entry/entry-edit/entry-edit.component';

export const routes: Routes = [
    { path: '', redirectTo: '/entries', pathMatch: 'full' },
    { path: 'entries', component: EntryListComponent },
    { path: 'entries/new', component: EntryEditComponent },
    { path: 'entries/:id', component: EntryEditComponent }
  ];
