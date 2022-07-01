import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.scss'],
})
export class MaintenancePage implements OnInit {

  public selectedSegment = "monthly"; 

  constructor() { }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value;
    console.log("Segment changed ", ev.detail.value);
  }

}
