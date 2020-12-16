import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/core';
import { Error } from '@app/core/models/error.model';

@Component({
  selector: 'ec-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input()
  public user: User;
  @Input()
  public error: Error;
  @Input()
  public userSpecializations: string[];
  @Output()
  public save: EventEmitter<User> = new EventEmitter();
  @Output()
  public cancel: EventEmitter<void> = new EventEmitter();

  public userForm = new FormGroup({
    lastName: new FormControl('', [Validators.required, Validators.max(40)]),
    firstName: new FormControl('', [Validators.required, Validators.max(40)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^((\\+4)|0)?[0-9]{10}$')]),
    district: new FormControl('', [Validators.required, Validators.max(40)]),
    organisation: new FormControl('', [Validators.required, Validators.max(40)]),
    specialization: new FormControl('', [])
  });

  ngOnInit(): void {
    this.userForm.patchValue(this.user.toFormData());
  }

  public generateErrorMessage(field: string) {
    const errors = this.userForm.controls[field].errors;
    return Object.keys(errors)[0];
  }

  public onSave() {
    const editedUser = new User();
    editedUser.id = this.user.id;
    editedUser.fromFormData(this.userForm.value);
    this.save.emit(editedUser);
    this.userForm.controls.email.markAsTouched();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['error']) {
      Object.keys(this.error).forEach(field => {
        this.addFieldError(field);
      });
    }
  }

  public addFieldError(field) {
    if (this.hasField(field)) {
      const error = this.generateError(field);
      this.userForm.controls[field].setErrors(error);
    }
  }

  public hasField(field) {
    return this.userForm.controls[field];
  }

  public onCancel() {
    this.cancel.emit();
  }

  private generateError(field) {
    const errorKey = {};
    errorKey[this.getErrorKey(field)] = true;
    return errorKey;
  }

  private getErrorKey(field) {
    if (this.error[field]) {
      return this.error[field]['i18nErrorKey'];
    }
  }

  public isValidClass(control: AbstractControl) {
    return control.errors && control.touched ? 'input-group-invalid' : '';
  }
}
