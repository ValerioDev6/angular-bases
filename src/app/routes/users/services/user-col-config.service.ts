import { Injectable } from '@angular/core';

import { ColDef } from 'ag-grid-community';

@Injectable({
  providedIn: 'root',
})
export class UserColConfigService {
  usersColumns: ColDef[] = [
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
    },
  ];
  constructor() {}
}
