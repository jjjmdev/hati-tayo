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

  if (name === '' || people.some((person) => person.name === name)) return false

  people.push({
    id: crypto.randomUUID(),
    name,
  })
  setPeople(people)

  return true
}

export function deletePeople(id) {
  const people = getPeople()

  setPeople(
    people.filter((person) => {
      return person.id !== id
    }),
  )
}
