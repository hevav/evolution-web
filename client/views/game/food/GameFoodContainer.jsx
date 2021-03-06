import React from 'react';
import PropTypes from 'prop-types'

import {DragFood, Food} from './Food.jsx';


export const GameFoodContainer = ({game, food}) => (<div className='GameFoodContainer'>
  {Array.from({length: food}).map((u, index) => <DragFood key={index} game={game}/>)}
</div>);


//export const GameFoodContainer = ({food}) => {
//  const step = 3;
//  const chord = 20;
//  let angle = 6;
//  return <div className='GameFoodContainer'>
//    {/*Array.from({length: food}).map((u, index) => <DragFood key={index}/>)*/}
//    {Array.from({length: food}).map((fid, index) => {
//      let dist = step * angle;
//      let p = la2xy(dist, angle);
//      angle += chord / dist;
//      return (<div key={index} style={{
//          position: 'absolute'
//          , transform: `translate(${p.x}px, ${p.y}px)`
//          , transition: `all .5s`
//        }}><DragFood/></div>);
//      })}
//  </div>
//}

GameFoodContainer.propTypes = {
  food: PropTypes.number.isRequired
};