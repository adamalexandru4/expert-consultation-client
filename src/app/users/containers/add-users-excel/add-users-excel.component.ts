import { Component } from '@angular/core';
import * as fromStore from '@app/core/store';
import { CoreState } from '@app/core/store';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ec-import-excel',
  templateUrl: './add-users-excel.component.html',
})
export class AddUsersExcelComponent {
  private excelContent = '';

  constructor(private router: Router,
              private store: Store<CoreState>) {
  }

  public onContentUpdate(excelUsers: string) {
    this.excelContent = excelUsers;
  }

  public onSave() {
    this.store.dispatch(new fromStore.SaveUsersExcel(this.excelContent));
  }

  public onCancel() {
    this.router.navigate(['/users']);
  }

  public isContentFilled() {
    return this.excelContent && this.excelContent.length > 0 ? true : false;
  }
}
