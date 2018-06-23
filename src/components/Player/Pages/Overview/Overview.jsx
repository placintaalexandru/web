import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import Turbo from 'material-ui/svg-icons/image/timelapse';
import TurboOff from 'material-ui/svg-icons/notification/do-not-disturb';
import util from 'util';
import styled from 'styled-components';
import {
  getPlayerRecentMatches,
  getPlayerHeroes,
  getPlayerPeers,
  getPlayerCounts,
} from '../../../../actions';
import Table from '../../../Table';
import Container from '../../../Container';
import playerMatchesColumns from '../Matches/playerMatchesColumns';
import { playerHeroesOverviewColumns } from '../Heroes/playerHeroesColumns';
import { playerPeersOverviewColumns } from '../Peers/playerPeersColumns';
import SummOfRecMatches from './Summary';
import constants from '../../../constants';
import CountsSummary from './CountsSummary';

export const MAX_MATCHES_ROWS = 20;
const MAX_HEROES_ROWS = 10;
const MAX_PEERS_ROWS = 5;

const OverviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SummaryContainer = styled(Container)`

  & ul {
    border: 1px solid rgb(52, 50, 50);
    border-radius: 10px;
    background-color: rgb(46, 47, 64);
    margin: 0;
    padding-left: 5px;

    & li {
      list-style: none;
      display: inline-block;
      margin-bottom: 10px;
      margin-right: 15px;

      & p {
        margin: 0;
        padding: 0;
        font-size: 24px;
      }

      & span {
        font-size: ${constants.fontSizeSmall};
        color: ${constants.colorMutedLight};

        &:first-child {
          text-transform: uppercase;
        }
      }

      & img {
        height: 20px;
        width: auto;
        vertical-align: text-bottom;
        transition: ${constants.normalTransition};
        margin-left: 6px;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
`;

const MatchesContainer = styled.div`
  width: calc(65% - 15px);
  margin-right: 15px;

  @media only screen and (max-width: 1080px) {
    width: 100%;
    margin-right: 0;
  }
`;

const HeroesContainer = styled.div`
  width: 35%;

  @media only screen and (max-width: 1080px) {
    width: 100%;
  }
`;

const Styled = styled.div`
float: left;
position: relative;
width: 30px;
`;

const Overview = ({
  validRecentMatches,
  numValidRecentMatches,
  matchesData,
  matchesLoading,
  matchesError,
  heroesData,
  heroesLoading,
  heroesError,
  peersData,
  peersLoading,
  peersError,
  playerId,
  toggleTurboGames,
  showTurboGames,
  strings,
  countsData,
  countsLoading,
  countsError,
}) => (
  <OverviewContainer>
    <SummaryContainer
      title={strings.heading_avg_and_max}
      titleTo={`/players/${playerId}/records`}
      subtitle={util.format(strings.subheading_avg_and_max, numValidRecentMatches)}
      loading={matchesLoading}
      error={matchesError}
      loaderWidth={250}
      loaderHeight={30}
    >
      <Styled
        data-tip={strings.exclude_turbo_matches}
        style={{ display: validRecentMatches.some(match => match.game_mode === 23) ? 'inline' : 'none' }}
      >
        <Checkbox
          style={{ display: validRecentMatches.filter(match => showTurboGames || match.game_mode !== 23) }}
          defaultChecked
          onCheck={toggleTurboGames}
          checkedIcon={<Turbo />}
          uncheckedIcon={<TurboOff />}
        />
      </Styled>
      <SummOfRecMatches matchesData={validRecentMatches.filter(match => showTurboGames || match.game_mode !== 23)} />
    </SummaryContainer>
    <SummaryContainer
      title={strings.tab_counts}
      loading={countsLoading}
      error={countsError}
    >
      <CountsSummary data={countsData} />
    </SummaryContainer>
    <MatchesContainer>
      <Container
        title={strings.heading_matches}
        titleTo={`/players/${playerId}/matches`}
        loading={matchesLoading}
        error={matchesError}
        loaderWidth={300}
        loaderHeight={160}
      >
        <Table
          columns={playerMatchesColumns(strings)}
          data={matchesData}
          maxRows={MAX_MATCHES_ROWS}
        />
      </Container>
    </MatchesContainer>

    <HeroesContainer>
      <Container
        title={strings.heading_peers}
        titleTo={`/players/${playerId}/peers`}
        loading={peersLoading}
        error={peersError}
      >
        <Table
          columns={playerPeersOverviewColumns(playerId, strings)}
          data={peersData}
          maxRows={MAX_PEERS_ROWS}
        />
      </Container>

      <Container
        title={strings.heading_heroes}
        titleTo={`/players/${playerId}/heroes`}
        loading={heroesLoading}
        error={heroesError}
      >
        <Table
          columns={playerHeroesOverviewColumns(playerId, strings)}
          data={heroesData}
          maxRows={MAX_HEROES_ROWS}
        />
      </Container>
    </HeroesContainer>
  </OverviewContainer>
);

