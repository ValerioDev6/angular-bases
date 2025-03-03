import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from 'src/app/routes/roles/interfaces/roles.interface';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-rol-table',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './rol-table.component.html',
  styles: ``,
})
export class RolTableComponent {
  roles = input.required<Role[]>({ alias: 'roles' });
  total = input.required<number>();
  pageSize = input.required<number>();
  page = input<number>();
  loading = input<boolean>();

  pageChanged = output<number>();
  changePageSize = output<number>();
  deleteRol = output<any>();
  editRol = output<any>();
  viewRol = output<any>();

  onPageChange(event: number) {
    this.pageChanged.emit(event);
  }

  onChangePageSize(event: any) {
    this.changePageSize.emit(event.target.value);
  }

  onDeleteRol(rol: any) {
    this.deleteRol.emit(rol);
  }

  onEditRol(rol: any) {
    this.editRol.emit(rol);
  }

  onViewRol(rol: any) {
    this.viewRol.emit(rol);
  }
}
