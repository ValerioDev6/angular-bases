import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AutoDestroyService } from '@core/services/utils/auto-desstroy.service';
import { CreateUserModalComponent } from 'src/app/routes/users/components/create-user-modal/create-user-modal.component';
import { SearchUserComponent } from 'src/app/routes/users/components/search-user/search-user.component';
import { UserTableComponent } from 'src/app/routes/users/components/user-table/user-table.component';
import {
  IUsersResponse,
  User,
} from 'src/app/routes/users/interfaces/users.interface';
import { UserService } from 'src/app/routes/users/services/user.service';
import { SwalService } from '@shared/swal.service';
import { takeUntil } from 'rxjs';
import { HasPermissionDirective } from '@core/directives/permission.directive';

@Component({
  selector: 'app-user-page',
  imports: [
    CommonModule,
    CreateUserModalComponent,
    UserTableComponent,
    SearchUserComponent,
    HasPermissionDirective,
  ],
  providers: [AutoDestroyService],
  templateUrl: './user-page.component.html',
  styles: `
  `,
})
export class UserPageComponent {
  private readonly deleteService = inject(SwalService);
  private readonly usersService = inject(UserService);

  showModal = signal<boolean>(false);

  users = this.usersService.users;
  isLoading = this.usersService.isLoading;
  total = this.usersService.totalCount;
  loading = signal(false);

  page = this.usersService.pageSignal;
  pageSize = this.usersService.limitSignal;

  // Métodos para actualizar parámetros
  pageChanged(newPage: number): void {
    this.usersService.pageSignal.set(newPage);
  }

  changePageSize(size: number): void {
    this.usersService.limitSignal.set(size);
    this.usersService.pageSignal.set(1);
  }

  onSearch(term: string): void {
    this.usersService.searchSignal.set(term);
    this.usersService.pageSignal.set(1);
  }
  refreshPage(): void {
    console.log('REFRESCANDO');
    this.usersService.reloadUsers();
  }

  deleteUser(user: User): void {
    this.deleteService
      .confirmDelete(
        `Este proceso no es reversible, está a punto de eliminar su categoría "${user.email}"`
      )
      .then((confirmed) => {
        if (confirmed) {
          this.loading.set(true); // Activamos el loading local

          this.usersService.deleteUserById(user.id).subscribe({
            next: () => {
              this.loading.set(false);
              this.refreshPage(); // Recargamos los datos después de eliminar
            },
            error: () => {
              this.loading.set(false);
            },
          });
        }
      });
  }

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }
}
