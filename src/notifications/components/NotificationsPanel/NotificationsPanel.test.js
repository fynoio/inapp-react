import { renderWithQueryClient } from '@testUtils'
import { logRoles } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { NotificationsPanel } from './NotificationsPanel'

describe('NotificationsPanel Component', () => {
  const user = userEvent.setup()
  test('should render component NotificationsPanel', async () => {
    const { container } = renderWithQueryClient(<NotificationsPanel />)
    logRoles(container)
  })
})
