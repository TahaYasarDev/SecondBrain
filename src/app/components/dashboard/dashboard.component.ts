// Angular
import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
} from 'ng-apexcharts';

// Model
import { Ticket } from '../../models/ticket.model';

// Service
import { CountService } from '../../services/count.service';
import { ThemeService } from '../../services/theme.service';

// Shared
import { fadeAnimation } from '../../shared/animation';
import { BaseUiBehavior } from '../../shared/base-ui-behavior';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [fadeAnimation],
})
export class DashboardComponent extends BaseUiBehavior implements OnInit {
  public overviewChart: Partial<OverviewOptions>;
  public overviewCircleChart: Partial<OverviewCircleOptions>;
  public overviewColumnChart: Partial<OverviewColumnChartOptions>;
  public overviewPyramideChart: Partial<OverviewPyramideChartOptions>;

  constructor(
    private countService: CountService,
    private themeService: ThemeService,
    private translate: TranslateService
  ) {
    super();

    this.overviewChart = {};

    this.overviewCircleChart = {};

    this.overviewColumnChart = {};

    this.overviewPyramideChart = {};
  }

  ngOnInit() {
    var isPhone = window.innerWidth < 375;

    const textColor = this.getCssVariableFromTheme(
      '--dashboardLabelColor',
      this.themeService.currentTheme
    );

    const pyramidTextColor = this.getCssVariableFromTheme(
      '--dashboardPyramidLabelColor',
      this.themeService.currentTheme
    );

    const tags = this.countService.getAllTags();
    const tasks = this.countService.getAllTasks();

    this.overviewChart = {
      series: [
        {
          name: this.translate.instant('dashboard-title-one-label-tag'),
          data: [tags.H1, tags.H2, tags.H3, tags.H4, tags.paragraph],
        },
      ],
      chart: {
        type: 'bar',
        height: isPhone ? '280px' : 390,
        width: isPhone ? '150px' : '100%',
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
          colors: [textColor],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: [textColor],
      },
      xaxis: {
        categories: ['h1', 'h2', 'h3', 'h4', 'T'],
        labels: {
          style: {
            colors: [textColor],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [textColor],
          },
        },
      },
    };

    this.overviewCircleChart = {
      series: [tasks.taskTodo, tasks.taskDone],
      chart: {
        type: 'donut',
        height: isPhone ? '280px' : 390,
        width: isPhone ? '150px' : '100%',
        offsetX: 5,
      },
      labels: [
        this.translate.instant('dashboard-title-two-label-todo'),
        this.translate.instant('dashboard-title-two-label-done'),
      ],
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
        fontSize: isPhone ? '10px' : '16px',
        labels: {
          useSeriesColors: true,
        },
        formatter: function (seriesName, opts) {
          return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`;
        },
      },
    };

    const allKanban = this.countService.getAllKanban();

    const allTickets: Ticket[] = Object.values(allKanban).flat();

    const wordTickets = this.translate.instant(
      'dashboard-title-four-label-tickets'
    );

    this.overviewColumnChart = {
      series: [
        {
          name: this.translate.instant('dashboard-title-three-label-spent'),
          data: allTickets.map((item) => ({
            x: item.ticket,
            y: item.timeSpent || 0,
            goals: [
              {
                name: this.translate.instant(
                  'dashboard-title-three-label-estimated'
                ),
                value: item.estimate || 0,
                strokeHeight: 10,
                strokeWidth: 30,
                strokeColor: '#775DD0',
              },
            ],
          })),
        },
      ],
      chart: {
        type: 'bar',
        height: isPhone ? '230px' : 390,
        width: isPhone ? '150px' : '100%',
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
          colors: textColor,
        },
        show: true,
        showForSingleSeries: true,
        customLegendItems: [
          this.translate.instant('dashboard-title-three-label-spent'),
          this.translate.instant('dashboard-title-three-label-estimated'),
        ],
        markers: {
          fillColors: ['#f48fb1', '#775DD0'],
        },
      },
      xaxis: {
        labels: {
          style: {
            colors: textColor,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: textColor,
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
        height: isPhone ? '230px' : 390,
        width: isPhone ? '150px' : '100%',
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
        style: {
          colors: [pyramidTextColor],
        },
        enabled: true,
        formatter: function (val, opt) {
          const label = opt.w.globals.labels[opt.dataPointIndex];
          return `${wordTickets} ${label} : ${val}`;
        },
        dropShadow: {
          enabled: false,
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

  getCssVariableFromTheme(name: string, isDark: boolean): string {
    const element = isDark
      ? document.documentElement // :root
      : document.querySelector('.light-theme'); // light theme

    if (!element) return '';

    return getComputedStyle(element).getPropertyValue(name).trim();
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
