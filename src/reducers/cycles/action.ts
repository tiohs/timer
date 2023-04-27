import { Cycle } from '../../Context/CyclesContext'
import { ActionsType } from '../../constants/ActionsTypes'

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionsType.ADD_NEW_CYCLE,
    payload: {
      newCycle,
    },
  }
}

export function MarkCurrentCycleAsFinish() {
  return {
    type: ActionsType.MARK_CURRENT_CYCLE_AS_FINISH,
  }
}

export function InterruptCurrentCycle() {
  return {
    type: ActionsType.INTERRUPT_CURRENT_CYCLE,
  }
}
