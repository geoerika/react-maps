import React from 'react'
import PropTypes from 'prop-types'

import { ButtonGroup, Button } from '@eqworks/lumen-labs'
import { AddPin, AddSquare, Trash } from '@eqworks/lumen-labs/dist/icons'


const DrawButtonGroup = ({ mode, setDrawModeOn, onErase }) => {
  return (
    <ButtonGroup variant='outlined' size='md' align='vertical'>
      <Button
        id='draw-button'
        onClick={setDrawModeOn}
      >
        {mode === 'create-point' ? <AddPin size='lg' /> : <AddSquare size='md' />}
      </Button>
      <Button
        id='delete-button'
        type='error'
        onClick={onErase}
      >
        <Trash size='md' fill='#b62628' />
      </Button>
    </ButtonGroup>
  )
}

DrawButtonGroup.propTypes = {
  mode: PropTypes.string.isRequired,
  setDrawModeOn: PropTypes.func.isRequired,
  onErase: PropTypes.func.isRequired,
}

export default DrawButtonGroup
