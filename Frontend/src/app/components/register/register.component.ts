import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/model/user";
import { AuthService } from "src/app/services/auth.service";
import { StorageService } from "src/app/services/storage.service";
import { UserService } from "src/app/services/user.service";
import { SharedService } from "src/app/shared/shared.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSuccessful = false;
  @Output() statusSelected = new EventEmitter<string>();

  isSignUpFailed = false;
  errorMessage = "";
  userData: undefined | any;
  currentUser: any;
  fileName: any;
  selectedImage = "//ssl.gstatic.com/accounts/ui/avatar_2x.png";

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private sharedService: SharedService,
    private userService: UserService,
    private tostar: ToastrService
  ) {
    // Initialize the register form with form controls and validators
    this.registerForm = this.fb.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      profilePicture: [null],
      status: [false],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.minLength(8)],
    });
  }

  // Emit the selected status
  selectStatus(status: string) {
    this.statusSelected.emit(status);
  }

  // Select profile image
  selectImage() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  }

  // Handle profile image selection and set the image preview
  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    this.fileName = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    // Initialize component data
    this.userData = this.sharedService.userData;
    this.selectedImage =
      (this.userData && this.userData?.profilePicture) ||
      "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
    this.registerForm.patchValue(this.userData);
  }

  // Handle form submission
  onSubmit(): void {
    const user: User = this.registerForm.value;
    const formData: any = new FormData();
    formData.append("firstname", user.firstname);
    formData.append("lastname", user.lastname);
    formData.append("email", user.email);
    formData.append("file", this.fileName);
    formData.append("status", user.status.toString());
    if (!this.userData && !this.userData?._id) {
      // Register new user logic

      formData.append("password", user.password);
      this.authService
        .register(formData)
        .then((data) => {
          this.isSignUpFailed = false;
          if (data.data.status == true) {
            this.isSuccessful = true;
            this.tostar.success("User register successfully");
            this.router.navigate(["/"]);
          } else {
            this.tostar.error(data.data.message);
          }
        })
        .catch((err) => {
          this.tostar.error(err.error.message);
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        });
    } else {
      // Update existing user logic
      this.userService
        .updateUser(this.userData._id, formData)
        .then((data) => {
          if (data.data.status === true) {
            const currentUser = this.storageService.getUser();
            if (data.data.response._id === currentUser._id) {
              this.userService.setPhotoUrl(data.data.response.profilePicture);
              this.storageService.saveUser(data.data.response);
            }
          }
          this.tostar.success("User update successfully");
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.router.navigate(["/users"]);
        })
        .catch((err) => {
          this.tostar.error(err.error.message);
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        });
    }
  }
}
