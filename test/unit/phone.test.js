'use strict'

const src = '../../src'
const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const Errors = require(`${src}/errors`)
const Proxyquire = require('proxyquire')

Test('Phone', phoneTest => {
  let sandbox
  let phoneNumberStub
  let phoneUtilInstance
  let PhoneNumberUtil
  let PhoneNumberFormat
  let Phone

  phoneTest.beforeEach(t => {
    sandbox = Sinon.createSandbox()

    phoneNumberStub = sandbox.stub()
    phoneUtilInstance = { parse: sandbox.stub(), format: sandbox.stub(), isValidNumber: sandbox.stub() }
    PhoneNumberUtil = { getInstance: sandbox.stub().returns(phoneUtilInstance) }
    PhoneNumberFormat = { E164: 1 }

    Phone = Proxyquire(`${src}/phone`, { 'google-libphonenumber': { PhoneNumberFormat, PhoneNumberUtil, PhoneNumber: phoneNumberStub } })

    t.end()
  })

  phoneTest.afterEach(t => {
    sandbox.restore()
    t.end()
  })

  phoneTest.test('parse should', parseTest => {
    parseTest.test('parse number to get number and country code', test => {
      const countryCode = 1
      const nationalNumber = 5158675309
      const phoneNumber = `+${countryCode}${nationalNumber}`

      const parsed = sandbox.stub()
      parsed.getCountryCode = sandbox.stub().returns(countryCode)
      parsed.getNationalNumber = sandbox.stub().returns(nationalNumber)

      phoneUtilInstance.parse.returns(parsed)
      phoneUtilInstance.isValidNumber.returns(true)

      const res = Phone.parse(phoneNumber)
      test.ok(phoneUtilInstance.parse.calledWith(phoneNumber))
      test.ok(phoneUtilInstance.isValidNumber.calledWith(parsed))
      test.equal(res.nationalNumber, nationalNumber)
      test.equal(res.countryCode, countryCode)
      test.end()
    })

    parseTest.test('handle non-E164 formatted phone numbers', test => {
      const countryCode = 1
      const nationalNumber = 5158675309
      const phoneNumber = `${countryCode}-515-867-5309`
      const e164PhoneNumber = `+${countryCode}${nationalNumber}`

      const parsed = sandbox.stub()
      parsed.getCountryCode = sandbox.stub().returns(countryCode)
      parsed.getNationalNumber = sandbox.stub().returns(nationalNumber)

      phoneUtilInstance.parse.returns(parsed)
      phoneUtilInstance.isValidNumber.returns(true)

      const res = Phone.parse(phoneNumber)
      test.ok(phoneUtilInstance.parse.calledWith(e164PhoneNumber))
      test.ok(phoneUtilInstance.isValidNumber.calledWith(parsed))
      test.equal(res.nationalNumber, nationalNumber)
      test.equal(res.countryCode, countryCode)
      test.end()
    })

    parseTest.test('throw error if number is invalid', test => {
      const countryCode = 1
      const nationalNumber = 5158675309
      const phoneNumber = `+${countryCode}${nationalNumber}`

      const parsed = sandbox.stub()
      parsed.getCountryCode = sandbox.stub().returns(countryCode)
      parsed.getNationalNumber = sandbox.stub().returns(nationalNumber)

      phoneUtilInstance.parse.returns(parsed)
      phoneUtilInstance.isValidNumber.returns(false)

      try {
        Phone.parse(phoneNumber)
        test.fail('Should have thrown error')
        test.end()
      } catch (err) {
        test.ok(err instanceof Errors.InvalidPhoneNumberError)
        test.equal(err.message, 'The phone number is invalid')
        test.end()
      }
    })

    parseTest.end()
  })

  phoneTest.test('format should', formatTest => {
    formatTest.test('format national number and currency code into an E.164 format', test => {
      const countryCode = 1
      const nationalNumber = 5158675309
      const phoneNumber = `+${countryCode}${nationalNumber}`

      const phoneNumberObj = { setNationalNumber: sandbox.stub(), setCountryCode: sandbox.stub() }
      phoneNumberStub.returns(phoneNumberObj)

      phoneUtilInstance.format.returns(phoneNumber)

      const formatted = Phone.format(nationalNumber, countryCode)
      test.ok(phoneNumberStub.calledWithNew())
      test.ok(phoneNumberObj.setCountryCode.calledWith(countryCode))
      test.ok(phoneNumberObj.setNationalNumber.calledWith(nationalNumber))
      test.ok(phoneUtilInstance.format.calledWith(phoneNumberObj, PhoneNumberFormat.E164))
      test.equal(formatted, phoneNumber)
      test.end()
    })

    formatTest.end()
  })

  phoneTest.end()
})
