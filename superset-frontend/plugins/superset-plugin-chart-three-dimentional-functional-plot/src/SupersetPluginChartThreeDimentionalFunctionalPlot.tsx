/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useEffect, createRef } from 'react';
import { styled } from '@superset-ui/core';
import { SupersetPluginChartThreeDimensionalFunctionalPlotProps, SupersetPluginChartThreeDimentionalFunctionalPlotStylesProps } from './types';
import * as echarts from 'echarts';
import 'echarts-gl';
// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<SupersetPluginChartThreeDimentionalFunctionalPlotStylesProps>`
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;

  h3 {
    /* You can use your props to control CSS! */
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
    font-size: ${({ theme, headerFontSize }) =>
      theme.typography.sizes[headerFontSize]}px;
    font-weight: ${({ theme, boldText }) =>
      theme.typography.weights[boldText ? 'bold' : 'normal']};
  }
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetPluginChartThreeDimentionalFunctionalPlot(props: SupersetPluginChartThreeDimensionalFunctionalPlotProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const {  data,
    height,
    width,
    headerText,
    boldText,
    headerFontSize,
    xAxisColumn,
    yAxisColumn,
   } = props;

  const rootElem = createRef<HTMLDivElement>();
// const zAxisColumn;
  useEffect(() => {
    if (!rootElem.current) return;

    const root = rootElem.current;
    const myChart = echarts.init(root, undefined, { renderer: 'canvas' });

    // Format data for the surface plot
    const formattedData = data.map((row: any) => {
      const x = row[xAxisColumn];
      const y = row[yAxisColumn];
      const z = Math.pow(x, 2) + Math.pow(y, 2);
      // const z = zAxisColumn(x, y); // Apply the zAxisColumn function
      return [x, y,z]; // Return x, y, and z coordinates for the plot
    });
    // const zAxisColumn = function (xAxisColumn: number, yAxisColumn: number) {
    //   if (Math.abs(xAxisColumn) < 0.1 && Math.abs(yAxisColumn) < 0.1) {
    //     return '-';
    //   }
    //   return Math.sin(xAxisColumn * Math.PI) * Math.sin(yAxisColumn * Math.PI);
    // }
    const option = {
      tooltip: {},
      backgroundColor: '#fff',
      visualMap: {
        show: false,
        dimension: 2,
        min: Math.min(...formattedData.map((d: any[]) => d[2])),
        max: Math.max(...formattedData.map((d: any[]) => d[2])),
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026',
          ],
        },
      },
      xAxis3D: {
        type: 'value',
        // name: xAxisColumn
      },
      yAxis3D: {
        type: 'value',
        // name: yAxisColumn
      },
      zAxis3D: {
        type: 'value',
        // name: zAxisColumn
      },
      // grid3D: {
      //   viewControl: {
      //     // Add options like rotation or zoom here
      //   },
      // },
      grid3D: {
        boxWidth: 110,
        boxHeight: 90,
        boxDepth: 100,
        viewControl: {
          distance: 100, // Adjust this to zoom in or out
          // rotateSensitivity: [1, 0],  // Only allow horizontal rotation
        },
        environment: '#ffffff', // Set to white or any color that fits
      },
      // grid3D: {
      //   boxWidth: 200,
      //   boxHeight: 100,
      //   boxDepth: 200,
      //   viewControl: {
      //     distance: 100,  // Adjust this to zoom in or out
      //     rotateSensitivity: [1, 0],  // Only allow horizontal rotation
      //   },
      //   environment: '#ffffff',  // Set to white or any color that fits
      // },
      series: [
        {
          type: 'surface',
          data: formattedData,
          shading: 'color',
          wireframe: {
            show: true,
          },
          // data: formattedData.map((d: { x: any; y: any; z: any; }) => [d.x, d.y, d.z]),
          equation: {
            x: {
              step: 0.05
            },
            y: {
              step: 0.05
            },
            z: function (x: number, y: number) {
              if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
                return '-';
              }
              return Math.sin(x * Math.PI) * Math.sin(y * Math.PI);
            }
            // z: function (x: number, y: number) {
            //   // If both x and y are too close to 0, return NaN to avoid plot issues
            //   if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
            //     return NaN; // NaN is a better representation for undefined values in charts
            //   }
            //   // z = x^2 * y^2
            //   return Math.pow(x, 2) * Math.pow(y, 2); // Or x * x * y * y
            // },
          }
        },
      ],
    };

    // Set the chart option
    myChart.setOption(option);

    // Handle resizing
    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data, xAxisColumn, yAxisColumn, height, width]);

  return (
    <>
      <div style={{ fontSize: `${headerFontSize}`, marginTop: '-10px' }}>
        {headerText}
      </div>
      <Styles
        ref={rootElem}
        boldText={boldText}
        headerFontSize={headerFontSize}
        height={height}
        width={width}
      ></Styles>
    </>
  );
}
