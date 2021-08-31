import React from 'react'
import Helmet from 'react-helmet'

const DocumentTitle = ({title}) => {
  const defaultTitle = 'SERP'
  return (
    <Helmet>
      <title>{`${title} | SERP` || defaultTitle}</title>
    </Helmet>
  )
}

export {DocumentTitle}
