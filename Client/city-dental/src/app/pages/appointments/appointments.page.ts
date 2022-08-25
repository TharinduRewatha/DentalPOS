import { Component, OnInit,ViewChild,LOCALE_ID, Inject } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { AlertController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { CalModalPage } from '../modals/cal-modal/cal-modal.page';
import { ApiCallsService, appointment } from 'src/app/services/api-calls.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
  eventSource = [];
  viewTitle: string;

  calendar = {
    mode: "month",
    currentDate: new Date(),
  };

  selectedDate: Date;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  //Api related variable
  returnedAppointments = [];

  _appointment:appointment = {
    patName:"",
    phoneNumber:"",
    date:""
  }
  //end

  constructor(
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private modalCtrl: ModalController,
    public apicalls: ApiCallsService,
  ) {}

  ngOnInit() {
    this.getAppointments();
  }

  //API calls service region

  getAppointments(){
    this.apicalls.getAppointments()
      .subscribe(
        (response) => {
          this.returnedAppointments = response;
          console.log(this.returnedAppointments);
        },
        (error) => {
          console.error('Request failed with error');
        });
  }

  createAppointment(patName:string,mobile:string,date:string){
    this._appointment.patName = patName;
    this._appointment.phoneNumber = mobile;
    this._appointment.date = date;

    this.apicalls.createAppointment(this._appointment)
      .subscribe(
        (response) => {                         
          console.log(response);
        },
        (error) => {          
          console.error('Request failed with error');
        })
  }

  //End region

  // Change current month/week/day
  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title: string) {
    this.viewTitle = title;
  }

  // Calendar event was clicked
  async onEventSelected(event: { startTime: string | number | Date; endTime: string | number | Date; title: any; desc: any; }) {
    // Use Angular date pipe for conversion
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK'],
    });
    alert.present();
  }



  removeEvents() {
    this.eventSource = [];
  }

  async openCalModal() {
    const modal = await this.modalCtrl.create({
      component: CalModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: false
    });
   
    await modal.present();
   
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        this.eventSource.push({
          title: result.data.event.patName,
          startTime: result.data.event.startTime,
          endTime: result.data.event.endTime,
          allDay: false,
        });
        this.createAppointment(result.data.event.patName,result.data.event.phoneNumber,result.data.event.date);
        this.myCal.loadEvents();
      }
    });
  }

}
