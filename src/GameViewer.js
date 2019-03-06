import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Bar } from 'react-chartjs-2';
import CustomDropdown from './customDropdown';
import './GameViewer.css';

export const GET_GRAPH_DATA = gql`
  query GetGraphData($x: String!, $y: String!, $sort: String!, $order: Int!) {
    graphData(x: $x, y: $y, sort: $sort, order: $order) {
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
const sortChoices = [
  {
    name: 'review_count',
    label: 'Number of Reviews',
  },
  {
    name: 'name',
    label: 'Games',
  },
  {
    name: 'release_date',
    label: 'Release Date',
  },
];

const GameViewer = () => {
  const [x, setX] = useState(xChoices[0]);
  const [y, setY] = useState(yChoices[0]);
  const [sort, setSort] = useState(sortChoices[0]);
  const [order, setOrder] = useState(true);
  const handleYChange = e => setY(e);
  const handleXChange = e => setX(e);
  const handleSortChange = e => setSort(e);
  const handleOrderChange = e => setOrder(e);

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
        <span className="title title-font">, </span>
        <CustomDropdown
          text={order ? 'Descending' : 'Ascending'}
          choices={[true, false]}
          onChange={handleOrderChange}
        />
      </div>
        <Query 
          query={ GET_GRAPH_DATA } 
          variables={{ x: x.name, y: y.name, sort: sort.name, order: order ? -1 : 1}}
        >
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
              <Bar data={chartData} width={100} height={50} />
          );
        }}
      </Query>
    </React.Fragment>
  );
};
export default GameViewer;
