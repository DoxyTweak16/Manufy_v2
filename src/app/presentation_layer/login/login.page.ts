import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/domain_layer/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private loading : any;

  public loginErrMsg = "";
  public showSpinner = false;
  public showPwd = false;
  public pwdIcon = "eye";

  public formLogin = this.fb.group({
    email : ['',  {
      validators: [Validators.required, Validators.email]
    }],
    password : ['',  [Validators.required, Validators.minLength(6)] ]
  });

  constructor(private fb : FormBuilder , private userService : UserService, private router: Router, private loadingCtrl : LoadingController, public toastController : ToastController) { 

  }

  ngOnInit() {

  }

  togglePwd() {
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? "eye-off" : "eye";
  }

  async onSubmit() {

    if (this.formLogin.invalid) {
      this.loginErrMsg = "Invalid credentials."
      console.log("Form status is invalid. Check if fields are correctly filled.")
    } 
    else {
      await this.showLoading()
      this.userService.login(this.formLogin.value)
      .then( response => {
        this.loading.dismiss();
        this.router.navigate(['/']);
      })
      .catch( error => {
        let errorCode = error.code;
        let errorMessage = error.message;

        this.loading.dismiss();

        if (errorCode === 'auth/wrong-password') {
          this.loginToast("Wrong password. Please try again.", "danger");
        } else {
          this.loginToast(errorMessage, "danger");
        }

      });

    }

  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Signing in...",
      spinner: 'crescent'
    });
    this.loading.present();
  }

  async loginToast(msg : string, color = "secondary") {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: color
    });
    toast.present();
  }

  

}
