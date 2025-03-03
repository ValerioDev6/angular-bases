import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PERMISOS_POR_MODULO } from '@core/constant/permission';
import { Permission } from 'src/app/routes/roles/interfaces/role.interface';
import { RolesService } from 'src/app/routes/roles/services/roles.service';
import { SnackBarService } from '@shared/notificacion.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-edit-role-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-role-page.component.html',
  styles: ``,
})
export default class EditRolePageComponent {
  private readonly roleService = inject(RolesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(SnackBarService);

  PERMISOS = PERMISOS_POR_MODULO;

  roleId = toSignal(
    this.route.params.pipe(map((params) => Number(params['id']))),
    { requireSync: true }
  );

  role = toSignal(this.roleService.getRoleById(this.roleId()), {
    initialValue: undefined,
  });

  loading = signal(false);
  error = signal<string | null>(null);

  roleForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    selectedPermissions: this.fb.array([]),
  });

  get selectedPermissionsArray(): FormArray {
    return this.roleForm.get('selectedPermissions') as FormArray;
  }

  constructor() {
    effect(() => {
      if (this.role()) {
        this.patchFormValues();
      }
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

  private patchFormValues(): void {
    const role = this.role();
    if (role) {
      this.roleForm.patchValue({
        name: role.name,
      });

      // Clear current permissions first
      while (this.selectedPermissionsArray.length) {
        this.selectedPermissionsArray.removeAt(0);
      }

      // Add each permission to the FormArray
      role.permissions.forEach((permission) => {
        this.selectedPermissionsArray.push(
          this.fb.group({
            permissionId: permission.id,
          })
        );
      });
    }
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.selectedPermissionsArray.controls.some(
      (control) => control.value.permissionId === permissionId
    );
  }

  onUpdateRole(): void {
    if (this.roleForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    this.loading.set(true);

    const formData = {
      name: this.roleForm.get('name')?.value,
      permissions: this.selectedPermissionsArray.value,
    };

    this.roleService.updatedRole(this.roleId(), formData).subscribe({
      next: () => {
        this.snackBar.showToast('Rol actualizado correctamente', 'success');
        this.router.navigate(['/roles/listado']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error.message);
        this.snackBar.showToast(`Error: ${err.error.message}`, 'error');
      },
      complete: () => this.loading.set(false),
    });
  }

  private markFormAsTouched(): void {
    Object.values(this.roleForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}

// export default class EditRolePageComponent implements OnInit, OnDestroy {
//   private readonly roleService = inject(RolesService);
//   private readonly router = inject(Router);
//   private readonly route = inject(ActivatedRoute);
//   private destroy$ = new Subject<void>();

//   role: IRolResponse | null = null;
//   loading = true;
//   error: string | null = null;

//   ngOnInit(): void {
//     this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
//       const id = params['id'];
//       this.loadRole(id);
//     });
//   }

//   private loadRole(id: string): void {
//     this.loading = true;
//     this.error = null;

//     this.roleService
//       .getRoleById(Number(id))
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (role) => {
//           this.role = role;
//           this.loading = false;
//         },
//         error: (err) => {
//           this.error = err.message;
//           this.loading = false;
//           this.router.navigate(['/admin/roles']);
//         },
//       });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
// }
