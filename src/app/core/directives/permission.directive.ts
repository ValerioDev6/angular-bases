import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  Permission,
  PermissionService,
} from '@core/services/common/permission.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit {
  @Input('hasPermission') permission!: Permission;
  @Input('hasPermissionMode') mode: 'single' | 'any' | 'all' = 'single';
  @Input('hasPermissionElse') elseTemplate?: TemplateRef<any>;
  @Input('hasPermissionMultiple') permissions: Permission[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.applyPermissionCheck();
  }

  private applyPermissionCheck(): void {
    this.viewContainerRef.clear();

    let hasAccess = false;

    if (this.mode === 'single' && this.permission) {
      hasAccess = this.permissionService.hasPermission(this.permission);
    } else if (this.mode === 'any' && this.permissions.length > 0) {
      hasAccess = this.permissionService.hasAnyPermission(this.permissions);
    } else if (this.mode === 'all' && this.permissions.length > 0) {
      hasAccess = this.permissionService.hasAllPermissions(this.permissions);
    }

    if (hasAccess) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else if (this.elseTemplate) {
      this.viewContainerRef.createEmbeddedView(this.elseTemplate);
    }
  }
}
