import { Component, EventEmitter, Output } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    standalone: false
})
export class HeaderComponent {
    collapsed = true;
    constructor(private dataStorageService: DataStorageService) {}

    onSaveData(){
        this.dataStorageService.storeRecipes();
    }
    onFetchData(){
        this.dataStorageService.fetchRecipes().subscribe();
    }
}