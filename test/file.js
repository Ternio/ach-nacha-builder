var chai     = require('chai')
    , _        = require('lodash')
    , expect   = chai.expect
    , Entry  = require('../lib/entry')
    , EntryAddenda  = require('../lib/entry-addenda')
    , EntryAddendaReturn  = require('../lib/entry-addenda-return')
    , Batch  = require('../lib/batch')
    , File   = require('../lib/file');

describe('File', function() {
    describe('Create File', function () {

        const routing_number = '011600033';
        const origin_routing = '036001808';
        const company_name = 'Company Name';
        const company_ein = '123456789';

        it('should create a file successfully with batch and entry', function () {
            const ts = new Date();

            const file = new File({
                immediateDestination: routing_number,
                immediateOrigin: origin_routing,
                fileCreationDate: ts,
                fileIdModifier: 'A',
                immediateDestinationName: 'Test Bank',
                immediateOriginName: company_name
            });

            const batch = new Batch({
                serviceClassCode: '220',
                companyName: company_name,
                standardEntryClassCode: 'WEB',
                companyIdentification: company_ein,
                companyEntryDescription: 'Payroll',
                companyDescriptiveDate: ts,
                effectiveEntryDate: ts,
                originatingDFI: origin_routing
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
            file.addBatch(batch);

            // TODO: validations

            /*
            batch.generateString(function (string) {
                console.log(string);
            });
            */

            file.generateFile(function (string) {
                console.log(string);
            });
        });

        it('should create a file successfully with batch, entry, and return addenda', function () {
            const ts = new Date();

            const file = new File({
                immediateDestination: routing_number,
                immediateOrigin: origin_routing,
                fileCreationDate: ts,
                fileIdModifier: 'A',
                immediateDestinationName: 'Test Bank',
                immediateOriginName: company_name
            });

            const batch = new Batch({
                serviceClassCode: '220',
                companyName: company_name,
                standardEntryClassCode: 'WEB',
                companyIdentification: company_ein,
                companyEntryDescription: 'Payroll',
                companyDescriptiveDate: ts,
                effectiveEntryDate: ts,
                originatingDFI: origin_routing
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
            file.addBatch(batch);

            expect(entry.getRecordCount()).to.equal(2);
            expect(entry.get('addendaId')).to.equal('1');
            expect(addenda.get('returnReasonCode')).to.equal('R17');
            expect(addenda.get('addendaInformation')).to.equal('QUESTIONABLE');
            expect(addenda.get('traceNumber')).to.equal(entry.get('traceNumber'));

            file.generateFile(function (string) {
                console.log(string);
            });
        });
    });
});