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
import { buildQueryContext, QueryFormData } from '@superset-ui/core';

/**
 * The buildQuery function is used to create an instance of QueryContext that's
 * sent to the chart data endpoint. In addition to containing information of which
 * datasource to use, it specifies the type (e.g. full payload, samples, query) and
 * format (e.g. CSV or JSON) of the result and whether or not to force refresh the data from
 * the datasource as opposed to using a cached copy of the data, if available.
 *
 * More importantly though, QueryContext contains a property `queries`, which is an array of
 * QueryObjects specifying individual data requests to be made. A QueryObject specifies which
 * columns, metrics and filters, among others, to use during the query. Usually it will be enough
 * to specify just one query based on the baseQueryObject, but for some more advanced use cases
 * it is possible to define post processing operations in the QueryObject, or multiple queries
 * if a viz needs multiple different result sets.
 */

// export default function buildQuery(formData: QueryFormData) {
//   // const { x_axis_column, y_axis_column, z_axis_column } = formData;
//   const x_axis_column = formData.x_axis_column[0]; // 'latitude'
//   const y_axis_column = formData.y_axis_column[0]; // 'longitude'
//   const z_axis_column = formData.z_axis_column[0]; // 'temperature'

//   console.log('Form Data:', formData);
//   return buildQueryContext(formData, baseQueryObject => [
//     {
//       ...baseQueryObject,
//       columns: [x_axis_column, y_axis_column, z_axis_column],
//       metrics: [], // Optional: add a metric here if needed
//       // post_processing: [
//       //   {
//       //     operation: 'pivot',
//       //     options: {
//       //       index: [x_axis_column],
//       //       columns: [y_axis_column],
//       //       aggregates: {
//       //         [z_axis_column]: {
//       //           operator: 'mean',
//       //         },
//       //       },
//       //       drop_missing_columns: false,
//       //     },
//       //   },
//       // ],
//       is_timeseries: false,
//     },
//   ]);
// }
export default function buildQuery(formData: QueryFormData) {
  // Extract the axis columns from the formData. Assuming they are arrays, use the first element.
  const x_axis_column = formData.x_axis_column; // 'latitude'
  const y_axis_column = formData.y_axis_column; // 'longitude'
  const z_axis_column = formData.z_axis_column; // 'temperature'

  console.log('Form Data:', formData);

  // Build the query context using the form data and configured query object
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      columns: [x_axis_column, y_axis_column, z_axis_column],
      metrics: [], // Optional: you can add a metric if needed
      // Uncomment and configure the post-processing section if pivoting is necessary
      post_processing: [],

      // post_processing: [
      //   {
      //     operation: 'pivot',
      //     options: {
      //       index: [x_axis_column],
      //       columns: [y_axis_column],
      //       aggregates: {
      //         [z_axis_column]: {
      //           operator: 'mean', // Aggregation operator
      //         },
      //       },
      //       drop_missing_columns: false,
      //     },
      //   },
      // ],
      is_timeseries: false, // Set to true if the data is time-series based
    },
  ]);
}

// export default function buildQuery(formData: QueryFormData) {
//   const { cols: groupby } = formData;
//   return buildQueryContext(formData, baseQueryObject => [
//     {
//       ...baseQueryObject,
//       groupby,
//       is_timeseries: false,
//     },
//   ]);
// }
