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
  const [y, setY] = useState({
    name: 'review_count',
    label: 'Number of Reviews',
    sum: true,
  });
  const [x, setX] = useState({
    name: 'name',
    label: 'Games',
  });

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

  function handleYChange(e) {
    setY(e);
  }

  function handleXChange(e) {
    setX(e);
  }

  function getXArray(x, gamesData) {
    let xArray;
    if (x.name === 'name') {
      xArray = [...new Set(gamesData.map(game => game[x.name]))];
    } else {
      let allX = gamesData
        .map(game => game[x.name].map(xItem => xItem.name))
        .reduce((accumulator, currentValue) => {
          accumulator = accumulator.concat(currentValue);
          return accumulator;
        }, []);
      xArray = [...new Set(allX)];
    }
    return xArray;
  }

  function sum(accumulator, currentValue) {
    return accumulator + currentValue;
  }

  function getValues(x, y, gamesData) {
    let values;
    if (x.name == 'name') {
      values = gamesData.map(game => game[y.name]);
      return values;
    } else {
      let xArray = getXArray(x, gamesData);
      let gamesInX = xArray.map(xItem =>
        gamesData.filter(game =>
          game[x.name].map(gameX => gameX.name).includes(xItem),
        ),
      );
      values = gamesInX.map(xItem => {
        if (y.sum) {
          return xItem
            .map(game => game[y.name])
            .reduce((acc, curr) => parseInt(acc) + parseInt(curr));
        } else {
          return (
            xItem
              .map(game => game[y.name])
              .reduce((acc, curr) => parseInt(acc) + parseInt(curr)) /
            xItem.length
          );
        }
      });
      return values;
    }
    return null;
  }

  function sortedData(x, y, asc, gamesData) {}

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
