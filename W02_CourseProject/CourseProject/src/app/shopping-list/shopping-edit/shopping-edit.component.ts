import { Component, EventEmitter, Output } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  standalone: false,
  
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent {
  @Output() ingredientAdded = new EventEmitter<{name: string, amount: number}>();

  onAddItem(name: string, amount: number){
    const newIngredient = new Ingredient(name, amount)
    this.ingredientAdded.emit(newIngredient);
  }
}
