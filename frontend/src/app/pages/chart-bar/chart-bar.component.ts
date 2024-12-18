import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [],
  templateUrl: './chart-bar.component.html',
  styleUrl: './chart-bar.component.scss'
})
export class ChartBarComponent implements OnChanges, OnDestroy {
  @Input() data: { category: string; count: number }[] = [];
  private chart: Chart | undefined;

  constructor() {
    Chart.register(...registerables); // Register required Chart.js components
  }

  ngOnChanges(): void {
    console.log('Chart data on chartBarComp ', this.data);
    
    if (Array.isArray(this.data) && this.data.length > 0) {
      this.renderChart();
    } else {
      console.warn('No data available for Bar Chart');
    }
  }
  

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private renderChart(): void {
   this.destroyChart(); // Destroy any existing chart instance

    const categories = this.data.map((item) => item.category);
    const counts = this.data.map((item) => item.count);

    console.log('categories from chartBarComponent: ', categories);
    console.log('counts from chartBarComponent: ', counts);

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Events by Category',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Events by Category',
          },
        },
      },
    };

    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, config);
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
