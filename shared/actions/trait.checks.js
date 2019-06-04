import {ActionCheckError} from '../models/ActionCheckError';
import {
  checkGameDefined
  , checkGameHasUser
  , checkPlayerHasAnimal, getErrorInList
} from './checks';

import * as tt from '../models/game/evolution/traitTypes';
import * as pt from '../models/game/evolution/plantarium/plantTypes';
import * as ptt from '../models/game/evolution/plantarium/plantTraitTypes';
import ERRORS from './errors'

import {
  TRAIT_TARGET_TYPE
  , TRAIT_COOLDOWN_LINK, TRAIT_ANIMAL_FLAG
} from '../models/game/evolution/constants';
import {countUnavoidableDefenses, getStaticDefenses} from "../models/game/evolution/traitsData/TraitCarnivorous";
import {getTraitDataModel} from "../models/game/evolution/TraitModel";

export const checkTraitActivation = (game, animal, traitId, ...targets) => {
  const gameId = game.id;
  const trait = animal.hasTrait(traitId);
  if (!trait) {
    throw new ActionCheckError(`checkTraitActivation@Game(${gameId})`, 'Animal(%s) doesnt have Trait(%s)', animal.id, traitId)
  }
  const reason = trait.getErrorOfUse(game, animal, ...targets);
  if (!!reason) {
    throw new ActionCheckError(`server$traitActivate@Game(${game.id})`
      , `Animal(%s):Trait(%s) checkAction ${reason}`, animal.id, trait.type)
  }
  return trait;
};
export const checkTraitActivation_Target = (game, animal, trait, ...targets) => {
  let target = null;
  switch (trait.getDataModel().targetType) {
    case TRAIT_TARGET_TYPE.ANIMAL:
      target = checkTraitActivation_Animal(game, animal, trait, ...targets);
      break;
    case TRAIT_TARGET_TYPE.TRAIT:
      target = checkTraitActivation_Trait(game, animal, trait, ...targets);
      break;
    case TRAIT_TARGET_TYPE.TWO_TRAITS:
      target = checkTraitActivation_TwoTraits(game, animal, trait, ...targets);
      break;
    case TRAIT_TARGET_TYPE.NONE:
      break;
    default:
      throw new ActionCheckError(`server$traitActivate@Game(${game.id})`
        , 'Animal(%s):Trait(%s) unknown target type %s', animal.id, trait.type, trait.getDataModel().targetType)
  }
  return target;
};

export const checkTraitActivation_Animal = (game, sourceAnimal, trait, targetAid, ...targets) => {
  const gameId = game.id;
  let error;
  if (sourceAnimal.id === targetAid) {
    throw new ActionCheckError(`checkTraitActivation_Animal@Game(${gameId})`
      , 'Animal(%s):Trait(%s) cant target self', sourceAnimal.id, trait.type)
  }

  const targetAnimal = game.locateAnimal(targetAid);
  if (!targetAnimal) {
    throw new ActionCheckError(`checkTraitActivation_Animal@Game(${gameId})`
      , 'Animal(%s):Trait(%s) cant locate Animal(%s)', sourceAnimal.id, trait.type, targetAid)
  }
  error = trait.getDataModel().getErrorOfUseOnTarget(game, sourceAnimal, targetAnimal, ...targets);
  if (error) {
    throw new ActionCheckError(`checkTraitActivation_Animal@Game(${gameId})`
      , 'Animal(%s):Trait(%s) checkTarget on Animal(%s) failed', sourceAnimal.id, trait.type, targetAnimal.id, error)
  }
  return targetAnimal;
};

export const checkTraitActivation_Trait = (game, sourceAnimal, trait, traitId) => {
  const gameId = game.id;
  const targetTrait = sourceAnimal.hasTrait(traitId, true);
  if (!targetTrait) {
    throw new ActionCheckError(`checkTraitActivation_Trait@Game(${gameId})`
      , 'Animal(%s):Trait#%s cant find Trait#%s', sourceAnimal.id, trait.type, traitId)
  }
  if (trait.getDataModel().getErrorOfUseOnTarget(game, sourceAnimal, targetTrait)) {
    throw new ActionCheckError(`checkTraitActivation_Trait@Game(${gameId})`
      , 'Animal(%s):Trait(%s) checkTarget on Trait@%s failed', sourceAnimal.id, trait.type, targetTrait.type)
  }
  return targetTrait;
};

