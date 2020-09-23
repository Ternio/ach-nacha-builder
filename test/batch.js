var chai     = require('chai')
    , _        = require('lodash')
    , expect   = chai.expect
    , Entry  = require('../lib/entry')
    , EntryAddenda  = require('../lib/entry-addenda')
    , EntryAddendaReturn  = require('../lib/entry-addenda-return')
    , Batch  = require('../lib/batch')
    , File   = require('../lib/file');

describe('Batch', function() {
    describe('Create Batch', function () {
        it('should create a batch successfully with entry', function () {
            const ts = new Date();

            const batch = new Batch({
                serviceClassCode: '220',
                companyName: 'Company Name',
                standardEntryClassCode: 'WEB',
                companyIdentification: '123456789', // ein
                companyEntryDescription: 'Payroll',
                companyDescriptiveDate: ts,
                effectiveEntryDate: ts,
                originatingDFI: '011600033'
            });

            const entry = new Entry({
                receivingDFI: '081000210',
                DFIAccount: '12345678901234567',
                amount: '3521',
                transactionCode: '22',
                idNumber: 'RAj##23920rjf31',
                individualName: 'Glen Selle',
                discretionaryData: 'A1'
            });

            batch.addEntry(entry);

            // TODO: validations

            batch.generateString(function (string) {
                console.log(string);
            });
        });

        it('should create a batch successfully with entry and return addenda', function () {
            const ts = new Date();

            const batch = new Batch({
                serviceClassCode: '220',
                companyName: 'Company Name',
                standardEntryClassCode: 'WEB',
                companyIdentification: '123456789', // ein
                companyEntryDescription: 'Payroll',
                companyDescriptiveDate: ts,
                effectiveEntryDate: ts,
                originatingDFI: '011600033'
            });

            const entry = new Entry({
                receivingDFI: '081000210',
                DFIAccount: '12345678901234567',
                amount: '3521',
                transactionCode: '22',
                idNumber: 'RAj##23920rjf31',
                individualName: 'Glen Selle',
                discretionaryData: 'A1'
            });

            const addenda = new EntryAddendaReturn({
                originalEntryTraceNumber: '000000001234565',
                originalReceivingDFI: '081000210',
                returnReasonCode: 'R17',
                addendaInformation: 'QUESTIONABLE'
            });

            expect(entry.getRecordCount()).to.equal(1);

            entry.addReturnAddenda(addenda);
            batch.addEntry(entry);

            expect(entry.getRecordCount()).to.equal(2);
            expect(entry.get('addendaId')).to.equal('1');
            expect(addenda.get('returnReasonCode')).to.equal('R17');
            expect(addenda.get('addendaInformation')).to.equal('QUESTIONABLE');
            expect(addenda.get('traceNumber')).to.equal(entry.get('traceNumber'));

            batch.generateString(function (string) {
                console.log(string);
            });
        });
    });
});