'use strict'

const src = '../../../src'
const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const QueryProfileResult = require(`${src}/result/query-profile`)

Test('QueryProfileResult', resultTest => {
  let sandbox

  resultTest.beforeEach(t => {
    sandbox = Sinon.createSandbox()
    t.end()
  })

  resultTest.afterEach(t => {
    sandbox.restore()
    t.end()
  })

  resultTest.test('constructor should', constructorTest => {
    constructorTest.test('handle error with no ResponseData', test => {
      const soapResponse = {
        Envelope: {
          Body: {
            Response: {
              ReturnCode: { _: '404' },
              TextMessage: [
                { _: 'Not Found' },
                { _: 'DNS profile does not exist' },
                { _: 'Date: Tue May 30 18:54:10 GMT 2017' }
              ]
            }
          }
        }
      }

      const queryProfileResult = new QueryProfileResult(soapResponse)
      test.equal(queryProfileResult.code, 404)
      test.deepEqual(queryProfileResult.data, {})
      test.end()
    })

    constructorTest.test('parse response and set data field', test => {
      const profileId = 'TestDFSP'
      const tier = 3
      const customerId = 222
      const dateCreated = '2017-05-25T21:45:57.021Z'
      const ttl = 800
      const domain = 'domain'
      const order = 10
      const preference = 50
      const flags = 't'
      const service = 'E2U+mm'
      const regexpPattern = '^(.*)$'
      const regexpReplace = 'mm:001.504@mojaloop.org'
      const replacement = '.'
      const partnerId = 333

      const soapResponse = {
        Envelope: {
          Body: {
            Response: {
              ReturnCode: { _: '200' },
              TextMessage: [
                { _: 'OK' },
                { _: 'DNS profile queried successfully' },
                { _: 'Date: Tue May 30 18:54:10 GMT 2017' }
              ],
              ResponseData: {
                DNSProfileData: {
                  ProfileID: profileId,
                  Tier: tier.toString(),
                  Customer: { $: { id: customerId.toString() } },
                  IsInUse: 'False',
                  DateCreated: dateCreated,
                  NAPTR: [{
                    $: { ttl: ttl.toString() },
                    DomainName: domain,
                    Order: order.toString(),
                    Preference: preference.toString(),
                    Flags: flags,
                    Service: service,
                    Regexp: { $: { pattern: regexpPattern }, _: regexpReplace },
                    Replacement: replacement,
                    Partner: { $: { id: partnerId.toString() } }
                  }]
                }
              }
            }
          }
        }
      }

      const queryProfileResult = new QueryProfileResult(soapResponse)
      test.equal(queryProfileResult.code, 200)

      const queryProfileData = queryProfileResult.data
      test.equal(queryProfileData.customerId, customerId)
      test.notOk(queryProfileData.isInUse)
      test.equal(queryProfileData.created, dateCreated)
      test.equal(queryProfileData.profile.id, profileId)
      test.equal(queryProfileData.profile.tier, tier)
      test.equal(queryProfileData.profile.records.length, 1)

      const recordData = queryProfileData.profile.records[0]
      test.equal(recordData.ttl, ttl)
      test.equal(recordData.domain, domain)
      test.equal(recordData.order, order)
      test.equal(recordData.preference, preference)
      test.equal(recordData.flags, flags)
      test.equal(recordData.service, service)
      test.equal(recordData.regexp.pattern, regexpPattern)
      test.equal(recordData.regexp.replace, regexpReplace)
      test.equal(recordData.replacement, replacement)
      test.equal(recordData.partnerId, partnerId)
      test.end()
    })

    constructorTest.test('handle single NAPTR record', test => {
      const profileId = 'TestDFSP'
      const customerId = 222
      const dateCreated = '2017-05-25T21:45:57.021Z'
      const ttl = 800
      const domain = 'domain'
      const order = 10
      const preference = 50
      const flags = 't'
      const service = 'E2U+mm'
      const regexpPattern = '^(.*)$'
      const regexpReplace = 'mm:001.504@mojaloop.org'
      const replacement = '.'
      const partnerId = 333

      const soapResponse = {
        Envelope: {
          Body: {
            Response: {
              ReturnCode: { _: '200' },
              TextMessage: [
                { _: 'OK' },
                { _: 'DNS profile queried successfully' },
                { _: 'Date: Tue May 30 18:54:10 GMT 2017' }
              ],
              ResponseData: {
                DNSProfileData: {
                  ProfileID: profileId,
                  Customer: { $: { id: customerId.toString() } },
                  IsInUse: 'False',
                  DateCreated: dateCreated,
                  NAPTR: {
                    $: { ttl: ttl.toString() },
                    DomainName: domain,
                    Order: order.toString(),
                    Preference: preference.toString(),
                    Flags: flags,
                    Service: service,
                    Regexp: { $: { pattern: regexpPattern }, _: regexpReplace },
                    Replacement: replacement,
                    Partner: { $: { id: partnerId.toString() } }
                  }
                }
              }
            }
          }
        }
      }

      const queryProfileResult = new QueryProfileResult(soapResponse)
      test.equal(queryProfileResult.code, 200)

      const queryResultData = queryProfileResult.data
      test.equal(queryResultData.customerId, customerId)
      test.notOk(queryResultData.isInUse)
      test.equal(queryResultData.created, dateCreated)
      test.equal(queryResultData.profile.id, profileId)
      test.equal(queryResultData.profile.records.length, 1)

      const recordData = queryResultData.profile.records[0]
      test.equal(recordData.ttl, ttl)
      test.equal(recordData.domain, domain)
      test.equal(recordData.order, order)
      test.equal(recordData.preference, preference)
      test.equal(recordData.flags, flags)
      test.equal(recordData.service, service)
      test.equal(recordData.regexp.pattern, regexpPattern)
      test.equal(recordData.regexp.replace, regexpReplace)
      test.equal(recordData.replacement, replacement)
      test.equal(recordData.partnerId, partnerId)
      test.end()
    })

    constructorTest.end()
  })

  resultTest.end()
})