// Recombination only
export const checkTraitActivation_TwoTraits = (game, sourceAnimal, trait, trait1id, trait2id) => {
  const gameId = game.id;
  const linkedAnimal = game.locateAnimal(
    sourceAnimal.id === trait.hostAnimalId
      ? trait.linkAnimalId
      : trait.hostAnimalId
    , trait.ownerId
  );
  const trait1 = sourceAnimal.hasTrait(trait1id, true);
  if (!trait1) {
    throw new ActionCheckError(`checkTraitActivation_Trait@Game(${gameId})`
      , 'Animal(%s):Trait#%s cant find Trait#%s', sourceAnimal.id, trait.type, trait1Id)
  }
  const trait2 = linkedAnimal.hasTrait(trait2id, true);
  if (!trait2) {
    throw new ActionCheckError(`checkTraitActivation_Trait@Game(${gameId})`
      , 'Animal(%s):Trait#%s cant find Trait#%s', sourceAnimal.id, trait.type, trait2Id)
  }
  if (trait.getDataModel().getErrorOfUseOnTarget(game, sourceAnimal, trait1)) {
    throw new ActionCheckError(`checkTraitActivation_Trait@Game(${gameId})`
      , 'Animal(%s):Trait(%s) checkTarget on Trait@%s failed', sourceAnimal.id, trait.type, trait1.type)
  }
  if (trait.getDataModel().getErrorOfUseOnTarget(game, sourceAnimal, trait2)) {
    throw new ActionCheckError(`checkTraitActivation_Trait@Game(${gameId})`
      , 'Animal(%s):Trait(%s) checkTarget on Trait@%s failed', linkedAnimal.id, trait.type, trait2type)
  }
  return [trait1, trait2];
};

export const getErrorOfAnimalEating = (game, animal) => {
  if (game.cooldowns.checkFor(TRAIT_COOLDOWN_LINK.EATING, animal.ownerId, animal.id)) return ERRORS.COOLDOWN;
  if (!animal.canEat(game)) return ERRORS.ANIMAL_DONT_WANT_FOOD;
  return false;
};

export const getErrorOfAnimalEatingFromGame = (game, animal) => {
  if (game.getFood() < 1) return ERRORS.GAME_FOOD;
  return getErrorOfAnimalEating(game, animal);
};

export const getErrorOfAnimalEatingFromPlant = (game, animal, plant) => {
  if (plant.getFood() < 1) return ERRORS.PLANT_FOOD;

  return (
    getErrorOfAnimalEating(game, animal)
    || getErrorInList(plant.getTraits(), trait => trait.getDataModel().getErrorOfFoodIntake(game, plant, animal))
  );
};

export const getErrorOfPlantCounterAttack = (game, animal, plant) => {
  if (plant.type !== pt.PlantCarnivorous) return ERRORS.COUNTERATTACK_WRONG_TYPE;

  const unavoidable = countUnavoidableDefenses(game, plant, animal);
  if (unavoidable > 0) return ERRORS.TRAIT_ATTACK_UNAVOIDABLE;

  const defenses = getStaticDefenses(game, plant, animal);
  if (defenses.length > 1) return ERRORS.TRAIT_ATTACK_TOO_MUCH_DEFENSES;

  return getTraitDataModel(ptt.PlantTraitHiddenCarnivorous).getErrorOfUse(game, plant);
};

export const checkAnimalCanTakeShellFails = (game, animal) => {
  if (animal.hasTrait(tt.TraitShell, true)) return ERRORS.TRAIT_MULTIPLE;
  if (game.cooldowns.checkFor(TRAIT_COOLDOWN_LINK.EATING, animal.ownerId, animal.id)) return ERRORS.COOLDOWN;
  if (game.cooldowns.checkFor(TRAIT_COOLDOWN_LINK.TAKE_SHELL, animal.ownerId, animal.id)) return ERRORS.COOLDOWN;
  if (animal.hasFlag(TRAIT_ANIMAL_FLAG.REGENERATION)) return ERRORS.TRAIT_REGENERATION_DEAD;
  const traitRegeneration = animal.hasTrait(tt.TraitRegeneration, true);
  if (traitRegeneration && !traitRegeneration.getDataModel().checkTraitPlacement(animal)) return ERRORS.TRAIT_REGENERATION_TRAIT_MAX;
  return false;
};

export const checkIfTraitDisabledByIntellect = (attackAnimal, defenseTrait) => {
  const traitIntellect = attackAnimal.hasTrait(tt.TraitIntellect);
  return traitIntellect && (traitIntellect.value === defenseTrait.id || traitIntellect.value === defenseTrait.type);
};