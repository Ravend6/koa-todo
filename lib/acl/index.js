'use strict';

var _ = require('lodash');

class Acl {
  constructor() {
    this._rulesArray = [];
    this._normalizeRulesArray = [];
  }

  get rulesArray() {
    return this._rulesArray;
  }

  set rulesArray(value){
    this._rulesArray = this._rulesArray.concat(value);
  }

  allow(rulesArray) {
    this.rulesArray = rulesArray;
  }

  normalizeParams(params) {
    if (Object.keys(params).length > 0) {
      this.params = params;
    }
  }

  checkAccess(url, method, roles) {

    for (let r of this.rulesArray) {
      this.currentRoles = r.roles;
      for (let a of r.allows) {
        var params = this.params;
        if (params) {
          var res;
          for (let p in params) {
            res = a.resources.map(url => url.replace(new RegExp(':' + p, 'g'), params[p]));
            for (let p in this.params) {
              res = res.map(url => url.replace(new RegExp(':' + p, 'g'), params[p]));
            }
          }
          if (res.indexOf(url) !== -1) {
            if (a.permissions.indexOf(method) !== -1 ||
              a.permissions.indexOf('*') !== -1) {
              for (let userRole of roles) {
                if (this.currentRoles.indexOf(userRole) !== -1) {
                  return true;
                }
              }
            } else {
              return false;
            }
          }
        }

        if (a.resources.indexOf(url) !== -1) {
          if (a.permissions.indexOf(method) !== -1 ||
            a.permissions.indexOf('*') !== -1) {
            for (let userRole of roles) {
              if (this.currentRoles.indexOf(userRole) !== -1) {
                return true;
              }
            }
          } else {
            return false;
          }
        }
      }

    }

  }
}

module.exports = new Acl();