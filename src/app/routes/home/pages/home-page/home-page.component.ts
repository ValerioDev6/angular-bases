import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICheckUserStatus } from '@core/interfaces/check-status-user.interface';
import { AuthService } from '@core/services/common/auth.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styles: ``,
})
export default class HomePageComponent {
  private readonly authService = inject(AuthService);

  user: Signal<ICheckUserStatus | undefined> = toSignal(
    this.authService.checkStatus(),
    {
      initialValue: undefined,
    }
  );
}
