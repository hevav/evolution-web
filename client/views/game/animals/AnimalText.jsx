import React from 'react';
import T from 'i18n-react'
import classnames from 'classnames';

import {connect} from 'react-redux';

import gecko from '../../../assets/gfx/gecko.svg';

import './AnimalText.scss';

export const AnimalText = ({animal, select}) =>(
  <span>
    <img className='AnimalText' src={gecko} alt={T.translate('Game.Animal')} width='1em'/>
    {!!animal && <span>
      ({animal.slice(1)
        .map((trait, index) => (
          <span key={trait.id} className={index === select ? '' : ''}>
            {T.translate('Game.Trait.' + trait)}
          </span>))
        .map((item, index) => [index > 0 && ', ', item])
      })
    </span>}
  </span>
);

export default AnimalText;
