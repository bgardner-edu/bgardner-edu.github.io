import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    standalone: false
})
export class HeaderComponent {
    collapsed = true;
}