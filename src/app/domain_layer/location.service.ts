import { Injectable } from '@angular/core';
import { LocationRepoService } from '../data_access_layer/location-repo.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private location_repo : LocationRepoService) { }

  getAllLocations(queryString : string = '') {
    return this.location_repo.getAllLocations(queryString);
  }

  getLocation(id : string) {
    return this.location_repo.getLocation(id);
  }

}
