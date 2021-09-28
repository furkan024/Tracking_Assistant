import React from 'react'
import Chart from 'react-apexcharts'

const ApexChart = (props) => {
    const { report } = props;
    const series = [];
    const colors = [];
    
    
    report.results.map(i => {
        if (i.timestamp >= 0) {
            series.push({
                name: i.emotion,
                data: [1]
            })
            if (i.emotion === 'attentive') {
                colors.push('#B0C4DE')
            }
            else if (i.emotion === 'careless') {
                colors.push('#f50057')
            }
            else {
                colors.push('#686868')
            }
        }
    })

    const Props = {
        series: series,
        options: {
            chart: {
                type: 'bar',
                stacked: true,
                width: '100%',
                zoom: {
                    enabled: true
                  }
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: '40%',
                },
            },
            stroke: {
                width: 1,
                colors: ['#F8F8FF']
            },
            title: {
                text: "Lesson Name: " + report.tagName + ' | ' + "Lecture Date: " + report.lecture_date.split('T')[0]
            },
            xaxis: {
                categories: [``],
                labels: {
                    show: true,
                    
                    formatter: function (val) {
                        return val
                    },
                },
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val 
                    }
                }
            },
            fill: {
                opacity: 1,
                colors: colors
            },
            legend: {
                show: false,
                showForSingleSeries: true,
                showForNullSeries: true,
                showForZeroSeries: true,
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40,
            },
            
            
        },
    };
    return (

        <div id="chart">
            <Chart options={Props.options} series={Props.series} type="bar" height="400px" />
        </div>
    )
}




export default ApexChart
