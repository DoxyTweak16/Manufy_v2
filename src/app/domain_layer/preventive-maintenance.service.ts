import { Injectable } from '@angular/core';
import { PmRepoService } from '../data_access_layer/pm-repo.service';
import { WorkOrderService } from './work-order.service';

@Injectable({
  providedIn: 'root'
})
export class PreventiveMaintenanceService {

  constructor(private pmRepo : PmRepoService) { }

  //getMaintenanceListByDate(selectedDate : Date) {
  // return this.pmRepo.getMaintenanceListByDate(selectedDate);
  //}

  getMaintenanceByMonth(month, year) {
    return this.pmRepo.getMaintenanceByMonth(month, year);
  }

  getMaintenanceListByDay(day, month, year) {
    return this.pmRepo.getMaintenanceListByDay(day, month, year);
  }

  getPM(pm_id) {
    return this.pmRepo.getPM(pm_id);
  }

  startPM(pm_id) {
    const newStatus = "In progress";
    this.pmRepo.updateMaintenance(pm_id, {status: newStatus});
  }

  async closePM(pm_id, procedure, pm_input_data, technician_list : Array<string>) {

    const closeWorkOrderData = {
      summary: pm_input_data.maintenance_summary,
      status: "Closed",
    };

    //O objeto procedure contém todos os passos do PM com o respetivo estado atual - true (feito) ou false (por fazer).
    //Este objeto será atualizado a partir dos valores obtidos no formulário - pm_input_data.

    for (const property in pm_input_data) { //Para cada input do formulário...
      
      //Verificar se o mesmo se trata de um passo do PM.
      //No form html, cada step do procedure começa por "p_" para ser facilmente identificado. Ex.: {"p_Battery charger": false}
      if ( property.startsWith("p_") ) { 

        const p = property.substring(2); //p constitui um passo do PM

        //Ir ao objeto procedure, achar o passo p e atribuir o valor que consta no objeto pm_input_data, composto pelos valores inseridos formulário
        for (let i = 0; i < procedure.length; i++) {
          if (p === Object.keys(procedure[i])[0]) {
          const procedure_step_state = pm_input_data[property]
          if (!procedure_step_state) {
            return Promise.reject(new Error(p + " not checked."));
          }
          procedure[i][p] = procedure_step_state;
          }
        }
      }
    }


    //Check if summary was filled
    if (pm_input_data.maintenance_summary === '' || pm_input_data.maintenance_summary === undefined || pm_input_data.maintenance_summary === null ) {
      return Promise.reject(new Error("Maintenance summary, a mandatory field, was not filled."));
    }

    
    //Check if labor was filled
    let labor = {};

    if (technician_list.length === 0 ) {
      return Promise.reject(new Error("Labor, a mandatory field, was not filled."));
    } else {
      for (let username of technician_list) {
        console.log( pm_input_data[username + "_hours"] );
        console.log( pm_input_data[username + "_minutes"] );
  
        const h = pm_input_data[username + "_hours"];
        const m = pm_input_data[username + "_minutes"];

        try {
          console.log(username + " | h: " + h + " | m: ", m);
          labor[username] = WorkOrderService.labor_check(h, m);
        } catch (error) {
          return Promise.reject(error);
        }
  
      }
    }
                                  
    const pm_data = {};  
    pm_data["status"] = "Closed";
    pm_data["summary"] = pm_input_data["maintenance_summary"];
    pm_data["procedure"] = procedure;
    pm_data["labor"] = labor;
    this.pmRepo.updateMaintenance(pm_id, pm_data);
    
  }
  
}
