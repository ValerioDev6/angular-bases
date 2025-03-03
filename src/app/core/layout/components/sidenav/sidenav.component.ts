import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ERole } from '@core/enums/roles.enum';
import { AuthService } from '@core/services/common/auth.service';
interface SubRoute {
  path: string;
  label: string;
  icon: string;
  requiredRoles?: ERole[];
}

interface SidebarRoute {
  path: string;
  label: string;
  icon: string;
  hasChevron?: boolean;
  subRoutes?: SubRoute[];
  requiredRoles?: ERole[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidenav.component.html',
  styles: `
  .router-link-active {
    background-color: rgb(55, 48, 163); 
    color: white;
  }

  a.router-link-active {
    background-color: rgb(55, 48, 163);
    color: white;
  }
  `,
})
export class SidebarComponent {
  private readonly _authService = inject(AuthService);
  currentUserRole: ERole | null = null;
  protected readonly ERole = ERole;

  isCollapsed = input.required<boolean>();
  openMenus = new Map<string, boolean>();
  constructor() {
    this.loadUserRole();
  }

  loadUserRole() {
    this._authService.user$.subscribe((user) => {
      if (user) {
        this.currentUserRole = user.roles.name as ERole;
      }
    });
  }

  routes: SidebarRoute[] = [
    {
      path: '/admin/home',
      label: 'Panel',
      icon: 'fas fa-th-large',
    },
    {
      path: '/administracion',
      label: 'Administración',
      icon: 'fas fa-cog',
      hasChevron: true,
      requiredRoles: [ERole.ADMIN],
    },
    {
      path: '/notificaciones',
      label: 'Notificaciones',
      icon: 'fas fa-bell',
      hasChevron: true,
    },
    {
      path: '/configuraciones',
      label: 'Configuraciones',
      icon: 'fas fa-cogs',
      hasChevron: true,
    },
    {
      path: '/usuarios',
      label: 'Usuarios',
      icon: 'fas fa-users',
      requiredRoles: [ERole.ADMIN],
      subRoutes: [
        {
          path: '/admin/usuarios/listado',
          label: 'Listar Usuarios',
          icon: 'fas fa-list',
        },
        {
          path: '/admin/roles/listado',
          label: 'Crear Usuario',
          icon: 'fas fa-user-plus',
        },
        {
          path: '/usuarios/buscar',
          label: 'Buscar Usuario',
          icon: 'fas fa-search',
        },
      ],
    },
    {
      path: '/roles',
      label: 'Roles',
      icon: 'fas fa-user-shield',
      requiredRoles: [ERole.ADMIN],
      subRoutes: [
        {
          path: '/admin/roles/listado',
          label: 'Listar Roles',
          icon: 'fas fa-list',
        },
        {
          path: '/admin/roles/crear',
          label: 'Crear Rol',
          icon: 'fas fa-plus-circle',
        },
        {
          path: '/admin/permisos/listado',
          label: 'Permisos',
          icon: 'fas fa-lock',
        },
        {
          path: '/roles/buscar',
          label: 'Buscar Rol',
          icon: 'fas fa-search',
        },
      ],
    },

    {
      path: '/categorias',
      label: 'Categorías',
      icon: 'fas fa-tags',
      subRoutes: [
        {
          path: '/categorias/listado',
          label: 'Listar Categorías',
          icon: 'fas fa-list',
        },
        {
          path: '/categorias/crear',
          label: 'Crear Categoría',
          icon: 'fas fa-plus-circle',
        },
      ],
    },
    {
      path: '/productos',
      label: 'Productos',
      icon: 'fas fa-box',
      subRoutes: [
        {
          path: '/productos/listado',
          label: 'Listar Productos',
          icon: 'fas fa-list',
        },
        {
          path: '/productos/crear',
          label: 'Crear Producto',
          icon: 'fas fa-plus-circle',
        },
        {
          path: '/productos/inventario',
          label: 'Inventario',
          icon: 'fas fa-warehouse',
        },
      ],
    },
  ];

  hasRole(allowedRoles: ERole[]): boolean {
    return this.currentUserRole
      ? allowedRoles.includes(this.currentUserRole)
      : false;
  }
  isMenuOpen(route: SidebarRoute): boolean {
    return this.openMenus.get(route.label) || false;
  }

  toggleMenu(route: SidebarRoute): void {
    const isCurrentlyOpen = this.openMenus.get(route.label) || false;
    this.openMenus.set(route.label, !isCurrentlyOpen);
  }

  hasSubRoutes(route: SidebarRoute): boolean {
    return !!route.subRoutes && route.subRoutes.length > 0;
  }
}
