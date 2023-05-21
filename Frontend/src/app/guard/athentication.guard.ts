import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AthenticationGuard implements CanActivate {
  isLoggedIn = false;
  private isLoggedInSubject = new Subject<boolean>();

  constructor(private afAuth: StorageService, private router: Router) { }

  // canActivate method to check if the user is authenticated
  canActivate(): boolean {
    if (!this.afAuth.isLoggedIn()) {
      // If the user is not logged in, navigate to the login page
      this.router.navigate(['/login']);
      this.isLoggedIn = false;
      this.isLoggedInSubject.next(false);

      return false;
    }

    // If the user is logged in, set isLoggedIn to true and emit the value through the subject
    this.isLoggedInSubject.next(true);
    this.isLoggedIn = true;
    return true;
  }

  // Getter for isLoggedIn observable
  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
}
