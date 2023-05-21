import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import axios from "axios";

const AUTH_API = `${environment.apiUrl}/api/auth/`;

const axiosInstance = axios.create({
  baseURL: AUTH_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  },
});

@Injectable({
  providedIn: "root",
})
export class AuthService {
  /**
   * Login API
   * @param email The email of the user
   * @param password The password of the user
   * @returns A promise with the API response
   */
  login(email: string, password: string): Promise<any> {
    return axiosInstance.post("signin", { email, password });
  }

  /**
   * Register API
   * @param formValue The form data to be sent to the API
   * @returns A promise with the API response
   */
  register(formValue: any): Promise<any> {
    return axiosInstance.post("signup", formValue);
  }

  /**
   * Logout API
   * @returns A promise with the API response
   */
  logout(): Promise<any> {
    return axiosInstance.post("signout", {});
  }
}
