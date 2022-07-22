import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PreventiveMaintenance } from 'src/app/data_access_layer/preventive-maintenance';
import { PreventiveMaintenanceService } from 'src/app/domain_layer/preventive-maintenance.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.scss'],
})
export class MaintenancePage implements OnInit {

  public selectedSegment = "monthly"; 

  public selectedDay   = new Date().getDate();
  public selectedMonth = new Date().getMonth() + 1;
  public selectedYear = new Date().getFullYear(); 

  public monthlyPM : Observable<PreventiveMaintenance[]>;
  public dailyPM   : Observable<PreventiveMaintenance[]>;

  constructor(private pmService : PreventiveMaintenanceService ) { }

  ngOnInit() {  
    this.getMaintenanceListByMonth();
    this.getMaintenanceByDay();
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value;
    console.log("Segment changed ", ev.detail.value);
    console.log("Year: ");
  }

  selectDate(ev: any) {
    const selectedDate = new Date(ev.detail.value);

    this.selectedDay   =  selectedDate.getDate();
    this.selectedMonth =  selectedDate.getMonth()+1;
    this.selectedYear  =  selectedDate.getFullYear();
    
    this.getMaintenanceListByMonth();
    this.getMaintenanceByDay();

  }

  getMaintenanceListByMonth() {
    this.monthlyPM = this.pmService.getMaintenanceByMonth(this.selectedMonth, this.selectedYear).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as PreventiveMaintenance;

        data.start_date = data.start_date.toDate();
        data.due_date   = data.due_date.toDate();

        return { $key, ...data };
      }))
    );
  }

  getMaintenanceByDay() {
    this.dailyPM = this.pmService.getMaintenanceListByDay(this.selectedDay, this.selectedMonth, this.selectedYear).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as PreventiveMaintenance;

        data.start_date = data.start_date.toDate();
        data.due_date   = data.due_date.toDate();

        return { $key, ...data };
      }))
    );
  }

}
