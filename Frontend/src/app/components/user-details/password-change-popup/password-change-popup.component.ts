import { Component, EventEmitter, Output } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { ToastrService } from "ngx-toastr";
import { StorageService } from "src/app/services/storage.service";
import { AuthService } from "src/app/services/auth.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-password-change-popup",
  templateUrl: "./password-change-popup.component.html",
  styleUrls: ["./password-change-popup.component.css"],
})
export class PasswordChangePopupComponent {
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  newPassword: any;
  oldPassword: any;
  confirmPassword: any;
  user: any;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  changePassword() {
    // Check if the new password and confirm password match
    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error("New password and repeat password does not match!");
      return;
    }
    // Call the user service to update the password
    this.userService
      .updatePassword(this.user._id, this.oldPassword, this.newPassword)
      .then((response: any) => {
        const currentUser = this.storageService.getUser();
        // Handle the response as needed
        if (response?.data.status == true) {
          if (currentUser.id == this.user._id) {
            this.logout();
          }
          this.toastr.success(response?.data?.message);
          this.onCancel();
        } else {
          this.toastr.error(response?.data?.message);
        }
      })
      .catch((err: any) => {
        // Handle the error as needed
        console.error(err);
      });
  }
  //logout
  logout(): void {
    this.authService
      .logout()
      .then((res) => {
        this.cookieService.delete("token");
        this.storageService.clean();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //cancel button
  onCancel() {
    this.cancel.emit();
  }
}
