import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordChangePopupComponent } from './password-change-popup/password-change-popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [UserDetailsComponent, PasswordChangePopupComponent],
  imports: [
    CommonModule,FormsModule,NgbModule
  ],
})
export class UserDetailsModule { }
