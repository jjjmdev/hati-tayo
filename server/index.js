const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' })
}

const app = express()
app.use(express.json())
app.use(cors())

const HatianSchema = new mongoose.Schema({
  shareId: {
    type: String,
    required: true,
    unique: true,
  },

  data: {
    people: { type: Array, default: [] },
    expenses: { type: Array, default: [] },
  },

  permissions: {
    editable: { type: Boolean, default: true },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Hatian = mongoose.model('Hatians', HatianSchema, 'hatians')

// CREATE a new hatian
app.post('/api/hatian', async (req, res) => {
  try {
    const { people = [], expenses = [], editable = true } = req.body
    // (e.g., "abc123-def456")
    const shareId = uuidv4().slice(0, 5)

    const hatian = await Hatian.create({
      shareId,
      data: { people, expenses },
      permissions: { editable },
    })

    res.json({ success: true, shareId: hatian.shareId })
  } catch (error) {
    console.error('Error creating group:', error)
    res.status(500).json({ success: false, error: 'Failed to create hatian' })
  }
})

// GET hatian data by shareId
app.get('/api/hatian/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params

    const hatian = await Hatian.findOne({ shareId })

    if (!hatian) {
      return res.status(404).json({ success: false, error: 'Hatian not found' })
    }

    res.json({
      success: true,
      data: hatian.data,
      permissions: hatian.permissions,
    })
  } catch (error) {
    console.error('Error fetching hatian:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch hatian' })
  }
})

// UPDATE hatian data (save changes)
app.put('/api/hatian/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params
    const { data, permissions } = req.body
    const hatian = await Hatian.findOne({ shareId })

    if (!hatian) {
      return res.status(404).json({ success: false, error: 'Hatian not found' })
    }

    if (!hatian.permissions.editable) {
      return res.status(403).json({
        success: false,
        error: 'This link is read-only',
      })
    }

    await Hatian.findOneAndUpdate(
      { shareId },
      { data, permissions, updatedAt: Date.now() },
      { returnDocument: 'after' },
    )

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating hatian:', error)
    res.status(500).json({ success: false, error: 'Failed to update hatian' })
  }
})

// UPDATE permissions only
app.put('/api/hatian/:shareId/permissions', async (req, res) => {
  try {
    const { shareId } = req.params
    const { permissions } = req.body

    await Hatian.findOneAndUpdate(
      { shareId },
      { permissions, updatedAt: Date.now() },
      { returnDocument: 'after' },
    )

    res.json({ success: true })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: 'Failed to update permissions' })
  }
})

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found in environment variables')
  console.log('Please add MONGODB_URI to your environment variables')
  process.exit(1)
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB!')

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(
        express.static(path.join(__dirname, '../dist'), {
          setHeaders: (res, path) => {
            if (path.endsWith('.js')) {
              res.setHeader('Content-Type', 'application/javascript')
            }
          },
        }),
      )
      app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'))
      })
    }

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error)
    process.exit(1)
  })
