import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Bar } from 'react-chartjs-2';
import CustomDropdown from './customDropdown';
import RadioDropdown from './RadioDropdown';
import { Button } from 'react-bootstrap';
import './GameViewer.css';

export const GET_GRAPH_DATA = gql`
  query GetGraphData($x: String!, $y: Axis!, $sort: Axis!, $order: Int!, $filter: [String]) {
    graphData(x: $x, y: $y, sort: $sort, order: $order, filter: $filter) {
      xAxis
      yAxis
    }
  }
`;

const xChoices = [
  {
    name: 'name',
    label: 'Game',
  },
  {
    name: 'genre',
    label: 'Genre',
  },
  {
    name: 'tag',
    label: 'Tag',
  },
];
const yChoices = [
  {
    name: 'review_count',
    label: 'Number of Reviews',
    avg: false,
  },
  {
    name: 'followers',
    label: 'Followers',
    avg: false,
  },
  {
    name: 'full_price',
    label: 'Full Price',
    avg: true,
  },
];
const sortChoices = [
  {
    name: 'review_count',
    label: 'Number of Reviews',
    avg: false,
  },
  {
    name: 'full_price',
    label: 'Full Price',
    avg: true,
  },
  {
    name: 'release_date',
    label: 'Release Date',
    avg: false,
  },
  {
    name: 'followers',
    label: 'Followers',
    avg: false,
  },
];
const orderChoices = [
  {
    name: true,
    label: 'Descending',
  },
  {
    name: false,
    label: 'Ascending',
  },
];


const GameViewer = () => {
  const [graphData, setGraphData] = useState([]);
  const [x, setX] = useState(xChoices[0]);
  const [y, setY] = useState(yChoices[0]);
  const [sort, setSort] = useState(sortChoices[0]);
  const [order, setOrder] = useState(orderChoices[0]);
  const [filter, setFilter] = useState([]);
  const handleYChange = e => setY(e);
  const handleXChange = e => setX(e);
  const handleSortChange = e => setSort(e);
  const handleOrderChange = e => setOrder(e);
  const handleRadioClick = e => setFilter([...filter, e]);
  const handleFilterClick = e => setFilter([...filter].filter(a => a != e));

  return (
    <React.Fragment>
      <div className="title-container">
        <span className="title title-font">Show me the </span>
        <CustomDropdown
          text={y.label}
          choices={yChoices}
          onChange={handleYChange}
        />
        <span className="title title-font"> for each </span>
        <CustomDropdown
          text={x.label}
          choices={xChoices}
          onChange={handleXChange}
        />
        <br/>
        <span className="title title-font">Sorted by </span>
        <CustomDropdown
          text={sort.label}
          choices={sortChoices}
          onChange={handleSortChange}
        />
        <span className="title title-font"> in </span>
        <CustomDropdown
          text={order.label}
          choices={orderChoices}
          onChange={handleOrderChange}
        />
        <span className="title title-font"> order </span>
        <br/>
        <span className="title title-font"> Filtered by:  </span>
        {filter.map(a => (
          <Button key={a} variant="outline-primary" onClick={() => handleFilterClick(a)}>
            {a}
          </Button>
        ))}
        <Query
          query={ GET_GRAPH_DATA }
          variables={{ x: 'genre', y: y, sort: sort, order: order.name ? -1 : 1}}
        >
        {({ data, loading, error }) => {
          if (loading) return <p>LOADING</p>;
          if (error) return <p>{error.toString()}</p>;
          return (
          <RadioDropdown
            text="+"
            choices={data.graphData.map(a => a.xAxis).filter(a => !filter.includes(a))}
            onClick={handleRadioClick}
          />
          );
        }}
        </Query>
      </div>
        <Query
          query={ GET_GRAPH_DATA }
          variables={{ x: x.name, y: y, sort: sort, order: order.name ? -1 : 1, filter: filter}}
        >
        {({ data, loading, error }) => {
          if (loading) return <p>LOADING</p>;
          if (error) return <p>{error.toString()}</p>;
          setGraphData(data.graphData);
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
          const chartOptions = {
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            scales: {
              xAxes: [{
                gridLines: {
                  display: false,
                },
                ticks: {
                  autoSkip: true,
                  autoSkipPadding: -270,
                  minRotation: 70,
                  maxRotation: 90,
                },
              }],
            },
          };
          return (
            <Bar data={chartData} width={100} height={50} options={chartOptions}/>
          );
        }}
      </Query>
    </React.Fragment>
  );
};
export default GameViewer;
