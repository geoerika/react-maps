import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'


const ControlContainer = styled.div`
  flex-grow: 1;
  padding: 5px;
`

const ControlButton = styled.button`
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  border-radius: 7px;
  border: 1px solid ${({ disabled }) => disabled ? 'rgba(0,0,0,0.2)' : 'black'};
  color: ${({ disabled }) => disabled ? 'rgba(0,0,0,0.2)' : 'black'};
  background-color: white;
  margin-left: 5px;
  padding: 3px;
  font-family: roboto;
  font-weight: 900;
  font-size: 10px;
`

const Subtext = styled.div`
  font-size: 7px;
  color: rgba(0,0,0,0.7);
`

const propTypes = {
  forward: PropTypes.func.isRequired,
  rewind: PropTypes.func.isRequired,
  startTimeline: PropTypes.func.isRequired,
  stopTimeline: PropTypes.func.isRequired,
  changeSpeed: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  player: PropTypes.number.isRequired,
  direction: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  timestamps: PropTypes.array.isRequired,
}

export const TimelineControls = ({
  forward,
  rewind,
  startTimeline,
  stopTimeline,
  changeSpeed, // milliseconds
  // reset,
  move,
  player,
  direction,
  activeIndex,
  speed, // TODO max and min speed built in
  timestamps,
}) => (
  <ControlContainer>
    <div>
      <Subtext>Period {activeIndex + 1} of {timestamps.length}</Subtext>
      <ControlButton onClick={startTimeline} disabled={player || (direction > 0 && activeIndex >= timestamps.length - 1) || (direction < 0 && activeIndex <= 0)}>Start</ControlButton>
      <ControlButton onClick={stopTimeline} disabled={!player}>Stop</ControlButton>
    </div>
    <div>
      <ControlButton onClick={move(-1)} disabled={!activeIndex}>{`<<`} Step</ControlButton>
      <ControlButton onClick={move(1)} disabled={activeIndex === timestamps.length - 1}>Step {`>>`}</ControlButton>
    </div>
    <div>
      <ControlButton onClick={forward} disabled={direction > 0}>Forward</ControlButton>
      <ControlButton onClick={rewind} disabled={direction < 0}>Rewind</ControlButton>
    </div>
    <div>
      <ControlButton onClick={changeSpeed(-100)} disabled={speed <= 0}>Speed Up</ControlButton>
      <ControlButton onClick={changeSpeed(100)} disabled={speed >= 1000}>Speed Down</ControlButton>
      <Subtext>Current Speed: {speed}ms per tick</Subtext>
    </div>
  </ControlContainer>
)

TimelineControls.propTypes = propTypes

export default TimelineControls
