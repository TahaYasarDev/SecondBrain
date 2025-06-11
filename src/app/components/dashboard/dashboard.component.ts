// Angular
import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

// Service
import { CountService } from '../../services/count.service';

// Model
import { Ticket } from '../../models/ticket.model';

// Shared
import { fadeAnimation } from '../../shared/animation';
import { BaseUiBehavior } from '../../shared/base-ui-behavior';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
} from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [fadeAnimation],
})
export class DashboardComponent extends BaseUiBehavior implements OnInit {
  public overviewChart: Partial<OverviewOptions>;
  public overviewCircleChart: Partial<OverviewCircleOptions>;
  public overviewColumnChart: Partial<OverviewColumnChartOptions>;
  public overviewPyramideChart: Partial<OverviewPyramideChartOptions>;

  constructor(private countService: CountService) {
    super();

    this.overviewChart = {};

    this.overviewCircleChart = {};

    this.overviewColumnChart = {};

    this.overviewPyramideChart = {};
  }

  ngOnInit() {
    const tags = this.countService.getAllTags();
    const tasks = this.countService.getAllTasks();

    this.overviewChart = {
      series: [
        {
          name: 'Tag',
          data: [tags.H1, tags.H2, tags.H3, tags.H4, tags.paragraph],
        },
      ],
      chart: {
        type: 'bar',
        height: 430,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
          colors: {
            ranges: [
              { from: 0, to: 20, color: '#ffb3c6' },
              { from: 21, to: 40, color: '#f48fb1' },
              { from: 41, to: 60, color: '#e1bee7' },
              { from: 61, to: 80, color: '#ce93d8' },
              { from: 81, to: 100, color: '#ab47bc' },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff'],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: ['h1', 'h2', 'h3', 'h4', 'T'],
        labels: {
          style: {
            colors: ['#fff'],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#fff'],
          },
        },
      },
    };

    this.overviewCircleChart = {
      series: [tasks.taskTodo, tasks.taskDone],
      chart: {
        type: 'donut',
        height: 390,
        offsetX: 5,
      },
      labels: ['Tasks to do', 'Completed tasks'],
      colors: ['#f48fb1', '#ab47bc'],
      plotOptions: {
        pie: {
          donut: {
            size: '40%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: function (opts) {
                  const total = opts.series.reduce(
                    (a: number, b: number) => a + b,
                    0
                  );
                  return total + ' tasks';
                },
              },
            },
          },
        },
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '16px',
        labels: {
          useSeriesColors: true,
        },
        formatter: function (seriesName, opts) {
          return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`;
        },
      },
    };

    const allKanban = this.countService.getAllKanban();

    // allKanban est un objet { [componentId: string]: Item[] }, donc on va concaténer tous les tickets de tous les composants
    const allTickets: Ticket[] = Object.values(allKanban).flat();

    this.overviewColumnChart = {
      series: [
        {
          name: 'Time Spent',
          data: allTickets.map((item) => ({
            x: item.jira, // numéro du ticket
            y: item.timeSpent || 0, // temps passé, 0 si absent
            goals: [
              {
                name: 'Estimated',
                value: item.estimate || 0, // temps estimé, 0 si absent
                strokeHeight: 10,
                strokeWidth: 30,
                strokeColor: '#775DD0',
              },
            ],
          })),
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
        },
      },
      colors: ['#f48fb1'],
      dataLabels: {
        enabled: false,
      },
      legend: {
        labels: {
          colors: 'white',
        },
        show: true,
        showForSingleSeries: true,
        customLegendItems: ['Time Spent', 'Estimated'],
        markers: {
          fillColors: ['#f48fb1', '#775DD0'],
        },
      },
      xaxis: {
        labels: {
          style: {
            colors: '#fff',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#fff',
          },
        },
      },
    };

    const ranges = [
      { min: 100, max: 100, label: '100%' },
      { min: 80, max: 100, label: '> 80% – 100%' },
      { min: 60, max: 80, label: '> 60% – 80%' },
      { min: 40, max: 60, label: '> 40% – 60%' },
      { min: 20, max: 40, label: '> 20% – 40%' },
      { min: 0, max: 20, label: '> 0% – 20%' },
    ];

    const progressionCounts = ranges.map((range) => {
      return allTickets.filter(
        (ticket) =>
          ticket.progress != null &&
          ticket.progress > range.min &&
          ticket.progress <= range.max
      ).length;
    });

    this.overviewPyramideChart = {
      series: [
        {
          name: '',
          data: progressionCounts,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          distributed: true,
          barHeight: '70%',
          isFunnel: true,
        },
      },
      colors: [
        '#f48fb1',
        '#d98ec1',
        '#bf8ccc',
        '#a88bd6',
        '#8f7ada',
        '#7d69d0',
        '#6b5ac7',
        '#775DD0',
      ],
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          const label = opt.w.globals.labels[opt.dataPointIndex];
          return `Tickets ${label} : ${val}`;
        },
        dropShadow: {
          enabled: true,
        },
      },
      xaxis: {
        categories: ranges.map((r) => r.label),
      },
      legend: {
        show: false,
      },
    };
  }
}

export type OverviewOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
};

export type OverviewCircleOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
};

export type OverviewColumnChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
};

export type OverviewPyramideChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors: string[];
  legend: ApexLegend;
};
