import { renderWithQueryClient } from '@testUtils'
import { logRoles } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { NotificationsTabs } from './NotificationsTabs'

describe('NotificationsTabs Component', () => {
  const user = userEvent.setup()
  test('should render component NotificationsTabs', async () => {
    const { container } = renderWithQueryClient(<NotificationsTabs />)
    logRoles(container)
  })
})
