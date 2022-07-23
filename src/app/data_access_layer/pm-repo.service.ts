import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PreventiveMaintenance } from './preventive-maintenance';

@Injectable({
  providedIn: 'root'
})
export class PmRepoService {

  constructor(private afs : AngularFirestore) { }

  //getMaintenanceListByDate(selectedDate : Date) {
  // 
  //}

  getMaintenanceByMonth(month, year) {
    return this.afs.collection<PreventiveMaintenance>('preventive_maintenance', ref => ref
      .where('start_date', ">=", new Date(year, month-1) ) 
      .where('start_date', "<=", new Date(year, month) ) 
      );
  }

  getMaintenanceListByDay(day, month, year) {
    console.log("d/m/y", day, month, year);
    return this.afs.collection<PreventiveMaintenance>('preventive_maintenance', ref => ref
    .where('start_date', ">=", new Date(year, month-1, day) ) 
    .where('start_date', "<=", new Date(year, month-1, day+1) ) 
    );
  }

  getPM(pm_id) {
    return this.afs.doc<PreventiveMaintenance>(`preventive_maintenance/${pm_id}`);
  }

  updateMaintenance(pm_id, changes) {
    this.afs.doc(`preventive_maintenance/${pm_id}`).update(changes);
  }

}
