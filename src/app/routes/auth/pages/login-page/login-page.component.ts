import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/common/auth.service';
import { SnackBarService } from '@shared/notificacion.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  hidePassword = true;
  private authService = inject(AuthService);
  private _snackService = inject(SnackBarService);

  loginForm = this.fb.nonNullable.group({
    email: ['admin@gmail.com', [Validators.required, Validators.email]],
    password: ['admin123', Validators.required],
    rememberMe: [false],
  });

  get email() {
    return this.loginForm.controls.email;
  }
  get password() {
    return this.loginForm.controls.password;
  }

  get rememberMe() {
    return this.loginForm.controls.rememberMe;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login Success', response);
          this._snackService.showToast(
            `Inicio de sesión exitoso para ${email}`,
            'success'
          );
        },
        error: (err) => {
          this._snackService.showToast(
            `Error al iniciar sesión: ${err.error.message}`,
            'error'
          );
        },
      });
    }
  }
}
