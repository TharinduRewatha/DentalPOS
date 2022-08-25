import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
})
export class CalModalPage implements AfterViewInit {
  calendar = {
    mode: 'week',
    currentDate: new Date()
  };
  viewTitle: string;
  
  event = {
    patName: '',
    phoneNumber: '',
    Date:null,
    startTime: null,
    endTime: null,
    allDay: false
  };
 
  modalReady = false;
 
  constructor(private modalCtrl: ModalController) { }
 
  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;      
    }, 0);
  }
 
  save() {    
    this.modalCtrl.dismiss({event: this.event})
  }
 
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  onTimeSelected(ev) {    
    this.event.startTime = new Date(ev.selectedTime);
  }
 
  close() {
    this.modalCtrl.dismiss();
  }

  onDateSelected(event) {
    const date = new Date(event.selectedTime);
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
      console.log(endTime);
      this.event.startTime = startTime;
      this.event.endTime = endTime;
      this.event.Date = startTime;
  }
}
