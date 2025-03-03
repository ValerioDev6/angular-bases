import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-table',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './user-table.component.html',
  styles: ``,
})
export class UserTableComponent {
  @Input() users: any[] = [];
  @Input() total!: number;
  @Input() pageSize!: number;
  @Input() page!: number;
  @Input() loading!: boolean;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() changePageSize = new EventEmitter<number>();
  @Output() deleteUser = new EventEmitter<any>();

  onPageChange(event: number) {
    this.pageChanged.emit(event);
  }

  onChangePageSize(event: any) {
    this.changePageSize.emit(event.target.value);
  }

  onDeleteUser(user: any) {
    this.deleteUser.emit(user);
  }
}
