import React, {useState} from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Bar} from 'react-chartjs-2';
import CustomDropdown from './customDropdown';

export const GET_GRAPH_DATA = gql`
  query GetGraphData($x: String!, $y: String!) {
    graphData(x: $x, y: $y) {
      xAxis
      yAxis
    }
  }
`;

const GameViewer = () => {
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
      label: x.name === 'name' ? 'Full Price' : 'Average Price',
      sum: false,
    },
  ];

  const [y, setY] = useState(xChoices[0]);
  const [x, setX] = useState(yChoices[1]);

  function handleYChange(e) {
    setY(e);
  }

  function handleXChange(e) {
    setX(e);
  }

  return (
    <Query query={GET_GRAPH_DATA} variables={(x, y)}>
      {({data, loading, error}) => {
        if (loading) return <p>LOADING</p>;
        if (error) console.log(error);
        let chartData = {
          labels: data.xAxis,
          datasets: [
            {
              label: `${x.label} by ${y.label}`,
              data: data.yAxis,
              borderWidth: 0,
            },
          ],
        };
        let chartOptions = {};
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
