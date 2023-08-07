import request from 'supertest'
import app from '@main/config/app'

describe('Content Type Middleware', () => {
  it('should return default content type as json', async () => {
    app.get('/test_content_type_json', (req, res) => {
      res.send()
    })

    const response = await request(app).get('/test_content_type_json')

    expect(response.headers['content-type']).toContain('json')
  })

  it('should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })

    const response = await request(app).get('/test_content_type_xml')

    expect(response.headers['content-type']).toContain('xml')
  })
})
