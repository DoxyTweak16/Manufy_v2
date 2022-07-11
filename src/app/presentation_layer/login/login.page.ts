import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/domain_layer/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginErrMsg = "";

  public showSpinner = false;

  formLogin = this.fb.group({
    email : ['',  {
      validators: [Validators.required, Validators.email]
    }],
    password : ['',  [Validators.required, Validators.minLength(6)] ]
  });

  constructor(private fb : FormBuilder , private userService : UserService, private router: Router) { 

  }

  ngOnInit() {

  }

  onSubmit() {

    if (this.formLogin.invalid) {
      this.loginErrMsg = "Invalid credentials."
      console.log("Form status is invalid. Check if fields are correctly filled.")
    } 
    else {
      this.showSpinner = true;
      this.userService.login(this.formLogin.value)
      .then( response => {
        this.showSpinner = false;
        this.router.navigate(['/']);
      })
      .catch( error => {
        this.showSpinner = false;
        console.log("Login error: ", error.message);
      });

    }

  }

  

}
