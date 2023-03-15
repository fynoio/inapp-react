import { renderWithQueryClient } from '@testUtils'
import { logRoles } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { NotificationsHomeBody } from './NotificationsHomeBody'

describe('NotificationsHomeBody Component', () => {
  const user = userEvent.setup()
  test('should render component NotificationsHomeBody', async () => {
    const { container } = renderWithQueryClient(<NotificationsHomeBody />)
    logRoles(container)
  })
})
