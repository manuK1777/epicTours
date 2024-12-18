import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ChartBarComponent } from '../chart-bar/chart-bar.component';
import { ChartLineComponent } from '../chart-line/chart-line.component';
import { EventService } from 'src/app/services/event.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule, 
    MaterialModule,
    ChartBarComponent,
    ChartLineComponent,
    FormsModule,
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})

export class ChartsComponent implements OnInit {
  eventsByCategory: { category: string; count: number }[] = [];
  eventsOverTime: { month: string; count: number }[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.eventService.getChartData().subscribe({
      
      
      next: (data) => {
        console.log('Chart data: ', data);
        this.eventsByCategory = data.data.eventsByCategory || []; 
        this.eventsOverTime = data.data.eventsOverTime || []; 
      },
      error: (err) => {
        console.error('Error loading chart data:', err);
      },
    });
  }
}
