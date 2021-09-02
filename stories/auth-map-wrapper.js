import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { createMemoryHistory } from 'history'

import { Login, AuthActions, useAuthContext, InitStorage } from '@eqworks/common-login'
import { ThemeProvider } from '@eqworks/lumen-ui'


const AuthMapWrapper = ({ crossLoginLOCUS, children }) => {
  const { authState: { authenticated }, dispatch } = useAuthContext()
  const jwt = window.localStorage.getItem('auth_jwt')

  useEffect(() => {
    if (jwt) dispatch({ type: 'authenticated_user' })
  }, [dispatch, jwt])

  const crossLoginClick = () => {
    InitStorage('locus', ['auth_jwt'])
      .then(() => {
        dispatch({ type: 'authenticated_user' })
        dispatch({ type: 'clean_up_error' })
      })
      .catch((e) => {
        dispatch({
          type: 'email_error',
          header: true,
          content: 'No value found in cross storage or failed to connect. Please login with email.',
        })
        console.error(`Failed to save credentials. ${e}`)
      })
      .finally(() => dispatch({ type: 'auth_cl_loading', isLoading: false }))
  }

  if (!authenticated) {
    return (
      <ThemeProvider>
        <Login
          product='locus'
          actions={AuthActions}
          history={createMemoryHistory()}
          crossLoginClick={crossLoginLOCUS ? crossLoginClick : null}
        />
      </ThemeProvider>
    )
  }
  return children
}

AuthMapWrapper.propTypes = { crossLoginLOCUS: PropTypes.bool }
AuthMapWrapper.defaultProps = { crossLoginLOCUS: false }

export default AuthMapWrapper
