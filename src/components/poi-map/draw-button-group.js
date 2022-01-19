import React from 'react'
import PropTypes from 'prop-types'

import { ButtonGroup, Button } from '@eqworks/lumen-labs'
import { Icons } from '@eqworks/lumen-labs'


const DrawButtonGroup = ({ mode, setDrawModeOn, onErase }) => {
  return (
    <ButtonGroup variant='outlined' size='md' align='vertical'>
      <Button
        id='draw-button'
        onClick={setDrawModeOn}
      >
        {mode === 'create-point' ? <Icons.AddPin size='lg' /> : <Icons.AddSquare size='md' />}
      </Button>
      <Button
        id='delete-button'
        type='error'
        onClick={onErase}
      >
        <Icons.Trash size='md' fill='#b62628' />
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
