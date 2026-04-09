const API_BASE = 'http://localhost:3001/api/hatian'

async function handleResponse(response) {
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Something went wrong')
  }

  return result
}

export async function createHatian(people, expenses, editable = true) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ people, expenses, editable }),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error('createHatian error:', error)
    return { success: false, error: error.message }
  }
}

export async function getHatian(shareId) {
  try {
    const response = await fetch(`${API_BASE}/${shareId}`)
    return await handleResponse(response)
  } catch (error) {
    console.error('getHatian error:', error)
    return { success: false, error: error.message }
  }
}

export async function updateHatian(shareId, people, expenses) {
  try {
    const response = await fetch(`${API_BASE}/${shareId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { people, expenses },
        permissions: { editable: true },
      }),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error('updateHatian error:', error)
    return { success: false, error: error.message }
  }
}

export async function updateHatianPermissions(shareId, editable) {
  console.log(`${API_BASE}/${shareId}/permissions`)
  try {
    const response = await fetch(`${API_BASE}/${shareId}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions: { editable } }),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('updateHatianPermissions error:', error)
    return { success: false, error: error.message }
  }
}
