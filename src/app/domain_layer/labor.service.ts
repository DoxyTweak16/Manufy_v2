import { Injectable } from '@angular/core';
import { LaborPicture } from '../data_access_layer/labor-picture';
import { LaborRepoService } from '../data_access_layer/labor-repo.service';

@Injectable({
  providedIn: 'root'
})
export class LaborService {

  constructor(private labor_repo : LaborRepoService) { }

  getAllTechnicians(queryString : string = '') {
    return this.labor_repo.getAllTechnicians(queryString);
  }

  getTechnicians(names : string[]) {
    return this.labor_repo.getTechnicians(names);
  }

  getTechnicianByUsername(username : string) {
    return this.labor_repo.getTechnicianByUsername(username);
   }

  getProfileImg(full_profile_img_path : any) {
    const img_path = full_profile_img_path.substr(full_profile_img_path.indexOf('technician'));
    return this.labor_repo.getProfileImg(img_path);
  }

  setLaborPictureDoc(id : string, labor_entry : any) {
    //O labor entry é do tipo [ {username1 : path1}, {username2 : path2, ...]
    let labor_entries = [];

    try {
      //for (let entry of labor_entry) {
      //  console.log("cona1: ", entry);
      //  let laborPicture : LaborPicture = {labor: entry }
      //  console.log("cona2: ", laborPicture);
      //  labor_entries.push(laborPicture);
      //}
      //this.labor_repo.setLaborPictureDoc(id, labor_entries);
      this.labor_repo.setLaborPictureDoc(id, labor_entry);
    } catch (error) {
      return Promise.reject(error);
    }

    return Promise.resolve();
    
    
  }

  getAllLaborPicture() {
    return this.labor_repo.getAllLaborPicture();
  }

}
