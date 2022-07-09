import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth : AngularFireAuth, private router : Router) { }

  login( { email, password}: any ) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut().then( response => {
      this.router.navigate(['/login']);
    })
    .catch( error => {
      console.log("Logout error: ", error.message);
    });
  }

}
