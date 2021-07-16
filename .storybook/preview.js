import React from 'react'

import { ThemeProvider } from '@eqworks/lumen-ui'

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <div style={{ overflow: 'scroll' }}>
        <Story />
      </div>
    </ThemeProvider>
  ),
]
