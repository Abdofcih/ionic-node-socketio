import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }
  submitLogin(lF){
    const value = lF.value;
    console.log(value)
    this.authService.login(value.username,value.room)
  }
}
