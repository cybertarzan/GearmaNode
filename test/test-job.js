var should     = require('should'),
    gearmanode = require('../lib/gearmanode'),
    Job        = require('../lib/gearmanode/job').Job,
    protocol   = require('../lib/gearmanode/protocol');


describe('Job', function() {
    var client = gearmanode.client();

    describe('#constructor', function() {
        it('should return default instance of Job', function() {
            var job = new Job(client, { name: 'reverse', payload: 'hi' });
            job.should.be.an.instanceof(Job);
            job.clientOrWorker.should.be.an.instanceof(gearmanode.Client);
            job.name.should.equal('reverse');
            job.payload.should.equal('hi');
            job.background.should.be.false;
            job.priority.should.equal('NORMAL');
            job.encoding.should.equal('utf8');
            should.not.exist(job.jobServer);
        })
        it('should return special instance of Job', function() {
            var job = new Job(client,
                { name: 'reverse', payload: 'hi', background: true, priority: 'HIGH', encoding: 'ascii' }
            );
            job.should.be.an.instanceof(Job);
            job.name.should.equal('reverse');
            job.payload.should.equal('hi');
            job.background.should.be.true;
            job.priority.should.equal('HIGH');
            job.encoding.should.equal('ascii');
        })
        it('should return error when missing mandatory options', function() {
            var job = new Job();
            job.should.be.an.instanceof(Error);
            job = new Job(null);
            job.should.be.an.instanceof(Error);
            job = new Job(true);
            job.should.be.an.instanceof(Error);
            job = new Job({});
            job.should.be.an.instanceof(Error);
            job = new Job({ name: 'foo' });
            job.should.be.an.instanceof(Error);
            job = new Job({ payload: 'foo' });
            job.should.be.an.instanceof(Error);
        })
        it('should return error when incorrect options', function() {
            var job = new Job({ name: 'foo', payload: 'bar', background: 'baz' });
            job.should.be.an.instanceof(Error);
            job = new Job({ name: 'foo', payload: 'bar', priority: 'baz' });
            job.should.be.an.instanceof(Error);
            job = new Job({ name: 'foo', payload: 'bar', encoding: 'baz' });
            job.should.be.an.instanceof(Error);
        })
    })


    describe('#close', function() {
        it('should clean up object', function(done) {
            var c = gearmanode.client();
            var job = new Job(client, { name: 'reverse', payload: 'hi' });
            job.handle = 'H:localhost:22';
            job.clientOrWorker = c;
            job.clientOrWorker.jobs[job.handle] = job;
            job.on('close', function() {
                job.processing.should.be.false;
                job.closed.should.be.true;
                should.not.exist(c.jobs[job.handle]);
                should.not.exist(job.clientOrWorker);
                done();
            })
            job.close();
        })
    })


    describe('#getPacketType', function() {
        it('should return correct packet type', function() {
            var job = new Job(client, { name: 'reverse', payload: 'hi' });
            job.getPacketType().should.equal(protocol.PACKET_TYPES.SUBMIT_JOB);
            job = new Job(client, { name: 'reverse', payload: 'hi', priority: 'LOW' });
            job.getPacketType().should.equal(protocol.PACKET_TYPES.SUBMIT_JOB_LOW);
            job = new Job(client, { name: 'reverse', payload: 'hi', priority: 'HIGH'  });
            job.getPacketType().should.equal(protocol.PACKET_TYPES.SUBMIT_JOB_HIGH);
            job = new Job(client, { name: 'reverse', payload: 'hi', background: true });
            job.getPacketType().should.equal(protocol.PACKET_TYPES.SUBMIT_JOB_BG);
            job = new Job(client, { name: 'reverse', payload: 'hi', background: true, priority: 'LOW' });
            job.getPacketType().should.equal(protocol.PACKET_TYPES.SUBMIT_JOB_LOW_BG);
            job = new Job(client, { name: 'reverse', payload: 'hi', background: true, priority: 'HIGH'  });
            job.getPacketType().should.equal(protocol.PACKET_TYPES.SUBMIT_JOB_HIGH_BG);
        })
    })

})
