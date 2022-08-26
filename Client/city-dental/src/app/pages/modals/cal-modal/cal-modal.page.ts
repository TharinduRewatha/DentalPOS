import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import {ChangeDetectorRef } from '@angular/core';

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

  alldayLabel:any = ""
 
  modalReady = false;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;
 
  constructor(
    private modalCtrl: ModalController,
    private cdref: ChangeDetectorRef
    ) { }
 
  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;      
    }, 0);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();  
  }
 
  save() {    
    this.modalCtrl.dismiss({event: this.event})
  }
 
  onViewTitleChanged(title) {
    this.viewTitle = title;
    this.cdref.detectChanges();
  }
 
  onTimeSelected(ev) {    
    this.event.startTime = new Date(ev.selectedTime);
  }
 
  close() {
    this.modalCtrl.dismiss();
  }

   // Change current month/week/day
   next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
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
      this.event.startTime = startTime;
      this.event.endTime = endTime;
      this.event.Date = startTime;
  }
}
