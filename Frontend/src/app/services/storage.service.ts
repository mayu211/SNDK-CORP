import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private cookieService: CookieService) {}

  /**
   * Clears the session storage.
   */
  clean(): void {
    window.sessionStorage.clear();
  }

  /**
   * Saves the user object in the session storage.
   * @param user The user object to be saved.
   */
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Retrieves the user object from the session storage.
   * @returns The user object if found, or an empty object.
   */
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  /**
   * Checks if a user is logged in by checking the session storage.
   * @returns True if a user is logged in, false otherwise.
   */
  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

}
