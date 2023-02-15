import { renderWithQueryClient } from '@testUtils'
import { logRoles } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { ConfigPanel } from './ConfigPanel'

describe('ConfigPanel Component', () => {
  const user = userEvent.setup()
  test('should render component ConfigPanel', async () => {
    const { container } = renderWithQueryClient(<ConfigPanel />)
    logRoles(container)
  })
})
