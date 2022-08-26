import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Appointments', url: '/appointments', icon: 'reorder-four' },
    { title: 'dummy', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'dummy', url: '/folder/Favorites', icon: 'heart' },
    { title: 'dummy', url: '/folder/Archived', icon: 'archive' },
    { title: 'dummy', url: '/folder/Trash', icon: 'trash' },
    { title: 'dummy', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
