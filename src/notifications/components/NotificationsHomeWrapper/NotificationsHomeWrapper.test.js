import { renderWithQueryClient } from '@testUtils'
import { logRoles } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { NotificationsHomeWrapper } from './NotificationsHomeWrapper'

describe('NotificationsHome Component', () => {
  const user = userEvent.setup()
  test('should render component NotificationsHomeWrapper', async () => {
    const { container } = renderWithQueryClient(<NotificationsHomeWrapper />)
    logRoles(container)
  })
})
