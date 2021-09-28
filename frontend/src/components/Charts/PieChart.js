import React, { Component } from 'react';
import Chart from 'react-apexcharts'

const PieChart = (props) => {
    const {report} = props;
    console.log('report',report)
    const V = {
      options: {
        colors:['#4dabf5', '#f50057', '#686868'],
        labels: ['Attentive', 'Careless', 'No Face'],
        title: {
            text: report.tagName ? report.tagName :  "Lesson Total Result"
        },
      },
      series: [parseInt(report.attentive), parseInt(report.careless), parseInt(report.no_face) ],
      
      legend: {
        show: true,
        showForSingleSeries: false,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'bottom',
        horizontalAlign: 'center', 
        floating: false,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 400,
        formatter: undefined,
        inverseOrder: false,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        offsetX: 0,
        offsetY: 0,
        labels: {
            colors: undefined,
            useSeriesColors: false
        },
        markers: {
            width: 12,
            height: 12,
            strokeWidth: 0,
            strokeColor: '#fff',
            fillColors: undefined,
            radius: 12,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0
        },
        itemMargin: {
            horizontal: 5,
            vertical: 0
        },
        onItemClick: {
            toggleDataSeries: true
        },
        onItemHover: {
            highlightDataSeries: true
        },
    }
      
    }
  

  

    return (
      <div className="pie">
        <Chart options={V.options} series={V.series} type="pie" width="100%" height="300px"/>
      </div>
    );
  
}

export default PieChart;