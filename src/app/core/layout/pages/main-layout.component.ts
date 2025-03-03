import { CommonModule } from '@angular/common';
import { Component, HostListener, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidenav/sidenav.component';
import { AuthService } from '../../services/common/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  // Usando signals para un estado reactivo
  isCollapsed = signal(false);
  isUserSubMenuOpen = signal(false);

  isUserMenuOpen = signal(false);

  toggleUserMenu() {
    this.isUserMenuOpen.update((value) => !value);
  }

  toggleDarkMode() {}

  // Cerrar el menú de usuario cuando se hace clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    // Verificar si el clic fue fuera del menú de usuario
    if (
      !targetElement.closest('.user-menu-container') &&
      this.isUserMenuOpen()
    ) {
      this.isUserMenuOpen.set(false);
    }
  }
  toggleSidebar() {
    this.isCollapsed.update((value) => !value);
    if (this.isCollapsed()) {
      this.isUserSubMenuOpen.set(false);
    }
  }
  toggleUserSubMenu() {
    this.isUserSubMenuOpen.update((value) => !value);
  }

  logout() {
    this.authService.logout();
  }
}
