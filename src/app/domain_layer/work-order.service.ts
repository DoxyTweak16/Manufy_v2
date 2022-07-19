import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WoRepoService } from '../data_access_layer/wo-repo.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  constructor(private wo_repo : WoRepoService, private userService : UserService) { }

  static asset_unavailability_check(hours : any, minutes : any) {

    //Se não for registada indisponibilidade, a mesma assume o valor "N/A" - Not assigned/Não atribuído
    if ( (hours === "" || hours === undefined) && (minutes === "" || minutes === undefined ) ) 
    {
      return "N/A";
    } 
    //Se só for especificado o campo minutes, o valor de horas é assumido como sendo 00
    else if((hours === "" || hours === undefined) && minutes != undefined) { 
      let h = "00";
      let m = (parseInt(minutes) < 10) ? ('0' + minutes) : (minutes);
      return h + "H" + m + "m";
    } 
    //Se só for especificado o campo hours, o valor de minutos é assumido como sendo 00
    else if(hours != undefined && (minutes === "" || minutes === undefined )) { 
      let h = (parseInt(hours) < 10) ? ('0' + hours) : (hours);
      let m = "00"
      return h + "H" + m + "m";
    } 
    //Ambos os campos foram preenchidos
    else {
      let h = (parseInt(hours) < 10)   ? ('0' + hours) : (hours);
      let m = (parseInt(minutes) < 10) ? ('0' + minutes) : (minutes);
      return h + "H" + m + "m";
    }
  }

  static labor_check(hours : any, minutes : any) {
    //NOTA IMPORTANTE: O documento de cada OT contém um field tipo map chamado 'labor'. 
    //Nesse field devem constar entries tipo: "jcruz": "00:30", "mjoaquim":"02:30"
    //Adicionar mão-de-obra ao objeto
 
    if ( (hours === "" || hours === undefined) && (minutes === "" || minutes === undefined ) ) 
    {
      throw Error("Labor, a mandatory field, was not entirely filled.");
    } 
    //Se só for especificado o campo minutes, o valor de horas é assumido como sendo 00
    if (parseInt(minutes) < 0 || parseInt(minutes) > 59) {
      throw Error("Invalid minutes value.");
    }
    else if((hours === "" || hours === undefined) && minutes != undefined) { 
        let h = "00";
        let m = (parseInt(minutes) < 10) ? ('0' + minutes) : (minutes);
        return h + "H" + m + "m";
    } 
    //Se só for especificado o campo hours, o valor de minutos é assumido como sendo 00
    else if(hours != undefined && (minutes === "" || minutes === undefined )) { 
        if (parseInt(hours) < 0) {
          throw Error("Invalid hours value.");
        }
        let h = (parseInt(hours) < 10) ? ('0' + hours) : (hours);
        let m = "00"
        return h + "H" + m + "m";
    } 
    //Ambos os campos foram preenchidos
    else {
      if (parseInt(hours) < 0) {
        throw Error("Invalid hours value.");
      }
      if (parseInt(minutes) < 0 || parseInt(minutes) > 59) {
        throw Error("Invalid minutes value.");
      }
      let h = (parseInt(hours) < 10)   ? ('0' + hours) : (hours);
      let m = (parseInt(minutes) < 10) ? ('0' + minutes) : (minutes);
      return h + "H" + m + "m";
    }
  }

  get_all_work_orders(queryString : string = '') {
    return this.wo_repo.getAll(queryString);
  }

  get_work_order(id : string) {
    return this.wo_repo.getWO(id);
  }

  woToInProgress(id : string) {
    let technician_username = this.userService.getCurrentUser();
    const newStatus = "In progress";
    this.wo_repo.updateWorkOrderStatus(id, {status: newStatus, owner: technician_username});
  }

  woToClosed(id: string, wo_data : any, technician_list : Array<string>) {

    //Check if summary was filled
    if (wo_data.maintenance_summary === '' ) {
      return Promise.reject(new Error("Maintenance summary, a mandatory field, was not filled."));
    }

    const closeWorkOrderData = {
      summary: wo_data.maintenance_summary,
      status: "Closed",
    };

    let labor = {};

    //Check if labor was filled
    if (technician_list.length === 0 ) {
      return Promise.reject(new Error("Labor, a mandatory field, was not filled."));
    } else {
      for (let username of technician_list) {
        console.log( wo_data[username + "_hours"] );
        console.log( wo_data[username + "_minutes"] );
  
        const h = wo_data[username + "_hours"];
        const m = wo_data[username + "_minutes"];

        try {
          labor[username] = WorkOrderService.labor_check(h, m);
        } catch (error) {
          return Promise.reject(error);
        }
  
      }
    }

    //Check if summary was filled. If yes, process it.
    closeWorkOrderData["asset_unavailability"] = WorkOrderService.asset_unavailability_check(wo_data.unavailabilityHours, wo_data.unavailabilityMinutes);
    
    
    closeWorkOrderData["labor"] = labor;
    return this.wo_repo.updateWorkOrderStatus(id, closeWorkOrderData);
  }

}
