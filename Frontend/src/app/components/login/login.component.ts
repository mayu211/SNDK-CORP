import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = "";
  isLoggedIn = false;
  isLoginFailed = false;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private tostar: ToastrService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then((data) => {
          this.storageService.saveUser(data.data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.tostar.success("User login successfully!!");
          this.router.navigateByUrl("/home");
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
          this.isLoginFailed = true;
        });
    } else {
      console.log("show error");
    }
  }
}
