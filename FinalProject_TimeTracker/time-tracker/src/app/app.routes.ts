import { Routes } from '@angular/router';
import { EntryListComponent } from './entry/entry-list/entry-list.component';
import { EntryEditComponent } from './entry/entry-edit/entry-edit.component';

export const routes: Routes = [{path: '', redirectTo: '/entries', pathMatch: 'full'},
    {path: 'entries', component: EntryListComponent, children: [
        {path: 'new', component: EntryEditComponent},
        {path: ':id', component: EntryEditComponent},
        {path: ':id/edit', component: EntryEditComponent}
    ]
    }];
