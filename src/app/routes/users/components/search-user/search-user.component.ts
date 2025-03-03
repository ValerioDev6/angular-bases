import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-search-user',
  imports: [FormsModule],
  template: `
    <div class="relative  max-w-72 w-full">
      <input
        [(ngModel)]="searchTerm"
        (keyup.enter)="onSearch()"
        type="text"
        placeholder="Buscar por nombre"
        class="bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
    </div>
  `,
  styles: ``,
})
export class SearchUserComponent {
  searchTerm: string = '';

  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchTerm.trim());
  }
}
