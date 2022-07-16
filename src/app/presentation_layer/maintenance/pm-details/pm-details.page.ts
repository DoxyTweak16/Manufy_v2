import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PreventiveMaintenance } from 'src/app/data_access_layer/preventive-maintenance';
import { PreventiveMaintenanceService } from 'src/app/domain_layer/preventive-maintenance.service';

@Component({
  selector: 'app-pm-details',
  templateUrl: './pm-details.page.html',
  styleUrls: ['./pm-details.page.scss'],
})
export class PmDetailsPage implements OnInit {

  private pm_id : string;

  public preventive_maintenance : Observable<PreventiveMaintenance>;

  constructor(private activatedRoute : ActivatedRoute, private pmService : PreventiveMaintenanceService) { }

  ngOnInit() {
    this.pm_id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("Preventive Maintenance ID: ", this.pm_id);

    this.preventive_maintenance = this.pmService.getPM(this.pm_id).snapshotChanges().pipe(
      map(actions => {
        const id   = actions.payload.id;
        const data = actions.payload.data() as PreventiveMaintenance;
        return { id, ...data };
      })
    );

  }

}
