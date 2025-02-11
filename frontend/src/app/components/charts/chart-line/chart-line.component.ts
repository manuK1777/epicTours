import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-chart-line',
  standalone: true,
  imports: [],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
})
export class ChartLineComponent implements OnChanges, OnDestroy {
  @Input() data: { month: string; count: number }[] = [];
  private chart: Chart | undefined;

  constructor() {
    Chart.register(...registerables); // Register required Chart.js components
  }

  ngOnChanges(): void {
    if (Array.isArray(this.data) && this.data.length > 0) {
      this.renderChart();
    } else {
      console.warn('No data available for Line Chart');
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private renderChart(): void {
    this.destroyChart(); // Destroy any existing chart instance

    const months = this.data.map((item) => item.month);
    const counts = this.data.map((item) => item.count);

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Events Over Time',
            data: counts,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
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
            text: 'Events Over Time',
          },
        },
      },
    };

    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, config);
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
