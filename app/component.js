import * as React from 'react';
import PropTypes from 'prop-types';

const TweenMax = require('TweenMax');
const Ease = require('Ease');
const TimelineLite = require('TimelineLite');


const Home = ( { text = 'Hello world' } ) => {
  console.log('has TweenMax:', TweenMax !== undefined, 'has Ease:', Ease !== undefined, 'has TimelineLite:', TimelineLite !== undefined);
  return <p className={'ph3 b underline'}>{text}</p>;
};

export default Home;


Home.propTypes = {
  text: PropTypes.string,
};
