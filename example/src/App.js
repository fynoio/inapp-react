import React from 'react'

import { FynoInappCenter } from '@fyno/inapp'

const App = () => {
  const config = {
  mode: 'light',
  user: 'vinod',
  workspace: '1234',
  signature: 'ee6901d581bb7c0a787806d7f726c45852de9b0a1700e82a6f6e476ded4de07c',
  themeConfig: {
    logo: 'https://logo.clearbit.com/yahoo.com',
    // darkBackground: '#13005A',
    // lightBackground:"#F1F6F5",
    // primary:"#4B56D2"
  },
  toastConfig: {
    position: 'top-left',
    duration: 1000
  },
  notificationSettings: {
    position: 'top-left',
    duration: 3000
  }
}
return (
  <div className="App">
    <FynoInappCenter {...config}/>
  </div>
);
}

export default App
