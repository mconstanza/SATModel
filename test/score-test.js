'use strict';

var should = require('chai').should(),
SAT = require('/js/sat_scoring.js');

describe('SATScoring', function() {
  it('should return a perfect score from an object with all correct answers', function(){
    SAT({
      
    }).should.equal({
      reading: "52",
      writing: "44",
      math1: "20",
      math2: "38"
    });
  });
});
