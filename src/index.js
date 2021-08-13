import React from 'react'
import ReactDOM from 'react-dom'
import './global-styles'
import {App} from 'app'
import {AppProviders} from 'context'
import {ThemeProvider} from '@material-ui/core'
import {createTheme} from '@material-ui/core/styles'

const theme = createTheme({})

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('root')
)
