import {Header} from 'components/header'

function AppLayout({children}) {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  )
}

export {AppLayout}
