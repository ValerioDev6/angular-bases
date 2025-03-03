import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LocalStorageService } from '../../../services/common/storage/localstorage.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  // Input para saber si el menú de usuario está abierto
  // @Input({ required: true }) isUserMenuOpen: boolean = false;
  // Outputs para emitir eventos hacia el padre
  // @Output() toggleSidebar: EventEmitter<void> = new EventEmitter();
  // @Output() toggleUserMenu: EventEmitter<void> = new EventEmitter();
  // @Output() logout: EventEmitter<void> = new EventEmitter();
  // onToggleSidebar() {
  //   this.toggleSidebar.emit();
  // }
  // onToggleUserMenu() {
  //   this.toggleUserMenu.emit();
  // }
  // onLogout() {
  //   this.logout.emit();
  // }

  isUserMenuOpen = input.required<boolean>();
  toggleSidebar = output<void>();
  toggleUserMenu = output<void>();
  logout = output<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onToggleUserMenu(): void {
    this.toggleUserMenu.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
