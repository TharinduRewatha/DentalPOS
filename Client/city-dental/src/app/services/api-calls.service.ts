import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoadingController,AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


//MODALS
export class appointment {
  patName: string;
  phoneNumber: string;
  date: string;
  doctor: string;
  nic :string;
  address :string;
  treatment :string;
  amount : number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  appointmentsEndpoint = 'http://localhost:8096/api/appointment/';
  smsEndpoint = 'https://app.notify.lk/api/v1/send?user_id=23335&api_key=R2vtYcOYv5DkMzXYb8gT&sender_id=NotifyDEMO&to' //=[Phone number]&message=[Messsege]

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private httpClient: HttpClient,
    public loadingController:LoadingController,
    public alertcontroller:AlertController,
    private router:Router,
    private location: Location
  ) { }

  //General components region
  async presentLoading(messageLoading) {
    const loading = await this.loadingController.create({
      message: messageLoading,
      duration: 1000
    });
    await loading.present();
  }

  async presentAlert(message:string){
    const alert = await this.alertcontroller.create({
      message : message,
      buttons : ['ok']
    });

    await alert.present();
  }
  //End region

  getAppointments(): Observable<any> {
    return this.httpClient.get(this.appointmentsEndpoint+"all")
  }

  getAppointmentByDate(date): Observable<any> {
    return this.httpClient.get(this.appointmentsEndpoint + "appbydate/" + date.slice(1,-1).trim())
  }

  createAppointment(appointment: appointment): Observable<any> {
    return this.httpClient.post<appointment>(this.appointmentsEndpoint, JSON.stringify(appointment), this.httpOptions)
  }

  updateAppointment(id): Observable<any> {
    return this.httpClient.put(this.appointmentsEndpoint + id.replace(/\s/g, '') + "/updateattend", this.httpOptions)
  }

  sendSMS(phonenumber:any,msg:any): Observable<any> {
    return this.httpClient.get(this.smsEndpoint+ "=" + phonenumber + "&message=" + msg)
  }

  
}
