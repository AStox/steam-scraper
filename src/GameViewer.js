import React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Table} from 'reactstrap';

export const GET_GAMES = gql`
  query GetGames {
    games {
      id
      name
      full_price
    }
  }
`;

export default () => (
  <Query query={GET_GAMES}>
    {({data, loading, error}) => {
      if (loading) return <p>LOADING</p>;
      if (error) return <p>{error.toString()}</p>;
      return (
        <Table>
          <thead>
            <tr>
              <th>Author</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {data.games.map(game => (
              <tr key={game.id}>
                <td>{game.name}</td>
                <td>{game.full_price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }}
  </Query>
);
