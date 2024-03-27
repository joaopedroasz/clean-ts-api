export const surveyPath = {
  get: {
    tags: ['Survey'],
    summary: 'API para listar todas as enquetes',
    security: [{
      apiKeyAuth: []
    }],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      204: {
        description: 'Sem conteúdo'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  post: {
    tags: ['Survey'],
    summary: 'API para criar uma enquete',
    security: [{
      apiKeyAuth: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurvey'
          }
        }
      }
    },
    responses: {
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
