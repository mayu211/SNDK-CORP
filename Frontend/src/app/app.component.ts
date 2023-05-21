import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { StorageService } from "./services/storage.service";
import { AuthService } from "./services/auth.service";
import { EventBusService } from "./shared/event-bus.service";
import { Router } from "@angular/router";
import { AthenticationGuard } from "./guard/athentication.guard";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  eventBusSub?: Subscription;
  userProfile?: string;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private gurd: AthenticationGuard,
    private cookieService: CookieService,
    private eventBusService: EventBusService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in
    this.isLoggedIn = this.storageService.isLoggedIn();

    // Subscribe to isLoggedIn$ subject from the guard to get login status changes
    this.gurd.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;

      // Get the user object from storage
      const user = this.storageService.getUser();

      // Fetch user profile picture URL using UserService
      this.userService.getPhotoUrl().subscribe((url: string) => {
        this.userProfile = url;
      });

      // Set the user profile picture based on the user's profilePicture property
      if (!user.profilePicture) {
        this.userProfile = "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
      } else {
        this.userProfile = user.profilePicture;
      }
    });

    // Subscribe to the 'logout' event from the EventBusService
    this.eventBusSub = this.eventBusService.on("logout", () => {
      this.logout();
    });
  }

  // Logout function
  logout(): void {
    this.authService
      .logout()
      .then(() => {
        this.cookieService.delete("jwt-token");
        this.storageService.clean();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the eventBusSub subscription to avoid memory leaks
    this.eventBusSub?.unsubscribe();
  }
}
