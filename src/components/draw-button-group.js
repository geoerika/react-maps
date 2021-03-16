import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import AddLocationOutlinedIcon from '@material-ui/icons/AddLocationOutlined'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import { Button } from '@eqworks/lumen-ui'


const StyledButton = withStyles({
  root: {
    paddingLeft: '20px',
    maxWidth: '35px',
    minWidth: '35px',
    maxHeight: '30px',
    minHeight: '30px',
  },
})(Button)

const DrawButtonGroup = ({ mode, toggleDrawMode, onErase }) => (
  <ButtonGroup orientation='vertical'>
    <StyledButton
      startIcon={ mode === 'create-point' ? <AddLocationOutlinedIcon/> : <AddBoxOutlinedIcon/> }
      size='small'
      type='secondary'
      color='primary'
      onClick={ toggleDrawMode }
    />
    <StyledButton
      startIcon={ <DeleteOutlineIcon/> }
      size='small'
      type='secondary'
      color='secondary'
      onClick={ () => onErase() }
    />
  </ButtonGroup>
)

DrawButtonGroup.propTypes = {
  mode: PropTypes.string.isRequired,
  toggleDrawMode: PropTypes.func.isRequired,
  onErase: PropTypes.func.isRequired,
}

export default DrawButtonGroup
