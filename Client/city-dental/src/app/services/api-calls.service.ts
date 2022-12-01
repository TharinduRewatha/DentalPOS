import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoadingController,AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { json } from 'express';


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

export class loginData {
  username:string;
  password:string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  appointmentsEndpoint = 'http://localhost:8096/api/appointment/';
  smsEndpoint = 'https://app.notify.lk/api/v1/send?user_id=23335&api_key=R2vtYcOYv5DkMzXYb8gT&sender_id=CITY DENTAL&to' //=[Phone number]&message=[Messsege]
  loginEndpoint = 'http://localhost:8096/api/auth/signin/';

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

  getAppointmentByDate(dateOne,dateTwo): Observable<any> {
    return this.httpClient.get(this.appointmentsEndpoint + "appbydate/" + dateOne.slice(1,-1).trim() + "/" + dateTwo.slice(1,-1).trim())
  }

  createAppointment(appointment: appointment): Observable<any> {
    return this.httpClient.post<appointment>(this.appointmentsEndpoint, JSON.stringify(appointment), this.httpOptions)
  }

  updateAppointment(id,amount): Observable<any> {
    return this.httpClient.put(this.appointmentsEndpoint +  "updateattend/" + id.replace(/\s/g, '') + "/" + amount, this.httpOptions)
  }

  sendSMS(phonenumber:any,msg:any): Observable<any> {
    return this.httpClient.get(this.smsEndpoint+ "=" + phonenumber + "&message=" + msg)
  }

  login(data: loginData): Observable<any> {
    return this.httpClient.post<loginData>(this.loginEndpoint, JSON.stringify(data), this.httpOptions)
  }



  
}