Overview.propTypes = {
  validRecentMatches: PropTypes.arrayOf({}),
  numValidRecentMatches: PropTypes.number,
  matchesData: PropTypes.arrayOf({}),
  matchesLoading: PropTypes.bool,
  matchesError: PropTypes.string,
  heroesData: PropTypes.arrayOf({}),
  heroesLoading: PropTypes.bool,
  heroesError: PropTypes.string,
  peersData: PropTypes.arrayOf({}),
  peersLoading: PropTypes.bool,
  peersError: PropTypes.string,
  playerId: PropTypes.string,
  toggleTurboGames: PropTypes.func,
  showTurboGames: PropTypes.bool,
  strings: PropTypes.shape({}),
  countsData: PropTypes.arrayOf({}),
  countsLoading: PropTypes.bool,
  countsError: PropTypes.bool,
};


const getData = (props) => {
  props.getPlayerRecentMatches(props.playerId);
  props.getPlayerHeroes(props.playerId, props.location.search);
  props.getPlayerPeers(props.playerId, props.location.search);
  props.getPlayerCounts(props.playerId, props.location.search);
};

class RequestLayer extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      key: PropTypes.string,
    }),
    playerId: PropTypes.string,
    toggleTurboGames: PropTypes.func,
    showTurboGames: PropTypes.bool,
    strings: PropTypes.shape({}),
  }

  constructor(props) {
    super(props);
    this.state = {
      showTurboGames: true,
    };
    this.toggleTurboGames = this.toggleTurboGames.bind(this);
  }


  componentDidMount() {
    getData(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.playerId !== prevProps.playerId || this.props.location.key !== prevProps.location.key) {
      getData(this.props);
    }
  }

  toggleTurboGames = () => {
    const { showTurboGames } = this.state;
    this.setState({ showTurboGames: !showTurboGames });
  };

  render() {
    return <Overview {...this.props} toggleTurboGames={this.toggleTurboGames} showTurboGames={this.state.showTurboGames} />;
  }
}

/**
 * Get the number of recent matches, filtering out Siltbreaker matches
 */
const countValidRecentMatches = matches => matches.filter(match => match.game_mode !== 19).length;

/**
 * Get the recent matches, filtering out Siltbreaker matches
 *
 * XXX - this could be switched to use playerMatches while specifying the
 * desired fields in order to request >20 matches and filter down to 20 matches.
 */
const getValidRecentMatches = matches => matches.filter(match => match.game_mode !== 19)
  .slice(0, MAX_MATCHES_ROWS);

const filterCounts = (counts) => {
  const countMap = {
    is_radiant: [],
    game_mode: [],
    patch: [],
    region: [],
  };

  const limitCount = (key, field, lim) =>
    counts[key].list.sort((a, b) => (
      b[field] - a[field]
    )).slice(0, lim);

  Object.keys(counts).forEach((key) => {
    switch (key) {
      case 'is_radiant':
        countMap[key] = counts[key].list;
        break;

      case 'game_mode':
        countMap[key] = limitCount(key, 'matches', 1);
        break;

      case 'patch':
        countMap[key] = limitCount(key, 'category', 1);
        break;

      case 'region':
        countMap[key] = limitCount(key, 'matches', 3);
        break;

      default:
        break;
    }
  });

  return [
    ...countMap.is_radiant,
    ...countMap.game_mode,
    ...countMap.patch,
    ...countMap.region,
  ];
};

const mapStateToProps = state => ({
  matchesData: state.app.playerRecentMatches.data,
  matchesLoading: state.app.playerRecentMatches.loading,
  matchesError: state.app.playerRecentMatches.error,
  validRecentMatches: getValidRecentMatches(state.app.playerRecentMatches.data),
  numValidRecentMatches: countValidRecentMatches(state.app.playerRecentMatches.data),
  heroesData: state.app.playerHeroes.data,
  heroesLoading: state.app.playerHeroes.loading,
  heroesError: state.app.playerHeroes.error,
  peersData: state.app.playerPeers.data,
  peersLoading: state.app.playerPeers.loading,
  peersError: state.app.playerPeers.error,
  strings: state.app.strings,
  countsData: filterCounts(state.app.playerCounts.data),
  countsLoading: state.app.playerCounts.loading,
  countsError: state.app.playerCounts.error,
});

const mapDispatchToProps = dispatch => ({
  getPlayerRecentMatches: (playerId, options) => dispatch(getPlayerRecentMatches(playerId, options)),
  getPlayerHeroes: (playerId, options) => dispatch(getPlayerHeroes(playerId, options)),
  getPlayerPeers: (playerId, options) => dispatch(getPlayerPeers(playerId, options)),
  getPlayerCounts: (playerId, options) => dispatch(getPlayerCounts(playerId, options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
