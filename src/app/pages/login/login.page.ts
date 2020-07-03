import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { Store } from 'src/app/service/store.service';
import * as firebase from "firebase";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public phone: string = '';

  recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  constructor(
    public userService: UserService,
    public router: Router,
    public store: Store
  ) { }

  ngOnInit() {
    this.initializeCaptcha();
  }

  initializeCaptcha() {
    setTimeout(() => {
      try {
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
        });
      }
      catch (err) {
        console.log(err.message);
      }
    }, 3000)
  }

  async onClickLogin() {
    var provider = new firebase.auth.PhoneAuthProvider();

    var res = await provider.verifyPhoneNumber(`+91${this.phone}`, this.recaptchaVerifier)
      .then((verificationId) => {
        var verificationCode = window.prompt('Please enter the verification ' +
          'code that was sent to your mobile device.');

        return firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      })
      .then((phoneCredential) => {
        return firebase.auth().signInWithCredential(phoneCredential);
      });

    await this.userService.checkAndRegisterUser({
      phone: res.user.phoneNumber,
      uid: res.user.uid,
      loginTime: new Date()
    }, res.user.uid);

    this.store.userUID = res.user.uid;
    this.router.navigate(['/home']);
  }

}
