import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PERMISOS_POR_MODULO } from '@core/constant/permission';
import { RolesService } from 'src/app/routes/roles/services/roles.service';
import { SnackBarService } from '@shared/notificacion.service';

@Component({
  selector: 'app-create-rol-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-rol-modal.component.html',
  styles: `
  `,
})
export class CreateRolModalComponent {
  private readonly rolesService = inject(RolesService);
  private _snackService = inject(SnackBarService);
  loading = signal<boolean>(false);

  close = output();
  roleCreated = output<any>();

  PERMISOS = PERMISOS_POR_MODULO;

  private fb = inject(FormBuilder);
  roleForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    selectedPermissions: this.fb.array([]),
  });

  get selectedPermissionsArray(): FormArray {
    return this.roleForm.get('selectedPermissions') as FormArray;
  }

  private markFormTouched(): void {
    Object.values(this.roleForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  onPermissionChange(event: Event, permissionId: number): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.addPermission(permissionId);
    } else {
      this.removePermission(permissionId);
    }
  }

  private addPermission(permissionId: number): void {
    const exists = this.selectedPermissionsArray.controls.some(
      (control) => control.value.permissionId === permissionId
    );

    if (!exists) {
      this.selectedPermissionsArray.push(
        this.fb.group({
          permissionId: permissionId,
        })
      );
    }
  }

  private removePermission(permissionId: number): void {
    const index = this.selectedPermissionsArray.controls.findIndex(
      (control) => control.value.permissionId === permissionId
    );

    if (index >= 0) {
      this.selectedPermissionsArray.removeAt(index);
    }
  }

  onCreateRol(): void {
    if (this.roleForm.invalid) {
      this.markFormTouched();
      return;
    }

    this.loading.set(true);

    const rolData = {
      name: this.roleForm.get('name')?.value,
      permissions: this.selectedPermissionsArray.value,
    };

    this.rolesService.createRole(rolData).subscribe({
      next: (response) => {
        this.loading.set(false);
        this._snackService.showToast('Rol creado exitosamente');
        this.roleCreated.emit(response);
        this.close.emit();
      },
      error: (error) => {
        this.loading.set(false);
        this._snackService.showToast('Error al crear el rol');
        console.error(error);
      },
    });
  }
}
