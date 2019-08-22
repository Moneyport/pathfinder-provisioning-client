'use strict'

const src = '../../src'
const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const Profile = require(`${src}/profile`)

Test('Profile', profileTest => {
  let sandbox

  profileTest.beforeEach(t => {
    sandbox = Sinon.createSandbox()
    t.end()
  })

  profileTest.afterEach(t => {
    sandbox.restore()
    t.end()
  })

  profileTest.test('constructor should', constructorTest => {
    constructorTest.test('set supplied options', test => {
      const opts = { id: 'test', tier: 3, records: [{}] }

      const profile = new Profile(opts)
      test.equal(profile.id, opts.id)
      test.equal(profile.tier, opts.tier)
      test.equal(profile.records, opts.records)

      test.end()
    })

    constructorTest.test('set default options if not supplied', test => {
      const opts = { id: 'test' }

      const profile = new Profile(opts)
      test.equal(profile.id, opts.id)
      test.equal(profile.tier, 2)
      test.deepEqual(profile.records, [])

      test.end()
    })

    constructorTest.test('do not set records prop if not array', test => {
      const opts = { id: 'test', records: {} }

      const profile = new Profile(opts)
      test.equal(profile.id, opts.id)
      test.deepEqual(profile.records, [])

      test.end()
    })

    constructorTest.end()
  })

  profileTest.test('addRecord should', addRecordTest => {
    addRecordTest.test('append record to list', test => {
      const opts = { id: 'test', records: [{}] }

      const profile = new Profile(opts)
      test.equal(profile.records.length, 1)

      profile.addRecord({})
      test.equal(profile.records.length, 2)

      test.end()
    })

    addRecordTest.end()
  })

  profileTest.test('clearRecords should', clearRecordsTest => {
    clearRecordsTest.test('clear the current records', test => {
      const record = { order: 1, preference: 5 }
      const opts = { id: 'test', records: [record] }

      const profile = new Profile(opts)
      test.equal(profile.records.length, 1)

      profile.clearRecords()
      test.equal(profile.records.length, 0)

      test.end()
    })

    clearRecordsTest.test('not create new records array', test => {
      const record = { order: 1, preference: 5 }
      const opts = { id: 'test', records: [record] }

      const profile = new Profile(opts)
      test.equal(profile.records.length, 1)

      const existingRecods = profile.records

      profile.clearRecords()
      test.equal(profile.records, existingRecods)

      test.end()
    })

    clearRecordsTest.end()
  })

  profileTest.test('toSoap should', toSoapTest => {
    toSoapTest.test('convert profile to object for SOAP API', test => {
      const soapRecord = {}
      const record = { toSoap: sandbox.stub().returns(soapRecord) }

      const profileId = 'test'

      const profile = new Profile({ id: profileId, records: [record] })
      const soapProfile = profile.toSoap()

      test.equal(soapProfile.ProfileID, profileId)
      test.equal(soapProfile.Tier, 2)
      test.equal(soapProfile.NAPTR.length, 1)
      test.equal(soapProfile.NAPTR[0], soapRecord)
      test.end()
    })

    toSoapTest.end()
  })

  profileTest.end()
})
