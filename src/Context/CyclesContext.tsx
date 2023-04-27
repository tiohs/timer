import {
  createContext,
  ReactNode,
  useState,
  useReducer,
  useEffect,
} from 'react'
import { cyclesReducers } from '../reducers/cycles/reducer'
import { ActionsType } from '../constants/ActionsTypes'
import {
  InterruptCurrentCycle,
  MarkCurrentCycleAsFinish,
  addNewCycleAction,
} from '../reducers/cycles/action'
import { differenceInSeconds } from 'date-fns'

interface CreateCycle {
  task: string
  minutesAmount: number
}
export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishDate?: Date
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setAmountSecondsPassedFunction: (secund: number) => void
  createNewCycle: (data: CreateCycle) => void
  InterruptCorrenteCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}
export interface CyclesStates {
  cycles: Cycle[]
  activeCycleId: string | null
}
export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesActive, dispatch] = useReducer(
    cyclesReducers,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
    },
  )

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesActive)

    localStorage.setItem('@ignite-timer:cycles-state', stateJSON)
  }, [cyclesActive])

  const { cycles, activeCycleId } = cyclesActive

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  function setAmountSecondsPassedFunction(second: number) {
    setAmountSecondsPassed(second)
  }

  function markCurrentCycleAsFinished() {
    dispatch(MarkCurrentCycleAsFinish())
  }
  function createNewCycle(data: CreateCycle) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
    // reset()
  }

  function InterruptCorrenteCycle() {
    dispatch(InterruptCurrentCycle())
  }
  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setAmountSecondsPassedFunction,
        createNewCycle,
        InterruptCorrenteCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
