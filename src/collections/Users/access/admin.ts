import type {Access, FieldAccess, FieldAccessArgs, AccessArgs} from 'payload'
import {checkRole} from './checkRole'

const admin: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }
  }

  return false
}

export const fieldAdmin: FieldAccess = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }
  }

  return false
}

export default admin
