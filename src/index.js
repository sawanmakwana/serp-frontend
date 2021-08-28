import React from 'react'
import ReactDOM from 'react-dom'
import './global-styles'
import {App} from 'app'
import {AppProviders} from 'context'
import {colors, createMuiTheme, ThemeProvider} from '@material-ui/core'
// import theme from './theme'
import shadows from './theme/shadows'
import typography from './theme/typography'
import GlobalStyles from './components/GlobalStyles'

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#F4F6F8',
      paper: colors.common.white,
    },
    primary: {
      contrastText: '#ffffff',
      main: '#5664d2',
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c',
    },
  },
  shadows,
  typography,
})

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
