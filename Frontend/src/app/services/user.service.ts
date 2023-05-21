import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";

import axios from "axios";

const API_URL = `${environment.apiUrl}/user/`;
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

@Injectable({
  providedIn: "root",
})
export class UserService {
  private photoUrlSubject = new BehaviorSubject<string>("");

  setPhotoUrl(url: string): void {
    this.photoUrlSubject.next(url);
  }
  getPhotoUrl(): BehaviorSubject<string> {
    return this.photoUrlSubject;
  }
  getAllUser(search: string, isActive: number): Promise<any> {
    const params = {
      search,
      isActive: isActive.toString(),
    };
    return axiosInstance.get("get", { params });
  }

  updateUser(userId: string, formValue: any): Promise<any> {
    const url = `${API_URL}update/${userId}`;
    return axiosInstance.put(url, formValue);
  }

  //update Password
  updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<any> {
    const updatedUser = { oldPassword: oldPassword, password: newPassword };
    return axiosInstance.put(`${API_URL}${userId}/password`, updatedUser);
  }
}
