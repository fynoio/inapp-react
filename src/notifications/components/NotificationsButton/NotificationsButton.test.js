import { renderWithQueryClient } from '@testUtils'
import { logRoles } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { NotificationsButton } from './NotificationsButton'

describe('NotificationsButton Component', () => {
  const user = userEvent.setup()
  test('should render component NotificationsButton', async () => {
    const { container } = renderWithQueryClient(<NotificationsButton />)
    logRoles(container)
  })
})
