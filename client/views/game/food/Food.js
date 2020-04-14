import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import noop from 'lodash/noop';

import SvgIcon from '@material-ui/core/SvgIcon';

import {compose, setPropTypes} from "recompose";
import {connect} from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";
import {DND_ITEM_TYPE} from "../dnd/DND_ITEM_TYPE";
import {TRAIT_COOLDOWN_LINK} from "../../../../shared/models/game/evolution/constants";
import {PHASE} from "../../../../shared/models/game/GameModel";

import {InteractionSource} from '../InteractionManager';
import GameStyles from "../GameStyles";
import Tooltip from "@material-ui/core/Tooltip";
import T from "i18n-react";

const IconFood = React.forwardRef((props, ref) => (
  <SvgIcon {...props}>
    <g ref={ref}>
      <path
        d={"M8.55 12c-1.07-.71-2.25-1.27-3.53-1.61 1.28.34 2.46.9 3.53 1.61zm10.43-1.61c-1.29.34-2.49.91-3.57 1.64 1.08-.73 2.28-1.3 3.57-1.64z"} />
      <path
        d={"M15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.55 7.63 1.28.68 2.46 1.56 3.49 2.63 1.03-1.06 2.21-1.94 3.49-2.63zm-6.5 2.65c-.14-.1-.3-.19-.45-.29.15.11.31.19.45.29zm6.42-.25c-.13.09-.27.16-.4.26.13-.1.27-.17.4-.26zM12 15.45C9.85 12.17 6.18 10 2 10c0 5.32 3.36 9.82 8.03 11.49.63.23 1.29.4 1.97.51.68-.12 1.33-.29 1.97-.51C18.64 19.82 22 15.32 22 10c-4.18 0-7.85 2.17-10 5.45z"} />
    </g>
  </SvgIcon>
));

const styles = {
  Food: {
    fontSize: 32
    , stroke: GameStyles.defaultColorConfig.textDisabled
    , fill: GameStyles.defaultColorConfig.fillDisabled
    , transition: '.5s transform linear'
    , '&.isPlaceholder': {
      stroke: '#AAA'
      , fill: '#FFF'
    }
    , '&.canStart': {
      cursor: 'pointer'
      , fill: GameStyles.defaultColorConfig.fillActive
      , stroke: GameStyles.defaultColorConfig.fillActiveHover
    }
    , '&.canStart:hover, &.canStart:focus': {
      fill: GameStyles.defaultColorConfig.fillActiveHover
      , stroke: GameStyles.defaultColorConfig.textActive
      , outline: '0px solid white !important'
    }
    , '&.isInteracting': {
      fill: GameStyles.defaultColorConfig.fillInteracting
      , stroke: GameStyles.defaultColorConfig.textInteracting
      , animation: `interaction-pulsate 1000ms ease-in-out infinite`
    }
  }
};

export const Food = withStyles(styles)(({
                                          classes
                                          , className
                                          , canStart
                                          , isPlaceholder
                                          , startInteraction
                                          , isInteracting
                                        }) => (
  <Tooltip title={T.translate('Game.Icon.Food')}>
    <IconFood className={cn(classes.Food, className, {isPlaceholder, canStart, isInteracting})}
              onClick={startInteraction}
    />
  </Tooltip>
));

Food.defaultProps = {
  startInteraction: noop
};

export const InteractiveFood = compose(
  setPropTypes({
    index: PropTypes.number.isRequired
    , sourceId: PropTypes.string
  })
  , connect(state => {
    const game = state.game;
    return {
      canStart: game.isPlayerTurn()
        && game.status.phase === PHASE.FEEDING
        && !game.cooldowns.checkFor(TRAIT_COOLDOWN_LINK.EATING, game.userId)
    }
  })
  , InteractionSource(DND_ITEM_TYPE.FOOD, {
    getIID: ({index, sourceId}) => DND_ITEM_TYPE.FOOD + index + sourceId
    , canStart: ({canStart}) => canStart
    , onStart: ({sourceId}) => ({sourceId})
  })
)(Food);

export default Food;