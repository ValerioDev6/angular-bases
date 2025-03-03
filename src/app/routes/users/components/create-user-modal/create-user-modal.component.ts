import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ICreateUser } from 'src/app/routes/users/interfaces/create-user.interface';
import { IRolesCombo } from 'src/app/routes/users/interfaces/role-combo.interface';
import { UserService } from 'src/app/routes/users/services/user.service';
import { SnackBarService } from '@shared/notificacion.service';
import {
  catchError,
  EMPTY,
  exhaustMap,
  filter,
  finalize,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AutoDestroyService } from '@core/services/utils/auto-desstroy.service';

@Component({
  selector: 'app-create-user-modal',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create-user-modal.component.html',
  styles: `
  `,
})
export class CreateUserModalComponent implements OnInit {
  private readonly userService = inject(UserService);
  private _snackService = inject(SnackBarService);
  private readonly $destroy = inject(AutoDestroyService);
  // private readonly $destoy = takeUntilDestroyed();
  submit$: Subject<void> = new Subject<void>();

  @Output() close = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<ICreateUser>();

  roles: Signal<IRolesCombo[] | undefined> = toSignal(
    this.userService.getRolesCombo(),
    {
      initialValue: [] as IRolesCombo[],
    }
  );

  closeModal(): void {
    this.close.emit();
  }
  loading = signal<boolean>(false);

  private fb = inject(FormBuilder);

  userForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roleId: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this.subscribeToSubmit();
  }

  subscribeToSubmit(): void {
    this.submit$
      .pipe(
        filter(() => this.userForm.valid),
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.userService.createUser(this.userForm.value).pipe(
            catchError((err) => {
              this._snackService.showToast(
                err.error.message || 'Error',
                'error'
              );
              this.loading.set(false);
              return EMPTY;
            })
          )
        ),
        takeUntil(this.$destroy)
      )
      .subscribe({
        next: () => {
          this.userCreated.emit();
          this.closeModal();
          this.userForm.reset();
          this._snackService.showToast('Usuario creado', 'success');
        },
        error: (err) => console.error('Error inesperado', err), // Solo para errores no manejados
      });
  }
  // saveUser(): void {
  //   if (this.userForm.invalid) {
  //     this.markFormTouched();
  //     return;
  //   }

  //   this.loading.set(true);

  //   const userData: ICreateUser = this.userForm.value;
  //   this.userService
  //     .createUser(userData)
  //     .pipe(
  //       takeUntilDestroyed(this.destroyRef),
  //       finalize(() => this.loading.set(false))
  //     )
  //     .subscribe({
  //       next: () => {
  //         this.userCreated.emit();
  //         this.closeModal();
  //         this.userForm.reset();
  //         this._snackService.showToast(
  //           `Usuario creado exitsosamente`,
  //           'success'
  //         );
  //       },
  //       error: (err) => {
  //         this._snackService.showToast(`${err.error.message}`, 'error');
  //         console.log(err.message || 'errror alc read usuario ');
  //         // this.errorMessage.set(err.message || 'Error al crear usuario');
  //       },
  //     });
  // }
}
