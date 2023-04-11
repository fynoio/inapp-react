import React from 'react'

import { FynoInappCenter } from '@fyno/inapp'

const App = () => {
  const config = {
    mode: 'light',
    user: '<username>',
    workspace: '<wsid from fyno>',
    integration: '<integration id from fyno>',
    signature: '<signature generated on backend following inapp docs>',
    themeConfig: {
      logo: 'https://app.dev.fyno.io/images/fyno-logo.svg',
      darkBackground: '#13005A',
      lightBackground: '#F1F6F5',
      primary: '#4B56D2'
    },
    notificationSettings: {
      position: 'top-left',
      duration: 3000
    }
  }
  return (
    <div className='App'>
      <FynoInappCenter {...config} />
    </div>
  )
}

export default App
