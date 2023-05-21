import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { AthenticationGuard } from "./guard/athentication.guard";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { UserDetailsComponent } from "./components/user-details/user-details.component";

const routes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [AthenticationGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "users/edit/:id",
    canActivate: [AthenticationGuard],
    component: RegisterComponent,
  },

  {
    path: "users",
    component: UserDetailsComponent,
    canActivate: [AthenticationGuard],
  },
  { path: "", redirectTo: "login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
