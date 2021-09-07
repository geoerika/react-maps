import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import AddLocationOutlinedIcon from '@material-ui/icons/AddLocationOutlined'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import { Button } from '@eqworks/lumen-ui'

const basicIconButtonStyle = {
  paddingLeft: '20px',
  maxWidth: '35px',
  minWidth: '35px',
  maxHeight: '30px',
  minHeight: '30px',
}

const StyledButtonDraw = withStyles({
  root: basicIconButtonStyle,
})(Button)

const StyledButtonDelete = withStyles(theme => ({
  root: {
    ...basicIconButtonStyle,
    color: `${theme.palette.error.main}`,
    borderColor: `${theme.palette.error.main}`,
  },
}))(Button)

const DrawButtonGroup = ({ mode, setDrawModeOn, onErase }) => {
  return (
    <ButtonGroup orientation='vertical'>
      <StyledButtonDraw
        startIcon={mode === 'create-point' ? <AddLocationOutlinedIcon /> : <AddBoxOutlinedIcon />}
        size='small'
        type='secondary'
        color='primary'
        onClick={setDrawModeOn}
      />
      <StyledButtonDelete
        startIcon={<DeleteOutlineIcon />}
        size='small'
        type='secondary'
        onClick={onErase}
      />
    </ButtonGroup>
  )
}

DrawButtonGroup.propTypes = {
  mode: PropTypes.string.isRequired,
  setDrawModeOn: PropTypes.func.isRequired,
  onErase: PropTypes.func.isRequired,
}

export default DrawButtonGroup
