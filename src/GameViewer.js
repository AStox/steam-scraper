import React, {useState} from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Bar} from 'react-chartjs-2';
import CustomDropdown from './customDropdown';

export const GET_GAMES = gql`
  query GetGames {
    games {
      id
      steam_id
      name
      coming_soon
      release_date
      review_count
      is_free
      full_price
      genre {
        name
      }
      tag {
        name
      }
      developer {
        name
      }
      publisher {
        name
      }
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
      label: 'Full Price',
      sum: false,
    },
  ];
  const [y, setY] = useState(yChoices[0]);
  const [x, setX] = useState(xChoices[0]);

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
    let values = getXArray(x, gamesData).map(xItem =>
      gamesData
        .filter(game => game[x.name] === xItem)
        .map(xItem => xItem.map(game => game[y.name]))
        .reduce((accumulator, currentValue) => accumulator + currentValue),
    );
    return values;
  }
  return (
    <Query query={GET_GAMES}>
      {({data, loading, error}) => {
        if (loading) return <p>LOADING</p>;
        if (error) return <p>{error.toString()}</p>;
        //data.games.sort((a, b) => b[y] - a[y]);
        //let gameLabels = data.games.map(game => game.name);
        let gameLabels = getXArray(x, data.games);
        let gameData = getValues(x, y, data.games);
        let chartData = {
          labels: gameLabels,
          datasets: [
            {
              label: `${x.label} by ${y.label}`,
              data: gameData,
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
