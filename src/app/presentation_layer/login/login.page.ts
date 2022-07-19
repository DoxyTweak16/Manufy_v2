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

  private loading : any = null;

  public loginErrMsg = "";
  public showSpinner = false;

  formLogin = this.fb.group({
    email : ['',  {
      validators: [Validators.required, Validators.email]
    }],
    password : ['',  [Validators.required, Validators.minLength(6)] ]
  });

  constructor(private fb : FormBuilder , private userService : UserService, private router: Router, private loadingCtrl : LoadingController, public toastController : ToastController) { 

  }

  ngOnInit() {

  }

  onSubmit() {

    if (this.formLogin.invalid) {
      this.loginErrMsg = "Invalid credentials."
      console.log("Form status is invalid. Check if fields are correctly filled.")
    } 
    else {
      this.showLoading()
      this.userService.login(this.formLogin.value)
      .then( response => {
        this.loading.dismiss();
        this.router.navigate(['/']);
      })
      .catch( error => {
        this.loading.dismiss();
        this.loginToast(error.message);
        console.log("Login error: ", error.message);
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

  async loginToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: "danger"
    });
    toast.present();
  }

  

}
