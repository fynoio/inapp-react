import { renderWithQueryClient } from '@testUtils'
import { logRoles } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { NotificationsList } from './NotificationsList'

describe('NotificationsList Component', () => {
  const user = userEvent.setup()
  test('should render component NotificationsList', async () => {
    const { container } = renderWithQueryClient(<NotificationsList />)
    logRoles(container)
  })
})
