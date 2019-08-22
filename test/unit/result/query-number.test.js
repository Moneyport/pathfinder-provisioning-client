'use strict'

const src = '../../../src'
const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const Phone = require(`${src}/phone`)
const QueryNumberResult = require(`${src}/result/query-number`)

Test('QueryNumberResult', resultTest => {
  let sandbox

  resultTest.beforeEach(t => {
    sandbox = Sinon.createSandbox()
    sandbox.stub(Phone, 'format')
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
                { _: 'No TN profile could be found' },
                { _: 'Date: Tue May 30 18:54:10 GMT 2017' }
              ]
            }
          }
        }
      }

      const queryNumberResult = new QueryNumberResult(soapResponse)
      test.equal(queryNumberResult.code, 404)
      test.deepEqual(queryNumberResult.data, {})
      test.end()
    })

    constructorTest.test('parse single response and set data field as array', test => {
      const customerId = 222
      const countryCode = 1
      const nationalNumber = 5158675309
      const formattedTn = `+${countryCode}${nationalNumber}`
      const dateCreated = '2017-05-25T21:45:57.021Z'
      const status = 'active'
      const profileId = 'TestDFSP'
      const tier = 3

      const soapResponse = {
        Envelope: {
          Body: {
            Response: {
              ReturnCode: { _: '200' },
              TextMessage: [
                { _: 'OK' },
                { _: '1 TN profile is queried successfully' },
                { _: 'Date: Tue May 30 18:54:10 GMT 2017' }
              ],
              ResponseData: {
                TNData: {
                  TN: {
                    Base: nationalNumber.toString(),
                    CountryCode: countryCode.toString()
                  },
                  Customer: { $: { id: customerId.toString() } },
                  DateCreated: dateCreated,
                  Status: status,
                  DNSProfileID: profileId,
                  Tier: tier.toString()
                }
              }
            }
          }
        }
      }

      Phone.format.returns(formattedTn)

      const queryNumberResult = new QueryNumberResult(soapResponse)
      test.equal(queryNumberResult.code, 200)
      test.equal(queryNumberResult.data.length, 1)

      const queryNumberData = queryNumberResult.data[0]
      test.equal(queryNumberData.customerId, customerId)
      test.equal(queryNumberData.created, dateCreated)
      test.equal(queryNumberData.profileId, profileId)
      test.equal(queryNumberData.tier, tier)
      test.equal(queryNumberData.status, status)
      test.equal(queryNumberData.tn, formattedTn)
      test.ok(Phone.format.calledWith(nationalNumber, countryCode))
      test.end()
    })

    constructorTest.test('parse multiple TNData and set data field as array', test => {
      const customerId = 222
      const countryCode = 1
      const nationalNumber = 5158675309
      const countryCode2 = 44
      const nationalNumber2 = 3022121211
      const formattedTn = `+${countryCode}${nationalNumber}`
      const formattedTn2 = `+${countryCode2}${nationalNumber2}`
      const dateCreated = '2017-05-25T21:45:57.021Z'
      const status = 'active'
      const profileId = 'TestDFSP'
      const tier = 3

      const soapResponse = {
        Envelope: {
          Body: {
            Response: {
              ReturnCode: { _: '200' },
              TextMessage: [
                { _: 'OK' },
                { _: '2 TN profiles are queried successfully' },
                { _: 'Date: Tue May 30 18:54:10 GMT 2017' }
              ],
              ResponseData: {
                TNData: [{
                  TN: {
                    Base: nationalNumber.toString(),
                    CountryCode: countryCode.toString()
                  },
                  Customer: { $: { id: customerId.toString() } },
                  DateCreated: dateCreated,
                  Status: status,
                  DNSProfileID: profileId,
                  Tier: tier.toString()
                },
                {
                  TN: {
                    Base: nationalNumber2.toString(),
                    CountryCode: countryCode2.toString()
                  },
                  Customer: { $: { id: customerId.toString() } },
                  DateCreated: dateCreated,
                  Status: status,
                  DNSProfileID: profileId,
                  Tier: tier.toString()
                }]
              }
            }
          }
        }
      }

      Phone.format.withArgs(nationalNumber, countryCode).returns(formattedTn)
      Phone.format.withArgs(nationalNumber2, countryCode2).returns(formattedTn2)

      const queryNumberResult = new QueryNumberResult(soapResponse)
      test.equal(queryNumberResult.code, 200)
      test.equal(queryNumberResult.data.length, 2)

      const queryNumberData = queryNumberResult.data[0]
      test.equal(queryNumberData.customerId, customerId)
      test.equal(queryNumberData.created, dateCreated)
      test.equal(queryNumberData.profileId, profileId)
      test.equal(queryNumberData.tier, tier)
      test.equal(queryNumberData.status, status)
      test.equal(queryNumberData.tn, formattedTn)

      const queryNumberData2 = queryNumberResult.data[1]
      test.equal(queryNumberData2.customerId, customerId)
      test.equal(queryNumberData2.created, dateCreated)
      test.equal(queryNumberData2.profileId, profileId)
      test.equal(queryNumberData2.tier, tier)
      test.equal(queryNumberData2.status, status)
      test.equal(queryNumberData2.tn, formattedTn2)

      test.end()
    })

    constructorTest.end()
  })

  resultTest.end()
})
