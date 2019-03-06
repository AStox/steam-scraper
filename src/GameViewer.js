import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Bar } from 'react-chartjs-2';
import CustomDropdown from './customDropdown';

export const GET_GRAPH_DATA = gql`
  query GetGraphData($x: String!, $y: String!) {
    graphData(x: $x, y: $y) {
      xAxis
      yAxis
    }
  }
`;

const xChoices = [
  {
    name: 'name',
    label: 'Games',
  },
  {
    name: 'genre',
    label: 'Genres',
  },
  {
    name: 'tag',
    label: 'Tags',
  },
];
const yChoices = [
  {
    name: 'review_count',
    label: 'Number of Reviews',
    sum: true,
  },
  {
    name: 'full_price',
    label: 'Full Price',
    sum: false,
  },
];

const GameViewer = () => {
  const [x, setX] = useState(xChoices[0]);
  const [y, setY] = useState(yChoices[0]);
  const handleYChange = e => setY(e);
  const handleXChange = e => setX(e);

  return (
    <Query query={ GET_GRAPH_DATA } variables={{ x: x.name, y: y.name }}>
      {({ data, loading, error }) => {
        if (loading) return <p>LOADING</p>;
        if (error) return <p>{error.toString()}</p>;
        const chartData = {
          labels: data.graphData.map(datum => datum.xAxis),
          datasets: [
            {
              label: `${x.label} by ${y.label}`,
              data: data.graphData.map(datum => datum.yAxis),
              borderWidth: 0,
            },
          ],
        };
        return (
          <div>
            <CustomDropdown
              text={x.label}
              choices={xChoices}
              onChange={handleXChange}
            />
            <CustomDropdown
              text={y.label}
              choices={yChoices}
              onChange={handleYChange}
            />
            <Bar data={chartData} width={100} height={50} />;
          </div>
        );
      }}
    </Query>
  );
};
export default GameViewer;
