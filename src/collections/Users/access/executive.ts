import type {Access, FieldAccess, FieldAccessArgs, AccessArgs} from 'payload'
import {checkRole} from './checkRole'

const executive: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    if (checkRole(['executive'], user)) {
      return true
    }
  }

  return false
}

export const fieldExecutive: FieldAccess = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    if (checkRole(['executive'], user)) {
      return true
    }
  }

  return false
}

export default executive
