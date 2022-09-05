import { Component, OnInit,ViewChild,LOCALE_ID, Inject } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { AlertController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { CalModalPage } from '../modals/cal-modal/cal-modal.page';
import { ApiCallsService, appointment, loginData } from 'src/app/services/api-calls.service';
import { CalendarMode } from 'ionic2-calendar/calendar';
import * as e from 'express';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
  eventSource = [];
  viewTitle: string;

  calendar = {
    mode: "month" as CalendarMode,
    currentDate: new Date(),
  };

  selectedDate: Date;
  alldayLabel:any = ""

  filterTerm:any = ""
  filterTermTodays:any = ""

  isMobile:boolean = false;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  //Api related variable
  returnedAppointments = [];
  _returnedAppointmentsToday = [];
 // _returnedAppointmentsByDate = [];

  today = new Date();
  yesterday = new Date(this.today)

  _appointment:appointment = {
    patName:"",
    phoneNumber:"",
    date:"",
    doctor:"",
    nic:"",
    address:"",
    treatment:"",
    amount:0
  }

  _loginData:loginData = {
    username: "",
    password:""
  }

  isLoggedIn:boolean = false;
  username:string =  "admin" //temporary
  pwd:string = "12345" //temporary
  //end

  constructor(
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private modalCtrl: ModalController,
    public apicalls: ApiCallsService,
  ) {}

  ngOnInit() {
    //this.getAppointments();
    this.today.setHours(24,0,0,0);
    //this.getAppointmentToday(JSON.stringify(this.today));

    if(window.screen.width <= 700){
      this.isMobile = true;
    }
  }

  //API calls service region

  getAppointments(){
    this.apicalls.presentLoading("Loading");
    this.apicalls.getAppointments()
      .subscribe(
        (response) => {
          this.eventSource = [];
          this.returnedAppointments = response;
          
          this.returnedAppointments.forEach(e => {
            const date = new Date(e.date);
            let startTime: Date;
            let endTime: Date;
            let startMinute = date.getHours() * 60;
            let endMinute = 30 + startMinute;
            startTime = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              0,
              date.getMinutes() + startMinute
            );
            endTime = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              0,
              date.getMinutes() + endMinute
          );
           
           this.eventSource.push({
              title: e.patName,
              startTime: startTime,
              endTime: endTime,
              allDay: false,
              desc:e.phoneNumber + " | " + e.doctor + " | " + e.aId  + " | " + e.attended + " | " + e.nic + " | " + e.address + " | " + e.treatment + " | " + e.amount
            }); 
          });
          this.myCal.loadEvents();
          this.apicalls.loadingController.getTop().then(v => v ? this.apicalls.loadingController.dismiss() : null);
        },
        (error) => {
          console.error('Request failed with error');
        });
  }

  getAppointmentToday(today){
    this.yesterday.setHours(0,0,0,0);
    this.apicalls.getAppointmentByDate(JSON.stringify(this.yesterday),today)
    .subscribe(
      (response) => {
        this._returnedAppointmentsToday = [];
        response.forEach(e => {
          const date = new Date(e.date);
          let startTime: Date;
          let endTime: Date;
          let startMinute = date.getHours() * 60;
          let endMinute = 30 + startMinute;
          startTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            date.getMinutes() + startMinute
          );
          endTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            date.getMinutes() + endMinute
        );
         
         this._returnedAppointmentsToday.push({
            title: e.patName,
            startTime: startTime,
            endTime: endTime,
            allDay: false,
            desc:e.phoneNumber + " | " + e.doctor + " | " + e.aId  + " | " + e.attended + " | " + e.nic + " | " + e.address + " | " + e.treatment + " | " + e.amount
          }); 
        });   
      },
      (error) => {
        console.error('Request failed with error');
      });
  }

  createAppointment(patName:string,mobile:string,date:string,doctor:string,nic:string,address:string,treatment:string,amount:number){
    this._appointment.patName = patName;
    this._appointment.phoneNumber = mobile;
    this._appointment.date = date;
    this._appointment.doctor = doctor;
    this._appointment.nic = nic;
    this._appointment.address = address;
    this._appointment.treatment = treatment;
    this._appointment.amount = amount;

    this.apicalls.presentLoading("creating appointment");

    this.apicalls.createAppointment(this._appointment)
      .subscribe(
        (response) => {                         
          this.getAppointments();
          this.getAppointmentToday(JSON.stringify(this.today));
          this.apicalls.loadingController.dismiss();
        },
        (error) => {          
          console.error('Request failed with error');
        })
    
    let smsNumber = "94" + mobile.substring(1);
    let _date = new Date(date);
    let msg = `Hello ${ patName }, your appointment has been sheduled on ${_date.toDateString()}.\n\n Thank you.`
    this.apicalls.sendSMS(smsNumber,msg)
        .subscribe(
          (response) => {
            //console.log(response);
          },
          (error) => {
            console.error('Request failed with error');
          });
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
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    var splitted = event.desc.split("|"); //number // doctor //aID //attended stat
    var splittedTime = start.split(",");
  

    if(JSON.parse(splitted[3]) == true){
      const alert = await this.alertCtrl.create({
        message: "Patient Name : " + event.title + '<br><br>' +
          "Mobile Number : " + splitted[0] + '<br><br>' +
          "NIC : " + splitted[4] + '<br><br>' + 
          "address : " + splitted[5] + '<br><br>' +
          "treatment : " + splitted[6] + '<br><br>' +
          'Time: ' + splittedTime[2] + '<br><br>' +
          'Payment: Rs.' + splitted[7] + '<br><br>' +
          'Patient Attended: ' + "Yes",
        cssClass: 'alert_css',
        inputs: [
          {
            name: 'amount',
            placeholder: 'Edit Payment'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            },
          },
          {
            text: 'Update Payment',
            cssClass: 'alert-button-confirm',
            role: 'confirm',
            handler: data => {
              this.apicalls.updateAppointment(splitted[2],data.amount).subscribe(
                (response) => {            
                    this.getAppointments();  
                    this.getAppointmentToday(JSON.stringify(this.today));    
                },
                (error) => {          
                  console.error('Request failed with error');           
                });
            },
          },
        ],
      });
      alert.present();
    }else{
      const alert = await this.alertCtrl.create({
        message: "Patient Name : " + event.title + '<br><br>' + 
        "Mobile Number : " + splitted[0] + '<br><br>' +
        "NIC : " + splitted[4] + '<br><br>' + 
        "address : " + splitted[5] + '<br><br>' +
        "treatment : " + splitted[6] + '<br><br>' +
        'Time: ' + splittedTime[2] + '<br><br>' +
        'Patient Attended: ' + "No",
        cssClass: 'alert_css',
        inputs: [
          {
            name: 'amount',
            placeholder: 'Payment'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            },
          },
          {
            text: 'Set Payment',
            cssClass: 'alert-button-confirm',
            role: 'confirm',
            handler: data => {
              this.apicalls.updateAppointment(splitted[2],data.amount).subscribe(
                (response) => {            
                    this.getAppointments(); 
                    this.getAppointmentToday(JSON.stringify(this.today));     
                },
                (error) => {          
                  console.error('Request failed with error');           
                });
            },
          },
        ],
      });
      alert.present();
    }
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
        this.createAppointment(
          result.data.event.patName,
          result.data.event.phoneNumber,
          result.data.event.Date,
          result.data.event.appointedDoctor,
          result.data.event.nic,
          result.data.event.address,
          result.data.event.treatment,
          result.data.event.amount
          );
      }
    });
  }

  getSplittedDate(){
    let today = this.today.toDateString();
    return today;
  }

  Login(){
  //   this.apicalls.presentLoading("Loggin In");
  //   this.apicalls.login(this._loginData)
  //     .subscribe(
  //       (response) => {                         
  //         console.log(response);
  //         //this.isLoggedIn = true
  //         //this.getAppointments();
  //         //this.getAppointmentToday(JSON.stringify(this.today));
  //         this.apicalls.loadingController.getTop().then(v => v ? this.apicalls.loadingController.dismiss() : null);
  //       },
  //       (error) => {          
  //         console.error('Request failed with error');
  //       })
      if(this._loginData.username == this.username && this._loginData.password == this.pwd){
        this.isLoggedIn = true
        if(!this.isMobile){
          this.getAppointments();
          this.getAppointmentToday(JSON.stringify(this.today));
        }
      }
   }

}
