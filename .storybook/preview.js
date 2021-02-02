import React from 'react'

import { ThemeProvider } from '@eqworks/lumen-ui'

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
]
