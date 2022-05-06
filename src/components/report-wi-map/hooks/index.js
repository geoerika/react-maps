import { useState, useReducer } from 'react'


export const useTimeline = (timestampInit, speedInterval) => {
  const [player, setPlayer] = useState(false)
  // NOTE: reducers should be "pure", so can't manage the player
  const [timeline, timelineDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'move') {
      const activeIndex = state.activeIndex + 1 * state.direction
      if ((state.direction < 0 && activeIndex <= 0) ||
      (state.direction > 0 && activeIndex >= state.timestamps.length -1)) {
        clearInterval(player)
        setPlayer(false)
      }
      return {
        ...state,
        activeIndex,
      }
    }
    if (type === 'manual') {
      return {
        ...state,
        activeIndex: state.activeIndex + payload,
      }
    }
    if (type === 'speed') {
      return {
        ...state,
        speed: state.speed + payload,
      }
    }
    // reset options and stop timer
    if (type === 'timestamps') {
      return {
        timestamps: payload,
        direction: 1,
        activeIndex: 0,
        speed: speedInterval,
      }
    }

    return {
      ...state,
      [type]: payload,
    }
  }, { direction: 1, activeIndex: 0, speed: speedInterval, timestamps: timestampInit })

  const resetPlayer = speed => oldPlayer => {
    clearInterval(oldPlayer)
    return setInterval(() => timelineDispatch({ type: 'move' }), speed)
  }

  const forward = () => {
    if (player) {
      setPlayer(resetPlayer(timeline.speed))
    }
    timelineDispatch({ type: 'direction', payload: 1 })
  }

  const rewind = () => {
    if (player) {
      setPlayer(resetPlayer(timeline.speed))
    }
    timelineDispatch({ type: 'direction', payload: -1 })
  }

  const startTimeline = () => {
    if(!player) {
      setPlayer(resetPlayer(timeline.speed))
    }
  }

  const stopTimeline = () => {
    clearInterval(player)
    setPlayer(false)
  }

  const changeSpeed = value => () => {
    timelineDispatch({ type: 'speed', payload: value })
    if (player) {
      setPlayer(resetPlayer(timeline.speed + value))
    }
  }

  const reset = () => timelineDispatch({ type: 'activeIndex', payload: 0 })
  const move = payload => () => timelineDispatch({ type: 'manual', payload })

  return {
    forward,
    rewind,
    startTimeline,
    stopTimeline,
    changeSpeed,
    reset,
    move,
    player,
    timelineDispatch,
    ...timeline,
  }
}

export { useReport, useFullReport } from './report'
