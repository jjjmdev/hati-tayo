export function getPeople() {
  if (!localStorage.getItem('people')) {
    return []
  }

  return JSON.parse(localStorage.getItem('people'))
}

export function setPeople(people) {
  localStorage.setItem('people', JSON.stringify(people))
}

export function addPeople(name) {
  const people = getPeople()
  const normalizedName = name.trim()

  // Check for empty name
  if (normalizedName === '') {
    return {
      success: false,
      reason: 'empty',
    }
  }

  // Check for duplicate name (case-insensitive)
  if (people.some((person) => person.name === name))
    return {
      success: false,
      reason: 'duplicate',
    }

  people.push({
    id: crypto.randomUUID(),
    name: normalizedName,
  })
  setPeople(people)

  return { success: true }
}

export function deletePeople(id) {
  const people = getPeople()

  setPeople(
    people.filter((person) => {
      return person.id !== id
    }),
  )
}
