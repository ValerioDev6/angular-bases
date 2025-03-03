import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreateRolModalComponent } from 'src/app/routes/roles/components/create-rol-modal/create-rol-modal.component';
import { RolTableComponent } from 'src/app/routes/roles/components/rol-table/rol-table.component';
import { SearchRolComponent } from 'src/app/routes/roles/components/search-rol/search-rol.component';
import {
  IRolesResponse,
  Role,
} from 'src/app/routes/roles/interfaces/roles.interface';
import { RolesService } from 'src/app/routes/roles/services/roles.service';
import { SwalService } from '@shared/swal.service';

@Component({
  selector: 'app-roles-page',
  imports: [
    CommonModule,
    RolTableComponent,
    SearchRolComponent,
    CreateRolModalComponent,
  ],
  templateUrl: './roles-page.component.html',
  styles: ``,
})
export default class RolesPageComponent implements OnInit {
  private readonly deleteService = inject(SwalService);
  private readonly rolesService = inject(RolesService);
  private readonly router = inject(Router);
  showModal = signal<boolean>(false);

  roles = signal<Role[]>([]);
  page = signal<number>(1);
  pageSize = signal<number>(5);
  total = signal<number>(0);
  search = signal<string>('');
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading.set(true);
    this.roles.set([]);
    this.rolesService
      .getAllRoles(this.page(), this.pageSize(), this.search())
      .subscribe({
        next: (response: IRolesResponse) => {
          this.roles.set(response.roles);
          this.total.set(response.info.total);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar roles', err);
          this.loading.set(false);
        },
      });
  }

  pageChanged(newPage: number): void {
    this.page.set(newPage);
    this.loadRoles();
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
    this.loadRoles();
  }

  onSearch(term: string) {
    this.search.set(term);
    this.page.set(1);
    this.loadRoles();
  }

  refreshPage(): void {
    this.loadRoles();
  }

  loadingUser() {
    this.loadRoles();
  }

  deleteRol(rol: Role): void {
    this.deleteService
      .confirmDelete(
        `Este proceso no es reversible, está a punto de eliminar su rol "${rol.name}"`
      )
      .then((confirmed) => {
        if (confirmed) {
          this.loading.set(true);
          this.rolesService.deleteRolById(rol.id).subscribe({
            next: () => {
              this.loading.set(false);
              this.loadRoles();
            },
            error: () => {
              this.loading.set(false);
            },
          });
        }
      });
  }

  editModal(rol: Role) {
    this.router.navigate([`/admin/roles/${rol.id}`]);
  }

  viewRol(rol: Role) {
    this.router.navigate([`/admin/roles/ver/${rol.id}`]);
  }

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }
}
