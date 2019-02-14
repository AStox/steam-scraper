import React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Bar} from 'react-chartjs-2';

export const GET_GAMES = gql`
  query GetGames {
    games {
      id
      name
      full_price
      review_count
    }
  }
`;

const y = 'review_count';

export default () => (
  <Query query={GET_GAMES}>
    {({data, loading, error}) => {
      if (loading) return <p>LOADING</p>;
      if (error) return <p>{error.toString()}</p>;
      data.games.sort((a, b) => b[y] - a[y]);
      let gameLabels = data.games.map(game => game.name);
      let gameData = data.games.map(game => game[y]);
      {
        console.log(gameData);
      }
      let chartData = {
        labels: gameLabels,
        datasets: [
          {
            label: `games by ${y}`,
            data: gameData,
            borderWidth: 0,
          },
        ],
      };
      let chartOptions = {};
      return <Bar data={chartData} width={100} height={50} />;
    }}
  </Query>
);
