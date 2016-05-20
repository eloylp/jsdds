

var supertest = require('supertest');
var should = require('should');

var request = supertest.agent('http://localhost:3000');
var server;


describe('Testing index rest api.', function(){


    beforeEach(function(){
        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach(function (done) {
        server.close(done);
    });

    it("Should return 403 because there a are not token set.", function(done){

        request.get('/')
            .expect('Content-Type', /json/)
            .expect(403)
            .end(function (err, res) {
                if(err){
                    throw err;
                }
                done();
            });
    });

    it("Should return 200 because is authenticated.", function(done){
      request.get('/')
          .set('Authorization', 'DEFAULT_TOKEN')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res){
              if(err){
                  throw err;
              }
              done();
          });
    });
});