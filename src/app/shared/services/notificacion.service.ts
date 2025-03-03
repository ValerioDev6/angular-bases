import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private Toast = Swal.mixin({
    toast: true,
    icon: 'success',
    position: 'top-right',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  showToast(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) {
    this.Toast.fire({
      icon: type,
      title: message,
    });
  }
}
