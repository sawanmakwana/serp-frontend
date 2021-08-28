import React from 'react'
import ReactDOM from 'react-dom'
import './global-styles'
import {App} from 'app'
import {AppProviders} from 'context'
import {ThemeProvider} from '@material-ui/core'
import theme from './theme/index'
import GlobalStyles from './components/GlobalStyles'

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('root')
)
