import {fromJS} from 'immutable';
import {TRAIT_TARGET_TYPE
  , TRAIT_COOLDOWN_DURATION
  , TRAIT_COOLDOWN_PLACE
  , TRAIT_COOLDOWN_LINK
  , CARD_TARGET_TYPE
  , TRAIT_RESPONSE_TIMEOUT} from '../constants';

import {
  server$startFeeding
  , server$traitMimicryQuestion
  , server$traitMimicryAnswer
  , server$traitStartCooldown
} from '../../../../actions/actions';

import {addTimeout} from '../../../../utils/reduxTimeout';
import {getRandom} from '../../../../utils/randomGenerator';

import {FOOD_SOURCE_TYPE} from '../constants';

//

export {TraitCarnivorous} from './TraitCarnivorous';

export const TraitParasite = {
  type: 'TraitParasite'
  , cardTargetType: CARD_TARGET_TYPE.ANIMAL_ENEMY
  , food: 2
};

export const TraitFatTissue = {
  type: 'TraitFatTissue'
  , multiple: true
};

//

export const TraitSwimming = {
  type: 'TraitSwimming'
};

export const TraitRunning = {
  type: 'TraitRunning'
  , action: () => getRandom(0, 1) > 0
};

export const TraitMimicry = {
  type: 'TraitMimicry'
  , targetType: TRAIT_TARGET_TYPE.ANIMAL
  , cooldowns: fromJS([
    ['TraitMimicry', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ACTIVATION]
  ])
  , action: (game, mimicryAnimal, aggressorAnimal, traitData) => (dispatch, getState) => {
    const candidates = game.getPlayer(mimicryAnimal.ownerId).continent.filter((animal) =>
      mimicryAnimal.id !== animal.id
      && traitData.checkTarget(game, aggressorAnimal, animal)
    );
    switch (candidates.size) {
      case 0:
        return false;
      case 1:
        dispatch(server$traitStartCooldown(game.id, TraitMimicry, mimicryAnimal));
        dispatch(server$traitMimicryAnswer(game.id
          , aggressorAnimal.ownerId, aggressorAnimal.id
          , traitData.type
          , mimicryAnimal.ownerId, mimicryAnimal.id
          , candidates.get(0).ownerId, candidates.get(0).id
        ));
        return true;
      default:
        dispatch(server$traitStartCooldown(game.id, TraitMimicry, mimicryAnimal));
        dispatch(addTimeout(TRAIT_RESPONSE_TIMEOUT, 'traitAnswer', (dispatch, getState) => {
          dispatch(server$traitMimicryAnswer(game.id
            , aggressorAnimal.ownerId, aggressorAnimal.id
            , traitData.type
            , mimicryAnimal.ownerId, mimicryAnimal.id
            , candidates.get(0).ownerId, candidates.get(0).id
          ));
        }));
        dispatch(server$traitMimicryQuestion(game.id, mimicryAnimal.ownerId, mimicryAnimal.id, aggressorAnimal.ownerId, aggressorAnimal.id));
        return true;
    }
  }
};

export const TraitScavenger = {
  type: 'TraitScavenger'
  , checkTraitPlacement: (animal) => !animal.hasTrait('TraitCarnivorous')
};

//

export const TraitSymbiosis = {
  type: 'TraitSymbiosis'
  , cardTargetType: CARD_TARGET_TYPE.LINK_SELF_ONEWAY
};

export const TraitPiracy = {
  type: 'TraitPiracy'
  , targetType: TRAIT_TARGET_TYPE.ANIMAL
  , cooldowns: fromJS([
    ['TraitPiracy', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.TURN]
  ])
  , action: (game, sourceAnimal, targetAnimal) => dispatch => {
    dispatch(server$traitStartCooldown(game.id, TraitPiracy, sourceAnimal));
    dispatch(server$startFeeding(game.id, sourceAnimal, 1, FOOD_SOURCE_TYPE.ANIMAL_TAKE, targetAnimal.id));
    return true;
  }
  , checkAction: (game, sourceAnimal) => sourceAnimal.canEat(game)
  , checkTarget: (game, sourceAnimal, targetAnimal) => targetAnimal.food > 0 && !targetAnimal.canSurvive()
};

export const TraitTailLoss = {
  type: 'TraitTailLoss'
  , targetType: TRAIT_TARGET_TYPE.TRAIT
  , cooldowns: fromJS([
    ['TraitTailLoss', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ACTIVATION]
  ])
  , action: (game, mimicryAnimal, aggressorAnimal) => (dispatch, getState) => {
    //const candidates = game.getPlayer(mimicryAnimal.ownerId).continent.map((animal) => {
    //  animal
    //});
    //dispatch(addTimeout(TRAIT_RESPONSE_TIMEOUT, 'userResponse', (dispatch, getState) => {
    //  dispatch(ser)
    //}));
    //dispatch(server$traitMimicryQuestion(game.id, mimicryAnimal.ownerId, mimicryAnimal.id, aggressorAnimal.ownerId, aggressorAnimal.id));
    return true;
  }
};

export const TraitCommunication = {
  type: 'TraitCommunication'
  , cardTargetType: CARD_TARGET_TYPE.LINK_SELF
  //, cooldowns: fromJS([
  //  ['TraitCommunication', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ACTIVATION]
  //])
};

//

export const TraitGrazing = {
  type: 'TraitGrazing'
  , cooldowns: fromJS([
    ['TraitGrazing', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ROUND]
  ])
  , action: (target) => (getState, dispatch) => {
    // TODO target is animal
    if (this.checkTarget(target)) {
      // dispatch(traitStealFood)
    }
  }
  , checkAction: (game, sourceAnimal) => game.food > 0
};

export const TraitHighBodyWeight = {
  type: 'TraitHighBodyWeight'
  , food: 1
};

export const TraitHibernation = {
  type: 'TraitHibernation'
  , disableLastRound: true
  , cooldowns: fromJS([
    ['TraitHibernation', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.TWO_TURNS]
  ])
};

export const TraitPoisonous = {
  type: 'TraitPoisonous'
};

//

export const TraitCooperation = {
  type: 'TraitCooperation'
  //, cooldowns: fromJS([
  //  ['TraitCooperation', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ACTIVATION]
  //])
};

export const TraitBurrowing = {
  type: 'TraitBurrowing'
};

export const TraitCamouflage = {
  type: 'TraitCamouflage'
};

export const TraitSharpVision = {
  type: 'TraitSharpVision'
};