import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentsPageRoutingModule } from './appointments-routing.module';

import { AppointmentsPage } from './appointments.page';

import { NgCalendarModule  } from 'ionic2-calendar';
import { CalModalPageModule } from '../modals/cal-modal/cal-modal.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentsPageRoutingModule,
    NgCalendarModule,
    CalModalPageModule
  ],
  declarations: [AppointmentsPage]
})
export class AppointmentsPageModule {}
