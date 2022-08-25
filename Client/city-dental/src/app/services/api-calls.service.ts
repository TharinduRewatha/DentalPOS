import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoadingController,AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


//MODALS
export class appointment {
  name: string;
  mnumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  appointmentsEndpoint = 'http://localhost:8096/api/item/';

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

  getAppointments(): Observable<any> {
    return this.httpClient.get(this.appointmentsEndpoint)
  }

  createAppointment(item: appointment): Observable<any> {
    return this.httpClient.post<appointment>(this.appointmentsEndpoint, JSON.stringify(item), this.httpOptions)
  }

  
}
