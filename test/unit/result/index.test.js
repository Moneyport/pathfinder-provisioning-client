'use strict'

const src = '../../../src'
const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const Proxyquire = require('proxyquire')
const Errors = require(`${src}/errors`)

Test('Result', resultTest => {
  let sandbox
  let baseResultStub
  let queryNumberResultStub
  let queryProfileResultStub
  let Result

  resultTest.beforeEach(t => {
    sandbox = Sinon.createSandbox()

    baseResultStub = sandbox.stub()
    queryNumberResultStub = sandbox.stub()
    queryProfileResultStub = sandbox.stub()
    Result = Proxyquire(`${src}/result`, { './base': baseResultStub, './query-number': queryNumberResultStub, './query-profile': queryProfileResultStub })

    t.end()
  })

  resultTest.afterEach(t => {
    sandbox.restore()
    t.end()
  })

  resultTest.test('base should', baseTest => {
    baseTest.test('create base result', test => {
      const result = { code: 200 }
      baseResultStub.returns(result)

      const soapResponse = {}
      Result.base(soapResponse)
        .then(res => {
          test.ok(baseResultStub.calledWithNew())
          test.ok(baseResultStub.calledWith(soapResponse))
          test.equal(res, result)
          test.end()
        })
    })

    baseTest.test('throw BadRequestError', test => {
      const result = { code: 400, messages: ['Test', '123'] }
      baseResultStub.returns(result)

      const soapResponse = {}
      Result.base(soapResponse)
        .then(res => {
          test.fail('Should have thrown error')
          test.end()
        })
        .catch(Errors.BadRequestError, err => {
          test.equal(err.message, 'Invalid request')
          test.equal(err.code, result.code)
          test.deepEqual(err.serverMessages, result.messages)
          test.end()
        })
    })

    baseTest.test('throw UnauthorizedError', test => {
      const result = { code: 401, messages: ['Test', '123'] }
      baseResultStub.returns(result)

      const soapResponse = {}
      Result.base(soapResponse)
        .then(res => {
          test.fail('Should have thrown error')
          test.end()
        })
        .catch(Errors.UnauthorizedError, err => {
          test.equal(err.message, 'Client lacks privileges to execute the requested operation')
          test.equal(err.code, result.code)
          test.deepEqual(err.serverMessages, result.messages)
          test.end()
        })
    })

    baseTest.test('throw NotFoundError', test => {
      const result = { code: 404, messages: ['Test', '123'] }
      baseResultStub.returns(result)

      const soapResponse = {}
      Result.base(soapResponse)
        .then(res => {
          test.fail('Should have thrown error')
          test.end()
        })
        .catch(Errors.NotFoundError, err => {
          test.equal(err.message, 'The requested resource could not be found')
          test.equal(err.code, result.code)
          test.deepEqual(err.serverMessages, result.messages)
          test.end()
        })
    })

    baseTest.test('throw InvalidValueError', test => {
      const result = { code: 420, messages: ['Test', '123'] }
      baseResultStub.returns(result)

      const soapResponse = {}
      Result.base(soapResponse)
        .then(res => {
          test.fail('Should have thrown error')
          test.end()
        })
        .catch(Errors.InvalidValueError, err => {
          test.equal(err.message, 'One or more request values is invalid')
          test.equal(err.code, result.code)
          test.deepEqual(err.serverMessages, result.messages)
          test.end()
        })
    })

    baseTest.test('throw ValueMissingError', test => {
      const result = { code: 421, messages: ['Test', '123'] }
      baseResultStub.returns(result)

      const soapResponse = {}
      Result.base(soapResponse)
        .then(res => {
          test.fail('Should have thrown error')
          test.end()
        })
        .catch(Errors.ValueMissingError, err => {
          test.equal(err.message, 'Required attributue value is missing')
          test.equal(err.code, result.code)
          test.deepEqual(err.serverMessages, result.messages)
          test.end()
        })
    })

    baseTest.test('throw ServerError', test => {
      const result = { code: 500, messages: ['Test', '123'] }
      baseResultStub.returns(result)

      const soapResponse = {}
      Result.base(soapResponse)
        .then(res => {
          test.fail('Should have thrown error')
          test.end()
        })
        .catch(Errors.ServerError, err => {
          test.equal(err.message, 'Unable to process the provisioning call due to a problem with PathFinder server')
          test.equal(err.code, result.code)
          test.deepEqual(err.serverMessages, result.messages)
          test.end()
        })
    })

    baseTest.test('throw ServiceUnavailableError', test => {
      const result = { code: 503, messages: ['Test', '123'] }
      baseResultStub.returns(result)

      const soapResponse = {}
      Result.base(soapResponse)
        .then(res => {
          test.fail('Should have thrown error')
          test.end()
        })
        .catch(Errors.ServiceUnavailableError, err => {
          test.equal(err.message, 'The server is currently unable to handle the request due to a temporary overload or maintenance on the server')
          test.equal(err.code, result.code)
          test.deepEqual(err.serverMessages, result.messages)
          test.end()
        })
    })

    baseTest.test('throw UnhandledCodeError', test => {
      const result = { code: 501, messages: ['Test', '123'] }
      baseResultStub.returns(result)

      const soapResponse = {}
      Result.base(soapResponse)
        .then(res => {
          test.fail('Should have thrown error')
          test.end()
        })
        .catch(Errors.UnhandledCodeError, err => {
          test.equal(err.message, `Received unhandled return code: ${result.code}`)
          test.equal(err.code, result.code)
          test.deepEqual(err.serverMessages, result.messages)
          test.end()
        })
    })

    baseTest.end()
  })

  resultTest.test('queryProfile should', queryProfileTest => {
    queryProfileTest.test('create query profile result', test => {
      const result = { code: 200 }
      queryProfileResultStub.returns(result)

      const soapResponse = {}
      Result.queryProfile(soapResponse)
        .then(res => {
          test.ok(queryProfileResultStub.calledWithNew())
          test.ok(queryProfileResultStub.calledWith(soapResponse))
          test.equal(res, result)
          test.end()
        })
    })

    queryProfileTest.end()
  })

  resultTest.test('queryNumber should', queryNumberTest => {
    queryNumberTest.test('create query number result', test => {
      const result = { code: 200 }
      queryNumberResultStub.returns(result)

      const soapResponse = {}
      Result.queryNumber(soapResponse)
        .then(res => {
          test.ok(queryNumberResultStub.calledWithNew())
          test.ok(queryNumberResultStub.calledWith(soapResponse))
          test.equal(res, result)
          test.end()
        })
    })

    queryNumberTest.end()
  })

  resultTest.end()
})
