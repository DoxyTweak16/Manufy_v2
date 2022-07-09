import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/domain_layer/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private userService : UserService) { }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
  }

}
