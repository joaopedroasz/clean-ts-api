import request from 'supertest'

import app from '@main/config/app'

describe('Survey Result Routes', () => {
  describe('PUT /surveys/:survey_id/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      const response = await request(app).put('/api/surveys/any_survey_id/results').send({
        answer: 'any_answer'
      })

      expect(response.statusCode).toBe(403)
    })
  })
})
