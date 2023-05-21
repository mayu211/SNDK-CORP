import { Component } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { PasswordChangePopupComponent } from "./password-change-popup/password-change-popup.component";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent {
  users: any[] = [];
  filterOption = 2;
  searchQuery = "";
  userData: any;
  private modalRef: NgbModalRef | undefined;

  constructor(
    private userService: UserService,
    private router: Router,
    private sharedService: SharedService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.fetchUsers();
  }

  //Get User List
  fetchUsers() {
    this.userService.getAllUser(this.searchQuery, this.filterOption)
      .then((data: any) => {
        this.users = data.data.userData;
      })
      .catch((error: any) => {
        console.error("Error fetching users:", error);
      });

  }

  //close Password Popup
  cancelPasswordChange() {
    if (this.modalRef) {
      this.modalRef.dismiss(); // Close the modal
    }
  }

  //Password Popup 
  openPasswordPopup(user: any) {
    this.modalRef = this.modalService.open(PasswordChangePopupComponent, {
      backdrop: false
    });
    this.modalRef.componentInstance.cancel.subscribe(() => {
      this.cancelPasswordChange();
    });
    this.modalRef.componentInstance.user = user;
  }

  //edit User
  editUser(user: any) {
    this.sharedService.userData = user;
    this.router.navigate(["/users/edit/" + this.sharedService.userData._id]);
  }
}
