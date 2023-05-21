import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  @ViewChild('fileInput') fileInput: ElementRef | any;
  selectedFile: File | any;

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    if (
      this.currentUser.profilePicture == 'null' ||
      this.currentUser.profilePicture == null
    ) {
      this.currentUser.profilePicture = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
    }
  }

  onUpload() {
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('id', this.currentUser.id);
    this.http
      .post('http://localhost:8080/api/test/profileUpload', formData)
      .subscribe((response: any) => {
        if (response.status == true) {
          this.currentUser.profilePicture = response.profilePicture;
          this.userService.setPhotoUrl(this.currentUser.profilePicture);
          this.storageService.saveUser(this.currentUser);
        }
      });
  }
}
