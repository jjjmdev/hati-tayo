import { bgColors } from '../utils/constants'

export function usePeople(people) {
  const getPersonName = (id) => {
    return people.find((p) => p.id === id)?.name || ''
  }

  const getPersonColor = (id) => {
    const index = people.findIndex((p) => p.id === id)
    return bgColors[index % bgColors.length]
  }

  const getPersonInitial = (id) => {
    return getPersonName(id).charAt(0).toUpperCase()
  }

  return {
    getPersonName,
    getPersonColor,
    getPersonInitial,
  }
}
