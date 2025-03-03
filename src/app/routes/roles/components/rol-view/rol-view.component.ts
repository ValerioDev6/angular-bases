import { JsonPipe } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoDestroyService } from '@core/services/utils/auto-desstroy.service';
import { IRolResponse } from '@modules/roles/interfaces/role.interface';
import { RolesService } from '@modules/roles/services/roles.service';
import { concatMap, map, Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rol-view',
  imports: [JsonPipe],
  providers: [AutoDestroyService],
  templateUrl: './rol-view.component.html',
  styles: ``,
})
export default class RolViewComponent implements OnInit {
  constructor(
    private $destroy: AutoDestroyService,
    private readonly route: ActivatedRoute,
    private readonly rolService: RolesService
  ) {}

  $rol: WritableSignal<IRolResponse | null> = signal(null);

  ngOnInit(): void {
    this.subscribeToRouteParams();
  }

  private subscribeToRouteParams(): void {
    this.route.params
      .pipe(
        map((params) => params['id']),
        concatMap((id) => this.getRole(id)),
        takeUntil(this.$destroy)
      )
      .subscribe({
        next: (role: IRolResponse) => {
          this.$rol.set(role);
        },
        error: (error) => {
          console.error('Error al cargar el rol:', error);
        },
      });
  }
  private getRole(id: number): Observable<IRolResponse> {
    return this.rolService.getRoleById(id);
  }
}
